// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./USDTgTokenTRC20.sol";

contract USDCgToken is USDTgTokenTRC20 {
    constructor(
        address _feeWallet,
        address _usdtAddress,
        address _usdcAddress,
        address _priceFeed
    )
        USDTgTokenTRC20("CircleGuard USD", "USDCg", _feeWallet, _usdtAddress, _usdcAddress, _priceFeed)
    {
        // No initial mint
    }
}
