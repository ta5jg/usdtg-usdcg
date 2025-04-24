// Multi-pair, multi-chain, energy-aware liquidity bot with Telegram notification

import { TronWeb } from 'tronweb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../justland/.env') });

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: process.env.PRIVATE_KEY,
});

function toHex(base58) {
  return tronWeb.address.toHex(base58);
}

const CONTRACTS = {
  usdtg: toHex(process.env.USDTG_CONTRACT),
  usdt: toHex(process.env.USDT_CONTRACT),
  usdd: toHex('TF17BgPaZYbz8oxbjhriubPDsA7ArKoLX3'),
  usdc: toHex('TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8'),
};

const routerAddress = toHex(process.env.JM_ROUTER_CONTRACT);
const ownerAddress = toHex(process.env.OWNER_ADDRESS);
const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

const [,, pairArg, amtA, amtB, maybeDry] = process.argv;
const selectedPair = pairArg?.toLowerCase() || 'usdt';
const amountA = Number(amtA || 50);
const amountB = Number(amtB || (selectedPair === 'trx' ? 196 : 50));
const isDry = maybeDry === '--dry';

async function notifyTelegram(msg) {
  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: msg,
        parse_mode: 'Markdown'
      })
    });
  } catch (err) {
    console.error('Telegram error:', err.message);
  }
}

async function safeLoad(address, label) {
  try {
    return await tronWeb.contract().at(address);
  } catch (err) {
    throw new Error(`Contract load failed (${label}): ${err.message}`);
  }
}

async function checkResources() {
  try {
    const r = await tronWeb.trx.getAccountResources(ownerAddress);
    console.log('⚡ Energy:', r);
    await notifyTelegram(`🔋 *Energy Check*\nBandwidth: ${r.freeNetUsed}/${r.freeNetLimit}\nEnergy: ${r.EnergyUsed}/${r.EnergyLimit}`);
  } catch (err) {
    await notifyTelegram(`⚠️ Energy check failed: ${err.message}`);
  }
}

async function checkBalance(token, label, min) {
  try {
    const raw = await token.methods.balanceOf(ownerAddress).call();
    const amt = tronWeb.fromSun(raw);
    if (Number(amt) < min) {
      await notifyTelegram(`⚠️ *Low balance*: ${label} = ${amt}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`${label} balance error:`, err.message);
    return false;
  }
}

async function run() {
  await notifyTelegram(`🤖 *Liquidity Bot Initiated*\nPair: ${selectedPair.toUpperCase()}\nDry Mode: ${isDry ? 'Yes' : 'No'}`);
  await checkResources();

  const router = await safeLoad(routerAddress, 'Router');
  const usdtg = await safeLoad(CONTRACTS.usdtg, 'USDTg');
  const deadline = Math.floor(Date.now() / 1000) + 600;
  const amtG = tronWeb.toSun(amountA);

  if (selectedPair === 'trx') {
    if (!isDry) {
      await usdtg.methods.approve(routerAddress, amtG).send();
      await router.methods
        .addLiquidityTRX(
          CONTRACTS.usdtg,
          amtG,
          0,
          0,
          ownerAddress,
          deadline
        )
        .send({ callValue: tronWeb.toSun(amountB), shouldPollResponse: true });
    }
    return notifyTelegram(`✅ *USDTg/TRX liquidity added*\nAmount: ${amountA} / ${amountB}`);

  } else {
    const tokenB = await safeLoad(CONTRACTS[selectedPair], selectedPair.toUpperCase());
    const amtB = tronWeb.toSun(amountB);

    const okA = await checkBalance(usdtg, 'USDTg', amountA);
    const okB = await checkBalance(tokenB, selectedPair.toUpperCase(), amountB);
    if (!okA || !okB) return;

    if (!isDry) {
      await tokenB.methods.approve(routerAddress, amtB).send();
      await usdtg.methods.approve(routerAddress, amtG).send();

      await router.methods
        .addLiquidity(CONTRACTS[selectedPair], CONTRACTS.usdtg, amtB, amtG, 0, 0, ownerAddress, deadline)
        .send({ shouldPollResponse: true });
    }
    await notifyTelegram(`✅ *USDTg/${selectedPair.toUpperCase()} liquidity added*\nAmount: ${amountA} / ${amountB}`);
  }
}

run().catch(err => {
  notifyTelegram(`❌ *Bot Error*: ${err.message}`);
  console.error('❌', err.message);
});