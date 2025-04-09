const USDTgToken = artifacts.require("USDTgToken");

module.exports = async function (deployer, network, accounts) {
  const TronWeb = require('tronweb');
  const toHex = TronWeb.address.toHex;

  const feeWallet = toHex(process.env.FEE_WALLET);
  const usdtAddress = toHex("41a614f803b6fd780986a42c78ec9c7f77e6ded13c");
  const usdcAddress = toHex("414158d5b1a16804dbbc94128babe3b7b0a3b77da4");
  const router = toHex("419c57a62a50d8d6b79d4716827e12213aa23b6fb2");

  console.log("🔎 Converted Hex Addresses:", {
    feeWallet,
    usdtAddress,
    usdcAddress,
    router
  });

  console.log("🚀 Deploying USDTgToken...");
  await deployer.deploy(USDTgToken, feeWallet, usdtAddress, usdcAddress, router);
};