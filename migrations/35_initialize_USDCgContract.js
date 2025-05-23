


const USDCgToken = artifacts.require("USDCgToken");

module.exports = async function (deployer, network, accounts) {
  const instance = await USDCgToken.deployed();
  
  await instance.initialize(
    process.env.FEE_WALLET,
    process.env.USDT_ADDR,
    process.env.USDC_ADDR,
    process.env.JM_ROUTER,
    process.env.ORACLE_ADDR,
    process.env.MULTISIG_WALLET
  );

  console.log("✅ USDCgToken initialized successfully!");
};