// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract TetherGroundUSD is ERC20, Ownable, Pausable {
    // Token metadata
    string public constant TOKEN_DESCRIPTION = "TetherGround USD Stablecoin";
    string public constant TOKEN_WEBSITE = "https://tetherground.com";
    string public constant TOKEN_LOGO = "https://your-logo-url.com/logo.png";
    
    // Price feed
    uint256 public tokenPrice = 1000000; // $1.00 with 6 decimals
    uint256 public lastPriceUpdate;
    
    // Token info
    mapping(string => string) public tokenInfo;
    
    event PriceUpdated(uint256 newPrice, uint256 timestamp);
    event TokenInfoUpdated(string key, string value);
    
    constructor() ERC20("TetherGround USD", "USDTg") {
        _mint(msg.sender, 1000000000 * 10**6); // 1 billion tokens
        
        // Initialize token info
        tokenInfo["description"] = TOKEN_DESCRIPTION;
        tokenInfo["website"] = TOKEN_WEBSITE;
        tokenInfo["logo"] = TOKEN_LOGO;
        tokenInfo["email"] = "contact@tetherground.com";
        tokenInfo["github"] = "https://github.com/tetherground";
        tokenInfo["whitepaper"] = "https://tetherground.com/whitepaper";
        
        lastPriceUpdate = block.timestamp;
    }
    
    function decimals() public pure override returns (uint8) {
        return 6;
    }
    
    function updatePrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Invalid price");
        tokenPrice = _newPrice;
        lastPriceUpdate = block.timestamp;
        emit PriceUpdated(_newPrice, block.timestamp);
    }
    
    function updateTokenInfo(string memory key, string memory value) external onlyOwner {
        tokenInfo[key] = value;
        emit TokenInfoUpdated(key, value);
    }
    
    function getTokenMetadata() external view returns (string memory) {
        return string(abi.encodePacked(
            '{"name":"', name(),
            '","symbol":"', symbol(),
            '","decimals":', toString(decimals()),
            ',"logo":"', tokenInfo["logo"],
            '","website":"', tokenInfo["website"],
            '","description":"', tokenInfo["description"],
            '","price_usd":"', toString(tokenPrice),
            '"}'
        ));
    }
    
    // Helper function to convert uint to string
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}