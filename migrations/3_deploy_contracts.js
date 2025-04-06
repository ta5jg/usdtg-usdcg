require("dotenv").config();
const FlashTetherTRC20 = artifacts.require("FlashTetherTRC20");

module.exports = async function (deployer, network, accounts) {
  const name = "Flash Tether TRC20";
  const symbol = "USDTz";

  const TronWeb = require("tronweb");
  const tronWeb = new TronWeb({
    fullHost: network === 'shasta' ? 'https://api.shasta.trongrid.io' : 'https://api.trongrid.io'
  });

  const feeWalletBase58 = "TDhqMjTnDAUxYraTVLLie9Qd8NDGY91idq";
  const feeWallet = feeWalletBase58.length === 34 ? tronWeb.address.toHex(feeWalletBase58) : feeWalletBase58;
  const usdtAddress = "41a614f803b6fd780986a42c78ec9c7f77e6ded13c";
  const usdcBase58 = "TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8";
  const usdcAddress = tronWeb.address.toHex(usdcBase58);
  
  const priceFeed = process.env.FEED_ADDRESS;
  const priceFeedHex = priceFeed.length === 34 ? tronWeb.address.toHex(priceFeed) : priceFeed;

  await deployer.deploy(
    FlashTetherTRC20,
    name,
    symbol,
    feeWallet,
    usdtAddress,
    usdcAddress,
    priceFeedHex
  );
};
