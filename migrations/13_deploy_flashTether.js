const TetherGround USD = artifacts.require("TetherGround USD");

module.exports = async function (deployer, network, accounts) {
  
  // Bunları .env'den de çekebilirsin istersen
  const feeWallet = process.env.ADDRESS; // şimdilik deployer
  const usdtAddress = process.env.USDT_ADDRESS; // gerçek USDT adresi gir
  const usdcAddress = process.env.USDC_ADDRESS; // gerçek USDC adresi gir
  const router = process.env.JM_ROUTER; // JustMoney router adresi

  console.log("🚀 Deploying TetherGround USD...");
  await deployer.deploy(USDTgTokenTRC20, feeWallet, usdtAddress, usdcAddress, router);
  const instance = await USDTgTokenTRC20.deployed();

  console.log("✅ Deployed at:", instance.address);
};