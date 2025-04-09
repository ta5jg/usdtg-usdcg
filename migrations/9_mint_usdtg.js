require("dotenv").config();
const USDTgToken = artifacts.require("USDTgToken");
const Web3 = require("web3");
const web3 = new Web3();
const BN = web3.utils.BN;

module.exports = async function (deployer, network, accounts) {
  try {
    const deployerAddress = process.env.ADDRESS || accounts[0];
    const rawAmount = process.env.MINT_AMOUNT;
    const tokenAddress = process.env.CONTRACT_USDTg;
    const recipient = process.env.ADDRESS;

    if (!recipient) throw new Error("❌ Recipient address is undefined.");
    if (!rawAmount || rawAmount.trim() === "") throw new Error("❌ MINT_AMOUNT is empty.");
    if (!tokenAddress || tokenAddress.trim() === "") throw new Error("❌ CONTRACT_USDTg is missing.");

    const cleanedAmount = rawAmount.replace(/[_\s,]/g, "");
    if (!/^\d+$/.test(cleanedAmount)) {
      throw new Error("❌ MINT_AMOUNT must be a numeric string.");
    }

    const token = await USDTgToken.at(tokenAddress);
    const decimals = 6;
    const parsedAmount = new BN(cleanedAmount).mul(new BN(10).pow(new BN(decimals)));

    console.log("💡 Deployer address:", deployerAddress);
    console.log("📍 Recipient address:", recipient);
    console.log("📦 MINT_AMOUNT (raw):", rawAmount);
    console.log("🔢 Parsed amount (BN):", parsedAmount.toString());

    const tx = await token.mint(recipient, parsedAmount.toString());
    console.log("✅ Mint successful. TX:", tx.tx || tx);
  } catch (error) {
    console.error("❌ Mint failed:", error.message || error);
  }
};