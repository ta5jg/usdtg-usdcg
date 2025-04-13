// scripts/checkOwner.js
const TronWeb = require("tronweb");
const fs = require("fs");
require("dotenv").config();

const buildPath = "./build/contracts/USDTgToken.json";
const { abi } = JSON.parse(fs.readFileSync(buildPath));

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io", // mainnet için
  privateKey: process.env.PRIVATE_KEY,
});

(async () => {
  try {
    const contract = await tronWeb.contract(abi, process.env.CONTRACT_USDTg);
    const owner = await contract.owner().call();
    console.log("👑 Contract Owner:", owner);
  } catch (err) {
    console.error("❌ Failed to fetch owner:", err.message || err);
  }
})();