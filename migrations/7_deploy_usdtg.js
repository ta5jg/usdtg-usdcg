const USDTgToken = artifacts.require("USDTgToken");

module.exports = async function (deployer, network, accounts) {
  const TronWeb = require('tronweb');
  const toHex = TronWeb.address.toHex;

  const feeWallet = toHex(process.env.FEE_WALLET);
  const usdtAddress = toHex(process.env.USDT_ADDR);
  const usdcAddress = toHex(process.env.USDT_ADDR);
  const router = toHex(process.env.JM_ROUTER);

  console.log("🔎 Converted Hex Addresses:", {
    feeWallet,
    usdtAddress,
    usdcAddress,
    router
  });

  console.log("🚀 Deploying USDTgToken...");
  await deployer.deploy(USDTgToken, feeWallet, usdtAddress, usdcAddress, router);
};