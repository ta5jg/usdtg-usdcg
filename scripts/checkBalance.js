// scripts/checkBalance.js
const TronWeb = require("tronweb");
const fs = require("fs");
require("dotenv").config();

// ✅ Doğru ABI yolunu al
const buildPath = "./build/contracts/USDCgToken.json";
const { abi } = JSON.parse(fs.readFileSync(buildPath));

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY,
});

(async () => {
  try {
    const contract = await tronWeb.contract(abi, process.env.CONTRACT_USDCg);
    const balance = await contract.balanceOf(process.env.ADDRESS).call();

    const decimals = 6;
    const adjusted = balance / 10 ** decimals;

    console.log(`📊 Balance of ${process.env.ADDRESS}: ${adjusted} USDCg`);
  } catch (err) {
    console.error("❌ Failed to fetch balance:", err.message || err);
  }
})();