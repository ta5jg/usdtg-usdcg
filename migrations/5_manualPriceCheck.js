const FlashTetherTRC20 = artifacts.require("FlashTetherTRC20");
const MockFeedPrice = artifacts.require("MockFeedPrice");

module.exports = async function (deployer, network, accounts) {
  const contract = await FlashTetherTRC20.at(process.env.CONTRACT_ADDRESS);
  const feed = await MockFeedPrice.at(process.env.FEED_ADDRESS);

  await feed.updatePrice(100000000); // 1 USDTz = 1.00 USD
  console.log("✔️ Fiyat başarıyla güncellendi.");

  const price = await contract.getLatestPrice();
  console.log("📈 Güncel Fiyat (8 decimals):", price.toString());

  const balance = await contract.balanceOf(process.env.DEPLOYER_ADDRESS);
  console.log("👛 Cüzdan Bakiyesi:", balance.toString(), `(${(Number(balance) / 1e6).toLocaleString()} USDTz)`);

  const usd = await contract.liveUSDValue(balance);
  const usdValue = Number(usd) / 1e8;
  console.log("💵 USD Karşılığı:", `$${usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
};