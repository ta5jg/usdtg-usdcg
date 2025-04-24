require('dotenv').config();
const USDTgTokenTRC20 = artifacts.require("USDTgTokenTRC20");

module.exports = async function (deployer, network, accounts) {
  try {
    // 1 billion tokens to mainnet deployer address
    const deployerAddress = process.env.ADDRESS || accounts[0];
    const token = await TetherGround USD.deployed();

    const amount = 1_000_000_000; // 1 billion tokens, contract handles decimals

    const tx = await token.mint(deployerAddress, amount);
    console.log("✅ Mint successful. TX:", tx);
  } catch (error) {
    console.error("❌ Mint failed:", error);
  }
};