const TronWeb = require('tronweb');
const fs = require('fs');
require('dotenv').config();

const tronWeb = new TronWeb({
  fullHost: 'https://api.shasta.trongrid.io',
  privateKey: process.env.PRIVATE_KEY
});

const contractAddress = process.env.CONTRACT_ADDRESS;
const abi = JSON.parse(fs.readFileSync('./build/contracts/USDTgTokenTRC20.json')).abi;

async function main() {
  const contract = await tronWeb.contract(abi, contractAddress);

  const price = await contract.getLatestPrice().call();
  const oneToken = 1_000_000;
  const usdValue = await contract.liveUSDValue(oneToken).call();
  const account = tronWeb.defaultAddress.base58;
  const balance = await contract.balanceOf(account).call();
  const totalValue = await contract.liveUSDValue(balance).call();

  console.log(`📈 1 USDTg'nin USD Fiyatı: ${price.toString()} (8 decimals)`);
  console.log(`💵 1 USDTg = $${(usdValue / 1e8).toFixed(6)}`);
  console.log(`👛 Cüzdan Bakiyesi: ${balance} (${(balance / 1e6).toLocaleString()} USDTg)`);
  console.log(`💰 USD Karşılığı: $${(totalValue / 1e8).toLocaleString()}`);
}

main().catch(console.error);