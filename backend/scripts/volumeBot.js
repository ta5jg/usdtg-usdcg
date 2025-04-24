// Multi-pair, multi-chain, energy-aware liquidity bot with Telegram notification

import { TronWeb } from 'tronweb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import BigNumber from 'bignumber.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../justland/.env') });

const tronWeb = new TronWeb({
  fullHost: process.env.TRON_NODE_URL,
  privateKey: process.env.PRIVATE_KEY,
});

const TOKEN_A = process.env.USDTG_CONTRACT;
const TOKEN_B = process.env.USDT_CONTRACT;
const ROUTER_ADDRESS = process.env.ROUTER_CONTRACT;

const AMOUNT = 1 * 10 ** 6; // 1 USDTg
const SLIPPAGE = 10; // %1

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function approve(tokenAddress, spender, amount) {
  const contract = await tronWeb.contract().at(tokenAddress);
  const tx = await contract.approve(spender, amount).send();
  console.log(`✅ Approved ${amount} from ${tokenAddress} to ${spender}`);
  return tx;
}

async function swap(tokenIn, tokenOut, amountIn) {
  const contract = await tronWeb.contract().at(ROUTER_ADDRESS);
  const path = [tokenIn, tokenOut];
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

  const minOut = 1; // set minimum to avoid failure; update if needed

  try {
    const tx = await contract
      .swapExactTokensForTokens(amountIn, minOut, path, tronWeb.defaultAddress.base58, deadline)
      .send();
    console.log(`✅ Swapped ${tokenIn} → ${tokenOut}`);
    return tx;
  } catch (error) {
    console.error("❌ Error in swap:", error.message);
  }
}

function getRandomAmount() {
  const min = 10;
  const max = 50;
  const random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random * 10 ** 6; // 6 decimals
}

async function loop() {
  console.log("🚀 Volume bot is starting...");
  while (true) {
    try {
      const amount1 = getRandomAmount();
      console.log(`🟢 Swapping ${amount1 / 1e6} USDTg → USDT...`);
      await approve(TOKEN_A, ROUTER_ADDRESS, amount1);
      await swap(TOKEN_A, TOKEN_B, amount1);

      const amount2 = getRandomAmount();
      console.log(`🟢 Swapping ${amount2 / 1e6} USDT → USDTg...`);
      await approve(TOKEN_B, ROUTER_ADDRESS, amount2);
      await swap(TOKEN_B, TOKEN_A, amount2);
    } catch (err) {
      console.error("❌ Error in volume cycle:", err.message);
    }

    await delay(Math.random() * 7000 + 3000); // Random delay between 3s–10s
  }
}

loop();