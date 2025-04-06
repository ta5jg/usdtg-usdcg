// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/AggregatorV3Interface.sol";

contract MockFeedPrice is AggregatorV3Interface {
    int256 private price;
    uint8 private _decimals;

    constructor(int256 _initialPrice, uint8 decimals_) {
        price = _initialPrice;
        _decimals = decimals_;
    }

    function decimals() external view override returns (uint8) {
        return _decimals;
    }

    function description() external pure override returns (string memory) {
        return "Mock Price Feed";
    }

    function version() external pure override returns (uint256) {
        return 1;
    }

    function getRoundData(uint80) external pure override returns (
        uint80, int256, uint256, uint256, uint80
    ) {
        revert("Not implemented");
    }

    function latestRoundData() external view override returns (
        uint80, int256, uint256, uint256, uint80
    ) {
        return (0, price, 0, 0, 0);
    }

    function updatePrice(int256 newPrice) external {
        price = newPrice;
    }
}