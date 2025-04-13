const FlashTetherTRC20 = artifacts.require("FlashTetherTRC20");

module.exports = async function (deployer, network, accounts) {
  
  // Bunları .env'den de çekebilirsin istersen
  const feeWallet = process.env.ADDRESS; // şimdilik deployer
  const usdtAddress = process.env.USDT_ADDRESS; // gerçek USDT adresi gir
  const usdcAddress = process.env.USDC_ADDRESS; // gerçek USDC adresi gir
  const router = process.env.JM_ROUTER; // JustMoney router adresi

  console.log("🚀 Deploying FlashTetherTRC20...");
  await deployer.deploy(FlashTetherTRC20, feeWallet, usdtAddress, usdcAddress, router);
  const instance = await FlashTetherTRC20.deployed();

  console.log("✅ Deployed at:", instance.address);
};