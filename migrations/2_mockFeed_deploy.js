const fs = require("fs");
const MockPriceFeed = artifacts.require("MockFeedPrice");

module.exports = async function (deployer, network, accounts) {
  const initialPrice = 100000000; // 1.00 USD
  await deployer.deploy(MockPriceFeed, initialPrice, 8);

  const address = MockPriceFeed.address;
  console.log("📡 MockFeedPrice deployed to:", address);

  // .env dosyasını güncelle
  const envPath = ".env";
  let envContent = fs.readFileSync(envPath, "utf-8");

  envContent = envContent.replace(/FEED_ADDRESS=.*/g, `FEED_ADDRESS=${address}`);
  fs.writeFileSync(envPath, envContent);
};
