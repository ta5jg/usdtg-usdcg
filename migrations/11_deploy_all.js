const TronWeb = require('tronweb');
const toHex = TronWeb.address.toHex;

const USDCgToken = artifacts.require("USDCgToken");
const USDTgToken = artifacts.require("USDTgToken");

module.exports = async function (deployer, network, accounts) {
  require("dotenv").config();

  const feeWallet = toHex(process.env.FEE_WALLET_S);
  const usdtAddress = toHex(process.env.USDT_ADDR);
  const usdcAddress = toHex(process.env.USDC_ADDR);
  const router = toHex(process.env.ORACLE_ADDR_S);

  console.log("🔎 Converted Hex Addresses:", {
    feeWallet,
    usdtAddress,
    usdcAddress,
    router
  });

  console.log("🔄 Deploying USDCgToken...");
  await deployer.deploy(USDCgToken, feeWallet, usdtAddress, usdcAddress, router);
  const usdcg = await USDCgToken.deployed();
  console.log("✅ USDCgToken deployed at:", usdcg.address);

  console.log("🔄 Deploying USDTgToken...");
  await deployer.deploy(USDTgToken, feeWallet, usdtAddress, usdcAddress, router);
  const usdtg = await USDTgToken.deployed();
  console.log("✅ USDTgToken deployed at:", usdtg.address);
};