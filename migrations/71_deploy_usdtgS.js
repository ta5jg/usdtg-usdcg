const TronWeb = require('tronweb');
const USDTgToken = artifacts.require("USDTgToken");

module.exports = async function (deployer) {
  const toHex = TronWeb.address.toHex;

  const feeWallet = toHex(process.env.FEE_WALLET_S);
  const usdtAddress = toHex(process.env.USDT_ADDR);
  const usdcAddress = toHex(process.env.USDC_ADDR);
  const router = toHex(process.env.JM_ROUTER);

  console.log("🔎 Converted Hex Addresses:", {
    feeWallet,
    usdtAddress,
    usdcAddress,
    router
  });

  console.log("🚀 Deploying USDTgToken...");
  await deployer.deploy(USDTgToken, feeWallet, usdtAddress, usdcAddress, router);
  console.log("✅ USDTgToken deployed successfully.");
};
