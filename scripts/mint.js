// scripts/mint.js
const TronWeb = require("tronweb");
const fs = require("fs");
require("dotenv").config();

const buildPath = "./build/USDTgTokenTRC20.json";
const { abi } = JSON.parse(fs.readFileSync(buildPath));

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY,
});

(async () => {
  try {
    const contractAddress = process.env.TOKEN_A.trim();
    const contract = await tronWeb.contract(abi, contractAddress);

    const amount = 1_000_000_000; // 1B units - contract will scale to decimals

    const tx = await contract.mint(process.env.ADDRESS, amount).send({
      feeLimit: 100_000_000,
    });

    console.log(`✅ Minted 1,000,000,000 USDTg to ${process.env.ADDRESS}`);
    console.log("📦 Tx ID:", tx);
  } catch (err) {
    console.error("❌ Minting failed:", err.message || err);
  }
})();
