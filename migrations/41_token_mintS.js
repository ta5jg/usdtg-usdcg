require('dotenv').config();
const TetherGround USD = artifacts.require("TetherGround USD");

module.exports = async function (deployer, network, accounts) {
  try {
    // 1 billion tokens to testnet deployer address
    const deployerAddress = process.env.ADDRESS_S || accounts[0];
    const token = await USDTgTokenTRC20.deployed();

    const amount = 1_000_000_000; // 1 billion tokens, contract handles decimals

    const tx = await token.mint(deployerAddress, amount);
    console.log("✅ Mint successful. TX:", tx);
  } catch (error) {
    console.error("❌ Mint failed:", error);
  }
};