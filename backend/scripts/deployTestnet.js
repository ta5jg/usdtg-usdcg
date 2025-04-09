import TronWeb from "tronweb";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config();

const tronWeb = new TronWeb({
  fullHost: "https://api.shasta.trongrid.io",
  privateKey: process.env.PRIVATE_KEY,
});

const contractData = JSON.parse(fs.readFileSync("./build/FlashTetherTRC20.json", "utf8"));
const abi = contractData.abi;
const bytecode = contractData.bytecode;

async function deploy() {
  const contract = await tronWeb.contract().new({
    abi,
    bytecode,
    parameters: [
      "USDTz",
      "USDTz",
      tronWeb.address.toHex(process.env.FEE_WALLET.trim()),
      tronWeb.address.toHex(process.env.USDT_ADDR.trim()),
      tronWeb.address.toHex(process.env.USDC_ADDR.trim()),
      tronWeb.address.toHex(process.env.ORACLE_ADDR.trim())
    ]
  });

  console.log("⚠️ PARAMETRE CHECK:");
[
  process.env.FEE_WALLET,
  process.env.USDT_ADDR,
  process.env.USDC_ADDR,
  process.env.ORACLE_ADDR
].forEach((addr, i) => {
  try {
    const hex = tronWeb.address.toHex(addr.trim());
    console.log(`✅ Param ${i + 1}:`, addr, "→", hex);
  } catch (err) {
    console.error(`❌ Param ${i + 1} ERROR:`, addr, err.message);
  }
});
}

deploy(); 