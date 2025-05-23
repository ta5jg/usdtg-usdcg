const { TronWeb } = require("tronweb");
require("dotenv").config();

const USDCgToken = artifacts.require("USDCgToken");

module.exports = async function (deployer, network, accounts) {
  console.log("Deploying USDCgToken to network:", network);

  const FEE_WALLET = process.env.FEE_WALLET;
  const USDT_ADDRESS = process.env.USDT_ADDR;
  const USDC_ADDRESS = process.env.USDC_ADDR;
  const ROUTER_ADDRESS = process.env.JM_ROUTER;
  const PRICE_FEED_ADDRESS = process.env.ORACLE_ADDR;
  const MULTISIG_WALLET = process.env.MULTISIG_WALLET;

  if (!FEE_WALLET || !USDT_ADDRESS || !USDC_ADDRESS || !ROUTER_ADDRESS || !PRICE_FEED_ADDRESS || !MULTISIG_WALLET) {
    console.error("❌ ERROR: Please make sure all required addresses are set in the .env file.");
    process.exit(1);
  }

  await deployer.deploy(USDCgToken);

  const instance = await USDCgToken.deployed();
  console.log("✅ USDCgToken deployed successfully at:", instance.address);

  await instance.initialize(
    FEE_WALLET,
    USDT_ADDRESS,
    USDC_ADDRESS,
    ROUTER_ADDRESS,
    PRICE_FEED_ADDRESS,
    MULTISIG_WALLET
  );
  console.log("✅ USDCgToken initialized successfully!");

  if (network === 'shasta') {
    const tronWeb = new TronWeb({
      fullHost: 'https://api.shasta.trongrid.io',
    });

    try {
      // Transaction hash çekelim
      const receipt = await tronWeb.trx.getTransactionInfo(instance.address);
      console.log('--- Deploy Resource Info ---');
      console.log(`Energy Used: ${receipt.energy_usage_total ?? 'N/A'}`);
      console.log(`Net Usage (Bandwidth): ${receipt.net_usage ?? 'N/A'}`);
      console.log(`Fee Paid (Sun): ${receipt.fee ?? 'N/A'}`);
      console.log('-----------------------------');
    } catch (error) {
      console.error('⚠️ Could not fetch deploy resource info:', error.message);
    }
  }
};