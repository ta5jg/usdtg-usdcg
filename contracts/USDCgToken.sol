// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FlashTetherTRC20.sol";

contract USDCgToken is FlashTetherTRC20 {
    constructor(
        address _feeWallet,
        address _usdtAddress,
        address _usdcAddress,
        address _priceFeed
    )
        FlashTetherTRC20("CircleGuard USD", "USDCg", _feeWallet, _usdtAddress, _usdcAddress, _priceFeed)
    {
        uint256 initialSupply = 10_000_000 * (10 ** decimals());
        _mint(msg.sender, initialSupply);
    }
}
