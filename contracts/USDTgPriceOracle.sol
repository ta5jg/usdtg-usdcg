// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract USDTgSimplePriceOracle {
    int256 private _price;
    
    constructor(int256 initialPrice) {
        _price = initialPrice;
    }
    
    // Chainlink style interface - cüzdanların beklediği format
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    ) {
        return (
            0,              // roundId
            _price,         // price
            block.timestamp,// startedAt
            block.timestamp,// updatedAt
            0              // answeredInRound
        );
    }
    
    // Standart price getter
    function getPrice() external view returns (int256) {
        return _price;
    }
    
    // Price setter
    function setPrice(int256 newPrice) external {
        require(newPrice > 0, "Price must be positive");
        _price = newPrice;
    }
    
    // Decimals - 8 decimals to match your token
    function decimals() external pure returns (uint8) {
        return 8;
    }
}