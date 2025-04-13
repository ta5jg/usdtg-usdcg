// scripts/airdrop.js
const TronWeb = require("tronweb");
const fs = require("fs");
require("dotenv").config();

const buildPath = "./build/contracts/USDTgToken.json";
const { abi } = JSON.parse(fs.readFileSync(buildPath));

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey: process.env.PRIVATE_KEY,
});

// Listeye istediğin adresleri ve miktarları gir (USDTg bazında)
const recipients = [
  { address: "TXYZabc123abc...", amount: 100 },
  { address: "TY789def456def...", amount: 200 },
  { address: "TZZ1g3h4i5j6k...", amount: 150 },
];

(async () => {
  try {
    const contract = await tronWeb.contract(abi, process.env.CONTRACT_USDTg);
    const decimals = 6;

    for (const recipient of recipients) {
      const amount = recipient.amount * 10 ** decimals;
      const tx = await contract.transfer(recipient.address, amount).send();
      console.log(`✅ Sent ${recipient.amount} USDTg to ${recipient.address}: ${tx}`);
    }
  } catch (err) {
    console.error("❌ Airdrop failed:", err.message || err);
  }
})();