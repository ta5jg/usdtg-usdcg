// backend/scripts/oracleBot.js
import { TronWeb } from 'tronweb';
import dotenv from 'dotenv';
import fs from 'fs';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../justland/.env') });

const tronWeb = new TronWeb({
  fullHost: process.env.TRON_FULLHOST,
  privateKey: process.env.PRIVATE_KEY
});

const ROUTER = process.env.SUNSWAP_ROUTER_CONTRACT;
const USDTg = process.env.USDTG_CONTRACT;
const USDT = process.env.USDT_CONTRACT;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const JSON_OUTPUT = './frontend/public/usdtg-price.json';
const DB_LOG = './logs/usdtg-price-log.json';

async function fetchOnChainPrice() {
    const router = await tronWeb.contract().at(ROUTER);
    const path = [USDTg, USDT];
    const amountIn = 1_000_000; // 1 USDTg (6 decimals)
  
    try {
      const res = await router.getAmountsOut(amountIn, path).call();
      
      if (!res || !res.length || !res[1]) {
        throw new Error("getAmountsOut returned invalid result");
      }
  
      return parseInt(res[1]._hex || res[1]); // ._hex varsa TRC20 numeric dönüşümden geliyor olabilir
    } catch (err) {
      console.error("❌ getAmountsOut failed:", err.message);
      return 0;
    }
  }

async function fetchCoinGeckoPrice() {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd');
    const data = await res.json();
    return data?.tether?.usd * 1_000_000; // Normalize to 6 decimals
  } catch (err) {
    console.error("❌ Failed to fetch from CoinGecko:", err);
    return null;
  }
}

async function sendTelegramAlert(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: `📉 [USDTg Oracle Alert]\n${message}`
    })
  });
}

function calculateDeviation(a, b) {
  return Math.abs(a - b) / ((a + b) / 2);
}

(async () => {
  const timestamp = new Date().toISOString();
  const onChainPrice = await fetchOnChainPrice();
  const cgPrice = await fetchCoinGeckoPrice();

  const tvl = (onChainPrice / 1_000_000) * 100_000_000; // Hypothetical TVL
  const deviation = calculateDeviation(onChainPrice, cgPrice);
  const deviationPercent = (deviation * 100).toFixed(2);

  console.log(`📊 On-chain: ${onChainPrice / 1_000_000} USDT`);
  console.log(`🌐 CoinGecko: ${cgPrice / 1_000_000} USDT`);
  console.log(`🔁 Deviation: ${deviationPercent}%`);
  console.log(`💰 Estimated TVL: ~$${tvl.toLocaleString()}`);

  if (deviation > 0.03) {
    await sendTelegramAlert(`Price deviation > 3%\nOn-chain: ${onChainPrice / 1_000_000}\nCoinGecko: ${cgPrice / 1_000_000}`);
  }

  try {
    const token = await tronWeb.contract().at(USDTg);
    const tx = await token.setFixedUSDPrice(onChainPrice).send();
    console.log(`✅ On-chain price updated: ${tx}`);
  } catch (err) {
    console.error("⚠️ Could not update on-chain price:", err.message);
  }

  const priceData = {
    timestamp,
    onChainPrice: onChainPrice / 1_000_000,
    coingeckoPrice: cgPrice / 1_000_000,
    deviationPercent,
    tvl
  };

  fs.writeFileSync(JSON_OUTPUT, JSON.stringify(priceData, null, 2));
  fs.appendFileSync(DB_LOG, JSON.stringify(priceData) + '\n');
})();