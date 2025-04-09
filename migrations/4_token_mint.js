require('dotenv').config();
const FlashTetherTRC20 = artifacts.require("FlashTetherTRC20");

module.exports = async function (deployer, network, accounts) {
  try {
    const deployerAddress = process.env.ADDRESS || accounts[0];
    const token = await FlashTetherTRC20.deployed();

    const amount = 1_000_000_000; // 1 billion tokens, contract handles decimals

    const tx = await token.mint(deployerAddress, amount);
    console.log("✅ Mint successful. TX:", tx);
  } catch (error) {
    console.error("❌ Mint failed:", error);
  }
};