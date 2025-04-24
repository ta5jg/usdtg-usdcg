const TronWeb = require("tronweb");
require("dotenv").config();

const USDTgTokenTRC20 = artifacts.require("USDTgTokenTRC20");

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
  const name = "USDTg";
  const symbol = "USDTg";

  const feeWallet = safeHex("FEE_WALLET", process.env.FEE_WALLET);
  const usdtAddress = safeHex("USDT_ADDR", process.env.USDT_ADDR);
  const usdcAddress = safeHex("USDC_ADDR", process.env.USDC_ADDR);
  const oracleAddress = safeHex("ORACLE_ADDR", process.env.ORACLE_ADDR);

  console.log("🚀 Deploying TetherGround USD with:");
  console.log({ feeWallet, usdtAddress, usdcAddress, oracleAddress });

  await deployer.deploy(
    USDTgTokenTRC20,
    name,
    symbol,
    feeWallet,
    usdtAddress,
    usdcAddress,
    oracleAddress
  );
};
