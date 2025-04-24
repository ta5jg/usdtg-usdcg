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

function toHexAddress(base58) {
  if (!tronWeb.isAddress(base58)) throw new Error(`Invalid address: ${base58}`);
  return tronWeb.address.toHex(base58);
}

const usdtAddress = toHexAddress(process.env.USDT_CONTRACT);
const usdtgAddress = toHexAddress(process.env.USDTG_CONTRACT);
const routerAddress = toHexAddress(process.env.ROUTER_CONTRACT);
const jmRouterAddress = toHexAddress(process.env.JM_ROUTER_CONTRACT);
const ownerAddress = toHexAddress(process.env.OWNER_ADDRESS);

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

async function notifyTelegram(message) {
  const url = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
  try {
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });
  } catch (err) {
    console.error('Telegram notification failed:', err.message || err);
  }
}

async function safeContractLoad(address, name) {
  try {
    return await tronWeb.contract().at(address);
  } catch (err) {
    throw new Error(`Could not access ${name} contract: ${err.message}`);
  }
}

async function checkAccountResources() {
  try {
    const resources = await tronWeb.trx.getAccountResources(ownerAddress);
    console.log('🔋 Account energy status:', resources);
    await notifyTelegram(`⚡ *Energy Status:*\nBandwidth: ${resources.freeNetUsed}/${resources.freeNetLimit}\nEnergy: ${resources.EnergyUsed}/${resources.EnergyLimit}`);
    return resources;
  } catch (err) {
    console.error('Could not retrieve energy info:', err.message);
    await notifyTelegram(`❌ *Failed to retrieve energy info:*\n${err.message}`);
    return null;
  }
}

async function rentEnergyViaContract() {
  try {
    const jmRouter = await safeContractLoad(jmRouterAddress, 'JustMoneyRouter');

    const amountTRX = tronWeb.toSun(5);
    const duration = 86400;

    const tx = await jmRouter.methods.rentEnergy(duration).send({
      callValue: amountTRX,
      shouldPollResponse: true,
    });

    console.log('⚡ Energy rental successful:', tx);
    await notifyTelegram(`✅ *Energy rental successful!*\nTxID: \`${tx}\``);
  } catch (err) {
    const errorMsg = err.message || JSON.stringify(err);
    console.error('❌ Energy rental error:', errorMsg);
    await notifyTelegram(`❌ *Energy rental error:*\n${errorMsg}`);
  }
}

async function rentEnergyIfLow() {
  const resources = await checkAccountResources();
  if (!resources || resources.EnergyLimit - resources.EnergyUsed > 1000) return;

  await notifyTelegram('⚠️ *Low energy detected. Initiating rental...*');
  await rentEnergyViaContract();
}

async function addLiquidity() {
  try {
    await notifyTelegram(`🚀 *Liquidity bot started.*\nPreparing USDTg - USDT pair...`);

    await rentEnergyIfLow();

    const usdtContract = await safeContractLoad(usdtAddress, 'USDT');
    const usdtgContract = await safeContractLoad(usdtgAddress, 'USDTg');
    const routerContract = await safeContractLoad(routerAddress, 'Router');

    const amountUSDT = tronWeb.toSun(5);
    const amountUSDTg = tronWeb.toSun(5);
    const deadline = Math.floor(Date.now() / 1000) + 600;

    await notifyTelegram(`🔄 Adding liquidity...\n• USDT: 5\n• USDTg: 5\n• Deadline: ${deadline}`);

    await usdtContract.methods.approve(routerAddress, amountUSDT).send();
    await usdtgContract.methods.approve(routerAddress, amountUSDTg).send();

    const tx = await routerContract.methods
      .addLiquidity(
        usdtAddress,
        usdtgAddress,
        amountUSDT,
        amountUSDTg,
        0,
        0,
        ownerAddress,
        deadline
      )
      .send({ shouldPollResponse: true });

    console.log('✅ Liquidity successfully added:', tx);
    await notifyTelegram(`✅ *Liquidity successfully added!*\nTxID: \`${tx}\``);
  } catch (err) {
    const errorMsg = err.message || JSON.stringify(err);
    console.error('❌ Error:', errorMsg);
    await notifyTelegram(`❌ *Liquidity addition error:*\n${errorMsg}`);
  }
}

addLiquidity();