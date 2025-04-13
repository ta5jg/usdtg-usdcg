// scripts/transferTo.js
const TronWeb = require("tronweb");
const fs = require("fs");
require("dotenv").config();

const buildPath = "./build/contracts/USDTgToken.json";
const { abi } = JSON.parse(fs.readFileSync(buildPath));

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey: process.env.PRIVATE_KEY,
});

const recipient = process.argv[2];
const amountInput = process.argv[3];

if (!recipient || !amountInput) {
  console.error("⚠️ Usage: node scripts/transferTo.js <recipientAddress> <amount>");
  process.exit(1);
}

(async () => {
  try {
    const contract = await tronWeb.contract(abi, process.env.CONTRACT_USDTg);
    const decimals = 6;
    const amount = parseFloat(amountInput) * 10 ** decimals;

    const tx = await contract.transfer(recipient, amount).send();
    console.log(`✅ Transferred ${amountInput} USDTg to ${recipient}: ${tx}`);
  } catch (err) {
    console.error("❌ Transfer failed:", err.message || err);
  }
})();