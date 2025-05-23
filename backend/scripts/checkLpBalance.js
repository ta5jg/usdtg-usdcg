import { TronWeb } from 'tronweb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


dotenv.config({ path: path.resolve(__dirname, '../../justland/.env') });

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: process.env.PRIVATE_KEY
});

const OWNER_ADDRESS = process.env.OWNER_ADDRESS; // base58
const OWNER_ADDRESS_HEX = tronWeb.address.toHex(OWNER_ADDRESS);

// 🔍 LP token contract adresi (USDTg/USDT LP için örnek)
const LP_TOKEN_ADDRESS = '41bd2e3439e93a6be4917c1f0da9dd72e2eca9c41b'; // HEX format

const trc20AbiFragment = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function"
  }
];

async function checkLpBalance() {
  try {
    const contract = await tronWeb.contract(trc20AbiFragment, LP_TOKEN_ADDRESS);
    contract.address = LP_TOKEN_ADDRESS; // safeguard for .send()

    const rawBalance = await contract.methods.balanceOf(OWNER_ADDRESS_HEX).call();
    const decimals = await contract.methods.decimals().call();
    const formatted = Number(rawBalance) / Math.pow(10, Number(decimals));

    console.log(`🔍 LP Token Balance: ${formatted}`);
    console.log(`🔢 Raw: ${rawBalance}`);
    console.log(`🔢 Decimals: ${decimals}`);
  } catch (err) {
    console.error('🔥 Error:', err.message || err);
  }
}

checkLpBalance();