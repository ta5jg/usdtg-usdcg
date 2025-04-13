// scripts/unpause.js
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
    const tx = await contract.unpause().send();
    console.log("✅ Contract unpaused:", tx);
  } catch (err) {
    console.error("❌ Failed to unpause:", err.message || err);
  }
})();