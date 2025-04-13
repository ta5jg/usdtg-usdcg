// scripts/hexToBase58.js
const TronWeb = require("tronweb");

const hexAddress = "4128f83253100550dd182e3bdb8e21d355508a68c1";

try {
  const base58Address = TronWeb.address.fromHex(hexAddress);
  console.log("📦 Hex Address:", hexAddress);
  console.log("🔑 Base58 Address:", base58Address);
} catch (err) {
  console.error("❌ Conversion failed:", err.message || err);
}