

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IUSDTgOracle {
    function getLatestPrice() external view returns (uint256);
    function decimals() external view returns (uint8);
}

contract USDTgOracleWrapper {
    address public immutable usdtg;
    uint8 public immutable priceDecimals;

    constructor(address _usdtg) {
        require(_usdtg != address(0), "Invalid token address");
        usdtg = _usdtg;
        priceDecimals = IUSDTgOracle(_usdtg).decimals();
    }

    function latestAnswer() external view returns (int256) {
        uint256 price = IUSDTgOracle(usdtg).getLatestPrice();
        require(price > 0, "Invalid price");
        return int256(price);
    }

    function decimals() external view returns (uint8) {
        return priceDecimals;
    }
}