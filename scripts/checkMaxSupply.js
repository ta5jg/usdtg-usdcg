// scripts/checkMaxSupply.js
const TronWeb = require("tronweb");
const fs = require("fs");
require("dotenv").config();

const buildPath = "./build/contracts/USDTgToken.json";
const { abi } = JSON.parse(fs.readFileSync(buildPath));

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey: process.env.PRIVATE_KEY,
});

(async () => {
  try {
    const contract = await tronWeb.contract(abi, process.env.CONTRACT_USDTg);
    const maxSupply = await contract.maxSupply().call();
    const decimals = 6;
    const adjusted = maxSupply / 10 ** decimals;

    console.log(`📈 maxSupply: ${adjusted} USDTg`);
  } catch (err) {
    console.error("❌ Failed to fetch maxSupply:", err.message || err);
  }
})();