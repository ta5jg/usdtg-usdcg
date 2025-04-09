const TronWeb = require("tronweb");
require("dotenv").config();

const FlashTetherTRC20 = artifacts.require("FlashTetherTRC20");

function safeHex(label, value) {
  try {
    const hex = TronWeb.address.toHex(value.trim());
    console.log(`✅ ${label} → ${hex}`);
    return hex;
  } catch (err) {
    console.error(`❌ ${label} ERROR → ${value}`);
    console.error("↪", err.message);
    process.exit(1); // Anında çık
  }
}

module.exports = async function (deployer) {
  const name = "USDTz";
  const symbol = "USDTz";

  const feeWallet = safeHex("FEE_WALLET", process.env.FEE_WALLET);
  const usdtAddress = safeHex("USDT_ADDR", process.env.USDT_ADDR);
  const usdcAddress = safeHex("USDC_ADDR", process.env.USDC_ADDR);
  const oracleAddress = safeHex("ORACLE_ADDR", process.env.ORACLE_ADDR);

  console.log("🚀 Deploying FlashTetherTRC20 with:");
  console.log({ feeWallet, usdtAddress, usdcAddress, oracleAddress });

  await deployer.deploy(
    FlashTetherTRC20,
    name,
    symbol,
    feeWallet,
    usdtAddress,
    usdcAddress,
    oracleAddress
  );
};