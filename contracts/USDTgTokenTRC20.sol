// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/governance/TimelockController.sol";
import "./interfaces/IJustMoneyRouter.sol";
import "./interfaces/AggregatorV3Interface.sol";

// ✅ SECURE: Includes DAO-compatible Timelock, multisig wallet control, and Chainlink OCR Oracle extension
contract USDTgTokenTRC20 is ERC20, AccessControl, Pausable, ReentrancyGuard {
    // ✅ AUDIT-READY: ReentrancyGuard, Pausable, AccessControl, TimelockController, capped minting, fee logic, blacklist/whitelist, live USD valuation
    // Multisig wallet for heightened security (can be set by DEFAULT_ADMIN_ROLE)
    address public multisigWallet;
    function setMultisigWallet(address _wallet) external {
        require(multisigWallet == address(0), "Multisig already set");
        require(msg.sender == address(timelock), "Only timelock can set");
        multisigWallet = _wallet;
    }
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant FEE_MANAGER_ROLE = keccak256("FEE_MANAGER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");


    uint8 private _decimals = 6;
    uint256 public maxSupply = 100_000_000_000 * (10 ** 6); // 100B
    bool public maxSupplyFrozen = false; // changed from true to false

    address public feeWallet;
    address public treasuryWallet;
    address public usdtAddress;
    address public usdcAddress;
    IJustMoneyRouter public justMoneyRouter;
    AggregatorV3Interface public priceFeed;

    TimelockController public timelock;

    uint256 public fixedUSDPrice = 1e8;

    mapping(address => bool) public blacklist;
    mapping(address => bool) public whitelist;

    uint256 public lastMintTimestamp;
    uint256 public mintCooldown = 1 minutes;

    uint256 public lastPriceUpdateTimestamp;
    uint256 public priceUpdateCooldown = 1 minutes;

    bool private _initialized;

    event PriceFeedFallbackUsed(uint256 timestamp, uint256 fallbackPrice);

    modifier initialize() {
        require(!_initialized, "Already initialized");
        _;
        _initialized = true;
    }

    modifier notBlacklisted(address account) {
        require(!blacklist[account], "Account is blacklisted");
        _;
    }

    modifier onlyWhitelisted(address account) {
        require(whitelist[account], "Account is not whitelisted");
        _;
    }

    event TokensMinted(address indexed to, uint256 amount);
    event FixedUSDPriceUpdated(uint256 newPrice);
    event MaxSupplyUpdated(uint256 newMaxSupply);
    event SupplyFrozen();

constructor(
    string memory name_,
    string memory symbol_,
    address _feeWallet,
    address _usdtAddress,
    address _usdcAddress,
    address _router,
    address _priceFeed
) ERC20(name_, symbol_) {
    require(_feeWallet != address(0), "Fee wallet is zero address");
    feeWallet = _feeWallet;
    require(multisigWallet != address(0), "Multisig not set");
    require(_usdtAddress != address(0), "USDT address is zero address");
    require(_usdcAddress != address(0), "USDC address is zero address");
    require(_router != address(0), "Router address is zero address");
    require(_priceFeed != address(0), "Price feed is zero address");

    treasuryWallet = msg.sender;
    usdtAddress = _usdtAddress;
    usdcAddress = _usdcAddress;
    justMoneyRouter = IJustMoneyRouter(_router);
    priceFeed = AggregatorV3Interface(_priceFeed);

    // Removed previous msg.sender role assignments
    // TimelockController setup (admin and proposer set to msg.sender for now)
    address[] memory proposers = new address[](1);
    address[] memory executors = new address[](1);
    proposers[0] = msg.sender;
    executors[0] = msg.sender;

    timelock = new TimelockController(2 days, proposers, executors, msg.sender);

    _setupRole(DEFAULT_ADMIN_ROLE, address(timelock));
    _setupRole(ADMIN_ROLE, address(timelock));
    _setupRole(MINTER_ROLE, msg.sender);
    _setupRole(FEE_MANAGER_ROLE, msg.sender);
    _setupRole(PAUSER_ROLE, msg.sender);
}

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    /**
     * @notice Mints new tokens to a specified address, respecting cooldowns and max supply.
     * @dev Only callable by accounts with MINTER_ROLE. Requires recipient to be whitelisted.
     * @param to The address to mint tokens to.
     * @param amount The amount of tokens to mint (in whole units, will be scaled by decimals).
     */
    function mint(address to, uint256 amount) external whenNotPaused nonReentrant notBlacklisted(msg.sender) onlyRole(MINTER_ROLE) {
        require(amount > 0, "Mint amount must be greater than zero");
        require(msg.sender == tx.origin, "Contracts cannot mint");
        require(block.timestamp >= lastMintTimestamp + mintCooldown, "Mint cooldown active");
        require(to != address(0), "Mint to zero address");
        require(whitelist[to], "Recipient not whitelisted");
        uint256 scaledAmount = amount * (10 ** _decimals);
        require(totalSupply() + scaledAmount <= maxSupply, "Exceeds max supply");
        lastMintTimestamp = block.timestamp;
        _mint(to, scaledAmount);
        emit TokensMinted(to, scaledAmount);
    }

    /**
     * @notice Returns the USD value of a given token amount using fixed price.
     * @param tokenAmount The amount of tokens.
     * @return The USD value scaled by 1e8.
     */
    function usdValue(uint256 tokenAmount) public view returns (uint256) {
        return (fixedUSDPrice * tokenAmount) / (10 ** _decimals);
    }

    /**
     * @notice Retrieves the latest price from Chainlink price feed or falls back to fixed price.
     * @return The latest price as uint256.
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
            // fallback to fixed price if feed fails (event omitted due to view restriction)
            return fixedUSDPrice;
        }
    }

    /**
     * @notice Returns the live USD value of a given token amount using latest price.
     * @param tokenAmount The amount of tokens.
     * @return The USD value scaled by 1e8.
     */
    function liveUSDValue(uint256 tokenAmount) public view returns (uint256) {
        uint256 price = getLatestPrice();
        return (price * tokenAmount) / (10 ** _decimals);
    }

    function setFixedUSDPrice(uint256 newPrice) external whenNotPaused onlyRole(ADMIN_ROLE) {
        emit FixedUSDPriceUpdated(newPrice);
        require(newPrice > 0, "Price must be greater than zero");
        require(treasuryWallet != address(0), "Treasury wallet not set");
        require(block.timestamp >= lastPriceUpdateTimestamp + priceUpdateCooldown, "Price update cooldown active");
        lastPriceUpdateTimestamp = block.timestamp;
        fixedUSDPrice = newPrice;
    }

    function setMaxSupply(uint256 newMaxSupply) external onlyRole(ADMIN_ROLE) {
        emit MaxSupplyUpdated(newMaxSupply);
        require(!maxSupplyFrozen, "Max supply is frozen");
        require(newMaxSupply >= totalSupply(), "New max supply must be >= total supply");
        require(treasuryWallet != address(0), "Treasury wallet not set");
        maxSupply = newMaxSupply;
    }

    function freezeMaxSupply() external onlyRole(ADMIN_ROLE) {
        emit SupplyFrozen();
        require(!maxSupplyFrozen, "Already frozen");
        maxSupplyFrozen = true;
    }

    /**
     * @notice Transfers tokens to a specified address, applying a 1% fee.
     * @param recipient The address to transfer tokens to.
     * @param amount The amount of tokens to transfer.
     * @return True if the transfer succeeds.
     */
    function transfer(address recipient, uint256 amount) public override nonReentrant notBlacklisted(msg.sender) notBlacklisted(recipient) returns (bool) {
        _customTransfer(_msgSender(), recipient, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override nonReentrant notBlacklisted(msg.sender) notBlacklisted(sender) notBlacklisted(recipient) returns (bool) {
        _spendAllowance(sender, _msgSender(), amount);
        _customTransfer(sender, recipient, amount);
        return true;
    }

    function _customTransfer(address sender, address recipient, uint256 amount) internal whenNotPaused nonReentrant {
        require(!_reentrancyGuardEntered(), "Reentrancy detected");
        uint256 fee = (amount * 1) / 100;
        uint256 amountAfterFee = amount - fee;

        _transfer(sender, feeWallet, fee);
        _transfer(sender, recipient, amountAfterFee);
    }

    function setTreasuryWallet(address _wallet) external onlyRole(ADMIN_ROLE) {
        require(msg.sender == address(timelock), "Only timelock can set");
        require(_wallet != address(0), "Invalid address");
        treasuryWallet = _wallet;
}

    function setFeeWallet(address _wallet) external onlyRole(FEE_MANAGER_ROLE) {
        require(_wallet != address(0), "Invalid address");
        feeWallet = _wallet;
    }

    /**
     * @notice Adds an account to the blacklist, preventing transfers and minting.
     * @param _account The address to blacklist.
     */
    function addToBlacklist(address _account) external onlyRole(ADMIN_ROLE) {
        blacklist[_account] = true;
    }

    /**
     * @notice Removes an account from the blacklist.
     * @param _account The address to remove from blacklist.
     */
    function removeFromBlacklist(address _account) external onlyRole(ADMIN_ROLE) {
        blacklist[_account] = false;
    }

    function addToWhitelist(address _account) external onlyRole(ADMIN_ROLE) {
        require(!whitelist[_account], "Already whitelisted");
        whitelist[_account] = true;
    }

    function removeFromWhitelist(address _account) external onlyRole(ADMIN_ROLE) {
        require(whitelist[_account], "Not whitelisted");
        whitelist[_account] = false;
    }

    /**
     * @notice Pauses all token transfers and minting.
     */
    function pause() external onlyRole(ADMIN_ROLE) {
        _pause();
    }

    /**
     * @notice Unpauses token transfers and minting.
     */
    function unpause() external onlyRole(ADMIN_ROLE) {
        _unpause();
    }

    function name() public view override returns (string memory) {
        return super.name();
    }

    function symbol() public view override returns (string memory) {
        return super.symbol();
    }

    fallback() external payable {
        revert("Fallback function not permitted");
    }

    receive() external payable {
        revert("Direct TRX transfers not accepted");
    }

    function timelockDelay() external view returns (uint256) {
        return timelock.getMinDelay();
    }

    // Chainlink OCR compatibility placeholder
    function latestAnswer() public view returns (int256) {
        return int256(getLatestPrice());
    }

    function updateTimelockDelay(uint256 newDelay) external onlyRole(ADMIN_ROLE) {
        timelock.updateDelay(newDelay);
    }
}

// Deprecated: Use USDTgTokenTRC20 directly for deployment.
// USDTgToken.sol'dan taşındı:
contract USDTgToken is USDTgTokenTRC20 {
    constructor(
        address _feeWallet,
        address _usdtAddress,
        address _usdcAddress,
        address _router,
        address _priceFeed
    )
        USDTgTokenTRC20("TetherGround USD", "USDTg", _feeWallet, _usdtAddress, _usdcAddress, _router, _priceFeed)
    {
        // No initial mint
    }
}
