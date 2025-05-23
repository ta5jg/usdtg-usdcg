const { TronWeb } = require("tronweb");
const MockFeedPrice = artifacts.require("MockFeedPrice");

module.exports = async function (deployer, network, accounts) {
  console.log("Deploying MockFeedPrice to network:", network);

  const initialPrice = 100_000_000; // 1.00 USD başlangıç fiyatı (8 decimals)

  await deployer.deploy(MockFeedPrice, initialPrice);

  const instance = await MockFeedPrice.deployed();
  console.log("✅ MockFeedPrice deployed successfully at:", instance.address);

  if (network === 'nile') {
    const tronWeb = new TronWeb({
      fullHost: 'https://api.nileex.io',
    });

    try {
      // Transaction bilgilerini çekelim
      const txInfo = await tronWeb.trx.getTransactionInfo(instance.address);

      console.log('--- Deploy Resource Info ---');
      console.log(`Energy Used: ${txInfo.energy_usage_total ?? 'N/A'}`);
      console.log(`Net Usage (Bandwidth): ${txInfo.net_usage ?? 'N/A'}`);
      console.log(`Fee Paid (Sun): ${txInfo.fee ?? 'N/A'}`);
      console.log('-----------------------------');
    } catch (error) {
      console.error('⚠️ Could not fetch deploy resource info:', error.message);
    }
  }
};