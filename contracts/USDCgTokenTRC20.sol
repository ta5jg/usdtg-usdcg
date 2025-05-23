// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/IJustMoneyRouter.sol";
import "./interfaces/AggregatorV3Interface.sol";

/**
 * @title USDCgTokenTRC20
 * @dev A secure TRC20 token implementation with advanced security features
 * @custom:security-contact security@tetherground.com
 */
contract USDCgTokenTRC20 is ERC20, AccessControl, Pausable, ReentrancyGuard {
    using SafeMath for uint256;
    
    // ============ Constants ============
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant FEE_MANAGER_ROLE = keccak256("FEE_MANAGER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant TIMELOCK_ADMIN_ROLE = keccak256("TIMELOCK_ADMIN_ROLE");
    
    // Fee constants
    uint256 public constant FEE_PERCENTAGE = 1; // 1%
    uint256 public constant FEE_DENOMINATOR = 100;
    
    // Cooldown limits
    uint256 public constant MIN_COOLDOWN = 5 minutes;
    uint256 public constant MAX_COOLDOWN = 24 hours;
    
    // Price feed constants
    uint256 public constant PRICE_PRECISION = 1e8;
    uint256 public constant MIN_PRICE = 1e6; // Minimum price of 0.01 USD
    
    // ============ Storage ============
    address public multisigWallet;
    address public feeWallet;
    address public usdtAddress;
    address public usdcAddress;
    IJustMoneyRouter public justMoneyRouter;
    AggregatorV3Interface public priceFeed;
    
    // ============ Mutable Storage ============
    uint8 private _decimals = 6;
    uint256 public maxSupply = 100_000_000_000 * (10 ** 6); // 100B
    bool public maxSupplyFrozen = false;
    
    address public treasuryWallet;
    TimelockController public timelock;
    
    uint256 public fixedUSDPrice = 1e8;
    
    mapping(address => bool) public blacklist;
    mapping(address => bool) public whitelist;
    
    uint256 public lastMintTimestamp;
    uint256 public mintCooldown = 1 minutes;
    
    uint256 public lastPriceUpdateTimestamp;
    uint256 public priceUpdateCooldown = 1 minutes;
    
    bool private _initialized;
    
    // ============ Events ============
    event PriceFeedFallbackUsed(uint256 timestamp, uint256 fallbackPrice);
    event TokensMinted(address indexed to, uint256 amount);
    event FixedUSDPriceUpdated(uint256 newPrice);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event SupplyFrozen();
    event TreasuryWalletUpdated(address indexed oldWallet, address indexed newWallet);
    event BlacklistUpdated(address indexed account, bool blacklisted);
    event WhitelistUpdated(address indexed account, bool whitelisted);
    event CooldownUpdated(string cooldownType, uint256 newCooldown);
    event TimelockDelayUpdated(uint256 newDelay);
    event TimelockOperationScheduled(bytes32 indexed id, address indexed target, uint256 value, bytes data, bytes32 predecessor, bytes32 salt);
    
    // ============ Modifiers ============
    
    
    
    modifier notBlacklisted(address account) {
        require(!blacklist[account], "Account is blacklisted");
        _;
    }
    
    modifier onlyWhitelisted(address account) {
        require(whitelist[account], "Account is not whitelisted");
        _;
    }
    
    modifier onlyTimelock() {
        require(msg.sender == address(timelock), "Caller is not the timelock");
        _;
    }
    
    modifier validCooldown(uint256 newCooldown) {
        require(newCooldown >= MIN_COOLDOWN && newCooldown <= MAX_COOLDOWN, "Cooldown out of bounds");
        _;
    }
    
    // ============ Constructor ============
    /**
     * @dev Empty constructor for proxy/initializable pattern.
     */
    constructor() ERC20("CircleGuard USD", "USDCg") {
        _setupRole(ADMIN_ROLE, msg.sender);
        treasuryWallet = msg.sender;
    }

    /**
     * @dev Initializes the contract with the specified parameters.
     */
    function initialize(
        address _feeWallet,
        address _usdtAddress,
        address _usdcAddress,
        address _router,
        address _priceFeed,
        address _multisigWallet
    ) external onlyRole(ADMIN_ROLE) {
        require(!_initialized, "Already initialized");
        require(_feeWallet != address(0), "Fee wallet is zero address");
        require(_multisigWallet != address(0), "Multisig wallet is zero address");
        require(_usdtAddress != address(0), "USDT address is zero address");
        require(_usdcAddress != address(0), "USDC address is zero address");
        require(_router != address(0), "Router address is zero address");
        require(_priceFeed != address(0), "Price feed is zero address");

        feeWallet = _feeWallet;
        multisigWallet = _multisigWallet;
        usdtAddress = _usdtAddress;
        usdcAddress = _usdcAddress;
        justMoneyRouter = IJustMoneyRouter(_router);
        priceFeed = AggregatorV3Interface(_priceFeed);

        // Initialize timelock with proposers and executors
        address[] memory proposers = new address[](1);
        address[] memory executors = new address[](1);
        proposers[0] = msg.sender;
        executors[0] = msg.sender;

        timelock = new TimelockController(2 days, proposers, executors, msg.sender);

        // Setup roles
        _setupRole(DEFAULT_ADMIN_ROLE, address(timelock));
        _setupRole(ADMIN_ROLE, address(timelock));
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(FEE_MANAGER_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _setupRole(TIMELOCK_ADMIN_ROLE, msg.sender);

        _initialized = true;
    }
    
    // ============ View Functions ============
    /**
     * @dev Returns the number of decimals used to get its user representation
     * @return The number of decimals
     */
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    /**
     * @dev Returns the USD value of a given token amount using fixed price
     * @param tokenAmount The amount of tokens
     * @return The USD value scaled by 1e8
     */
    function usdValue(uint256 tokenAmount) public view returns (uint256) {
        return fixedUSDPrice.mul(tokenAmount).div(10 ** _decimals);
    }
    
    /**
     * @dev Retrieves the latest price from Chainlink price feed or falls back to fixed price
     * @return The latest price as uint256
     */
    function getLatestPrice() public view returns (uint256) {
        try priceFeed.latestRoundData() returns (
            uint80,
            int256 price,
            uint256,
            uint256,
            uint80
        ) {
            require(price > 0, "Invalid price feed");
            return uint256(price);
        } catch {
            return fixedUSDPrice;
        }
    }
    
    /**
     * @dev Returns the live USD value of a given token amount using latest price
     * @param tokenAmount The amount of tokens
     * @return The USD value scaled by 1e8
     */
    function liveUSDValue(uint256 tokenAmount) public view returns (uint256) {
        uint256 price = getLatestPrice();
        return price.mul(tokenAmount).div(10 ** _decimals);
    }
    
    /**
     * @dev Returns the current timelock delay
     * @return The current timelock delay in seconds
     */
    function timelockDelay() external view returns (uint256) {
        return timelock.getMinDelay();
    }
    
    /**
     * @dev Chainlink OCR compatibility function
     * @return The latest price as int256
     */
    function latestAnswer() public view returns (int256) {
        return int256(getLatestPrice());
    }
    
    // ============ State-Changing Functions ============
    /**
     * @dev Mints new tokens to a specified address, respecting cooldowns and max supply
     * @param to The address to mint tokens to
     * @param amount The amount of tokens to mint (in whole units, will be scaled by decimals)
     */
    function mint(address to, uint256 amount) external whenNotPaused nonReentrant notBlacklisted(msg.sender) onlyRole(MINTER_ROLE) {
        require(amount > 0, "Mint amount must be greater than zero");
        require(msg.sender == tx.origin, "Contracts cannot mint");
        require(block.timestamp >= lastMintTimestamp.add(mintCooldown), "Mint cooldown active");
        require(to != address(0), "Mint to zero address");
        require(whitelist[to], "Recipient not whitelisted");
        
        uint256 scaledAmount = amount.mul(10 ** _decimals);
        require(totalSupply().add(scaledAmount) <= maxSupply, "Exceeds max supply");
        
        lastMintTimestamp = block.timestamp;
        _mint(to, scaledAmount);
        emit TokensMinted(to, scaledAmount);
    }
    
    /**
     * @dev Sets the fixed USD price with cooldown protection
     * @param newPrice The new fixed USD price
     */
    function setFixedUSDPrice(uint256 newPrice) external whenNotPaused onlyRole(ADMIN_ROLE) {
        require(newPrice >= MIN_PRICE, "Price too low");
        require(treasuryWallet != address(0), "Treasury wallet not set");
        require(block.timestamp >= lastPriceUpdateTimestamp.add(priceUpdateCooldown), "Price update cooldown active");
        
        lastPriceUpdateTimestamp = block.timestamp;
        fixedUSDPrice = newPrice;
        emit FixedUSDPriceUpdated(newPrice);
    }
    
    /**
     * @dev Sets the maximum supply of tokens
     * @param newMaxSupply The new maximum supply
     */
    function setMaxSupply(uint256 newMaxSupply) external onlyRole(ADMIN_ROLE) {
        require(!maxSupplyFrozen, "Max supply is frozen");
        require(newMaxSupply >= totalSupply(), "New max supply must be >= total supply");
        require(treasuryWallet != address(0), "Treasury wallet not set");
        
        maxSupply = newMaxSupply;
        emit MaxSupplyUpdated(newMaxSupply);
    }
    
    /**
     * @dev Freezes the maximum supply, preventing further changes
     */
    function freezeMaxSupply() external onlyRole(ADMIN_ROLE) {
        require(!maxSupplyFrozen, "Already frozen");
        maxSupplyFrozen = true;
        emit SupplyFrozen();
    }
    
    /**
     * @dev Transfers tokens to a specified address, applying a fee
     * @param recipient The address to transfer tokens to
     * @param amount The amount of tokens to transfer
     * @return True if the transfer succeeds
     */
    function transfer(address recipient, uint256 amount) public override notBlacklisted(msg.sender) notBlacklisted(recipient) returns (bool) {
        _customTransfer(msg.sender, recipient, amount);
        return true;
    }
    
    /**
     * @dev Transfers tokens from one address to another, applying a fee
     * @param sender The address to transfer tokens from
     * @param recipient The address to transfer tokens to
     * @param amount The amount of tokens to transfer
     * @return True if the transfer succeeds
     */
    function transferFrom(address sender, address recipient, uint256 amount) public override notBlacklisted(msg.sender) notBlacklisted(sender) notBlacklisted(recipient) returns (bool) {
        _customTransfer(sender, recipient, amount);
        _spendAllowance(sender, _msgSender(), amount);
        return true;
    }
    
    /**
     * @dev Internal function to handle transfers with fee calculation
     * @param sender The address to transfer tokens from
     * @param recipient The address to transfer tokens to
     * @param amount The amount of tokens to transfer
     */
    function _customTransfer(address sender, address recipient, uint256 amount) internal whenNotPaused {
        require(!_reentrancyGuardEntered(), "Reentrancy detected");
        
        uint256 fee = amount.mul(FEE_PERCENTAGE).div(FEE_DENOMINATOR);
        uint256 amountAfterFee = amount.sub(fee);
        
        _transfer(sender, feeWallet, fee);
        _transfer(sender, recipient, amountAfterFee);
    }
    
    /**
     * @dev Sets the treasury wallet address
     * @param _wallet The new treasury wallet address
     */
    function setTreasuryWallet(address _wallet) external onlyRole(ADMIN_ROLE) {
        require(_wallet != address(0), "Invalid address");
        address oldWallet = treasuryWallet;
        treasuryWallet = _wallet;
        emit TreasuryWalletUpdated(oldWallet, _wallet);
    }
    
    /**
     * @dev Adds an account to the blacklist, preventing transfers and minting
     * @param _account The address to blacklist
     */
    function addToBlacklist(address _account) external onlyRole(ADMIN_ROLE) {
        require(_account != address(0), "Invalid address");
        require(!blacklist[_account], "Already blacklisted");
        blacklist[_account] = true;
        emit BlacklistUpdated(_account, true);
    }
    
    /**
     * @dev Removes an account from the blacklist
     * @param _account The address to remove from blacklist
     */
    function removeFromBlacklist(address _account) external onlyRole(ADMIN_ROLE) {
        require(_account != address(0), "Invalid address");
        require(blacklist[_account], "Not blacklisted");
        blacklist[_account] = false;
        emit BlacklistUpdated(_account, false);
    }
    
    /**
     * @dev Adds an account to the whitelist
     * @param _account The address to whitelist
     */
    function addToWhitelist(address _account) external onlyRole(ADMIN_ROLE) {
        require(_account != address(0), "Invalid address");
        require(!whitelist[_account], "Already whitelisted");
        whitelist[_account] = true;
        emit WhitelistUpdated(_account, true);
    }
    
    /**
     * @dev Removes an account from the whitelist
     * @param _account The address to remove from whitelist
     */
    function removeFromWhitelist(address _account) external onlyRole(ADMIN_ROLE) {
        require(_account != address(0), "Invalid address");
        require(whitelist[_account], "Not whitelisted");
        whitelist[_account] = false;
        emit WhitelistUpdated(_account, false);
    }
    
    /**
     * @dev Pauses all token transfers and minting
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpauses token transfers and minting
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Updates the mint cooldown period
     * @param newCooldown The new cooldown period in seconds
     */
    function setMintCooldown(uint256 newCooldown) external onlyRole(ADMIN_ROLE) validCooldown(newCooldown) {
        mintCooldown = newCooldown;
        emit CooldownUpdated("mint", newCooldown);
    }
    
    /**
     * @dev Updates the price update cooldown period
     * @param newCooldown The new cooldown period in seconds
     */
    function setPriceUpdateCooldown(uint256 newCooldown) external onlyRole(ADMIN_ROLE) validCooldown(newCooldown) {
        priceUpdateCooldown = newCooldown;
        emit CooldownUpdated("price", newCooldown);
    }
    
    /**
     * @dev Updates the timelock delay
     * @param newDelay The new delay in seconds
     */
    function updateTimelockDelay(uint256 newDelay) external onlyRole(TIMELOCK_ADMIN_ROLE) {
        require(newDelay >= 1 days, "Delay too short");
        timelock.updateDelay(newDelay);
        emit TimelockDelayUpdated(newDelay);
    }
    
    // ============ Timelock Wrapper Functions ============
    /**
     * @dev Schedules a call to setFixedUSDPrice through the timelock
     * @param newPrice The new fixed USD price
     * @param salt The salt for the operation
     */
    function scheduleSetFixedUSDPrice(uint256 newPrice, bytes32 salt) external onlyRole(ADMIN_ROLE) {
        bytes memory data = abi.encodeWithSignature("setFixedUSDPrice(uint256)", newPrice);
        bytes32 id = timelock.hashOperation(address(this), 0, data, bytes32(0), salt);
        timelock.schedule(address(this), 0, data, bytes32(0), salt, timelock.getMinDelay());
        emit TimelockOperationScheduled(id, address(this), 0, data, bytes32(0), salt);
    }
    
    /**
     * @dev Schedules a call to setMaxSupply through the timelock
     * @param newMaxSupply The new maximum supply
     * @param salt The salt for the operation
     */
    function scheduleSetMaxSupply(uint256 newMaxSupply, bytes32 salt) external onlyRole(ADMIN_ROLE) {
        bytes memory data = abi.encodeWithSignature("setMaxSupply(uint256)", newMaxSupply);
        bytes32 id = timelock.hashOperation(address(this), 0, data, bytes32(0), salt);
        timelock.schedule(address(this), 0, data, bytes32(0), salt, timelock.getMinDelay());
        emit TimelockOperationScheduled(id, address(this), 0, data, bytes32(0), salt);
    }
    
    /**
     * @dev Schedules a call to freezeMaxSupply through the timelock
     * @param salt The salt for the operation
     */
    function scheduleFreezeMaxSupply(bytes32 salt) external onlyRole(ADMIN_ROLE) {
        bytes memory data = abi.encodeWithSignature("freezeMaxSupply()");
        bytes32 id = timelock.hashOperation(address(this), 0, data, bytes32(0), salt);
        timelock.schedule(address(this), 0, data, bytes32(0), salt, timelock.getMinDelay());
        emit TimelockOperationScheduled(id, address(this), 0, data, bytes32(0), salt);
    }
    
    // ============ Override Functions ============
    /**
     * @dev Returns the name of the token
     * @return The name of the token
     */
    function name() public view override returns (string memory) {
        return super.name();
    }
    
    /**
     * @dev Returns the symbol of the token
     * @return The symbol of the token
     */
    function symbol() public view override returns (string memory) {
        return super.symbol();
    }
    
    // ============ Fallback Functions ============
    /**
     * @dev Fallback function that reverts
     */
    fallback() external payable {
        revert("Fallback function not permitted");
    }
    
    /**
     * @dev Receive function that reverts
     */
    receive() external payable {
        revert("Direct TRX transfers not accepted");
    }
}

// Deprecated: Use USDCgTokenTRC20 directly for deployment.
// USDCgToken.sol'dan taşındı:
contract USDCgToken is USDCgTokenTRC20 {
    constructor() USDCgTokenTRC20() {
        // No initial mint
    }
}
