// SPDX-License-Identifier: MIT
// ❌ [DEPRECATED] This contract has been superseded by USDTgTokenTRC20.sol
// All logic including deployment constructor and interfaces now reside in USDTgTokenTRC20.sol
// This file is retained only for historical reference.
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/IJustMoneyRouter.sol";
import "./interfaces/AggregatorV3Interface.sol";

contract USDTgTokenTRC20 is ERC20, ERC20Burnable, Ownable {
    using SafeMath for uint256;

    address public feeWallet;
    address public usdtAddress;
    address public usdcAddress;
    IJustMoneyRouter public justMoneyRouter;
    AggregatorV3Interface internal priceFeed;

    constructor(
        string memory name,
        string memory symbol,
        address _feeWallet,
        address _usdtAddress,
        address _usdcAddress,
        address _priceFeed
    ) ERC20(name, symbol) {
        feeWallet = _feeWallet;
        usdtAddress = _usdtAddress;
        usdcAddress = _usdcAddress;
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    // Additional contract code...
}