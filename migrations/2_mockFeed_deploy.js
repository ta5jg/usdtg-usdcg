const fs = require("fs");
const MockFeedPrice = artifacts.require("MockFeedPrice");

module.exports = async function (deployer) {
  const initialPrice = 100000000; // 1.00 USD (8 decimals)
  await deployer.deploy(MockFeedPrice, initialPrice);
};