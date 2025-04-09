// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IJustMoneyRouter {
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
}