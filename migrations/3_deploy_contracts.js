const { TronWeb } = require("tronweb");
require("dotenv").config();

const USDTgTokenTRC20 = artifacts.require("USDTgTokenTRC20");

module.exports = async function (deployer, network, accounts) {
  console.log("Deploying USDTgTokenTRC20 to network:", network);

  const FEE_WALLET = process.env.FEE_WALLET;
  const USDT_ADDR = process.env.USDT_ADDR;
  const USDC_ADDR = process.env.USDC_ADDR;
  const JM_ROUTER = process.env.JM_ROUTER;
  const ORACLE_ADDR = process.env.ORACLE_ADDR;
  const MULTISIG_WALLET = process.env.MULTISIG_WALLET;

  if (!FEE_WALLET || !USDT_ADDR || !USDC_ADDR || !JM_ROUTER || !ORACLE_ADDR || !MULTISIG_WALLET) {
    console.error("❌ ERROR: Please make sure all required addresses are set in the .env file.");
    process.exit(1);
  }

  await deployer.deploy(
    USDTgToken,
    FEE_WALLET,
    USDT_ADDR,
    USDC_ADDR,
    JM_ROUTER,
    ORACLE_ADDR,
    MULTISIG_WALLET
  );

  console.log("✅ USDTgTokenTRC20 deployed successfully!");
};