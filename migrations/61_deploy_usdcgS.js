const TronWeb = require('tronweb');
const USDCgToken = artifacts.require("USDCgToken");

module.exports = async function (deployer) {
  const toHex = TronWeb.address.toHex;

  const feeWallet = toHex(process.env.FEE_WALLET_S);
  const usdtAddress = toHex(process.env.USDT_ADDR);
  const usdcAddress = toHex(process.env.USDC_ADDR);
  const router = toHex(process.env.JM_ROUTER);

  console.log("🔎 Converted Hex Addresses [Shasta]:", {
    feeWallet,
    usdtAddress,
    usdcAddress,
    router
  });

  console.log("🚀 Deploying USDCgToken on Shasta...");
  await deployer.deploy(USDCgToken, feeWallet, usdtAddress, usdcAddress, router);
  console.log("✅ USDCgToken deployed successfully.");
};
