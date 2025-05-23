import { TronWeb } from 'tronweb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../justland/.env') });

const userWeb = new TronWeb({
  fullHost: process.env.TRON_FULLHOST,
  privateKey: process.env.PRIVATE_KEY,
});

userWeb.setAddress(process.env.OWNER_ADDRESS);

// 🎯 Adresler: base58 ve hex ayrı ayrı
const ownerAddressBase58 = process.env.OWNER_ADDRESS;
const ownerAddressHex = userWeb.address.toHex(ownerAddressBase58);

userWeb.defaultAddress = {
  hex: ownerAddressHex,
  base58: ownerAddressBase58
};

console.log('🔧 JM_ROUTER_CONTRACT (ENV):', process.env.JM_ROUTER_CONTRACT);
const jmRouterAddress = userWeb.address.toHex(process.env.JM_ROUTER_CONTRACT);
console.log('🔧 Hex jmRouterAddress:', jmRouterAddress);

console.log('👤 ENV OWNER_ADDRESS =', ownerAddressBase58);
console.log('👤 Hex ownerAddress =', ownerAddressHex);

function toHexAddress(base58) {
  if (!base58 || typeof base58 !== 'string') {
    throw new Error(`Address is undefined or not a string: ${base58}`);
  }
  if (!userWeb.isAddress(base58)) {
    throw new Error(`Invalid TRON address format: ${base58}`);
  }
  const hex = userWeb.address.toHex(base58);
  if (!hex || typeof hex !== 'string') {
    throw new Error(`Failed to convert address to hex: ${base58}`);
  }
  return hex;
}

const usdtAddress = toHexAddress(process.env.USDT_CONTRACT);
const usdtgAddress = toHexAddress(process.env.USDTG_CONTRACT);

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
    return await userWeb.contract().at(address);
  } catch (err) {
    throw new Error(`Could not access ${name} contract: ${err.message}`);
  }
}

async function getPairAddress(tokenA, tokenB) {
  try {
    const router = await safeContractLoad(jmRouterAddress, 'JM Router');
    const factoryAddress = await router.methods.factory().call();
    const factory = await safeContractLoad(factoryAddress, 'Factory');
    const pair = await factory.methods.getPair(tokenA, tokenB).call();
    console.log(`🔍 LP Address for ${tokenA} + ${tokenB}: ${pair}`);
    return pair;
  } catch (err) {
    console.error(`🔥 getPairAddress error: ${err.message}`);
    return null;
  }
}

async function removeLiquidity() {
  try {
    await notifyTelegram(`🧹 *Removing ALL liquidity from USDTg pools...*`);

    const trc20AbiFragment = [
      {
        constant: true,
        inputs: [],
        name: "decimals",
        outputs: [{ name: "", type: "uint8" }],
        type: "function"
      },
      {
        constant: true,
        inputs: [{ name: "_owner", type: "address" }],
        name: "balanceOf",
        outputs: [{ name: "balance", type: "uint256" }],
        type: "function"
      },
      {
        constant: false,
        inputs: [
          { name: "_spender", type: "address" },
          { name: "_value", type: "uint256" }
        ],
        name: "approve",
        outputs: [{ name: "success", type: "bool" }],
        type: "function"
      }
    ];

    const routerContract = await safeContractLoad(jmRouterAddress, 'JustMoney Router');

    const poolConfigs = [
      {
        name: 'USDTg/USDT',
        tokenA: usdtgAddress,
        tokenB: usdtAddress,
      },
      {
        name: 'USDTg/TRX',
        tokenA: usdtgAddress,
        tokenB: '41a614f803b6fd780986a42c78ec9c7f77e6ded13c', // TRX HEX
      },
    ];

    for (const pool of poolConfigs) {
      const lpAddress = await getPairAddress(pool.tokenA, pool.tokenB);

      if (!lpAddress || typeof lpAddress !== 'string' || lpAddress.length !== 42 || lpAddress === '410000000000000000000000000000000000000000') {
        const msg = `❌ Invalid LP token address for ${pool.name}: ${lpAddress}`;
        console.log(msg);
        await notifyTelegram(msg);
        continue;
      }

      const lpToken = await userWeb.contract(trc20AbiFragment, lpAddress); // ✅
      lpToken.address = lpAddress; // ✅ şart
      const [liquidity] = await lpToken.methods.balanceOf(ownerAddressHex).call();
      const decimals = await lpToken.methods.decimals().call();
      const formattedLiquidity = Number(liquidity) / Math.pow(10, Number(decimals));
      console.log(`💠 ${pool.name} LP Token balance: ${formattedLiquidity} (raw: ${liquidity})`);

      if (!liquidity || liquidity === '0' || liquidity === 0n) {
        await notifyTelegram(`⚠️ *No LP tokens for ${pool.name}. Skipping.*`);
        continue;
      }

      console.log('🔁 jmRouterAddress =', jmRouterAddress);
      console.log('🔁 liquidity =', liquidity);

      await lpToken.methods.approve(jmRouterAddress, liquidity).send({
        feeLimit: 1_000_000_000,
        shouldPollResponse: true,
        from: ownerAddressBase58 // ✅ ekle bunu
      });

      const tx = await routerContract.methods.removeLiquidity(
        pool.tokenA,
        pool.tokenB,
        liquidity,
        0,
        0,
        ownerAddressHex,
        Math.floor(Date.now() / 1000) + 600
      ).send({
        shouldPollResponse: true,
        from: ownerAddressBase58 // ✅ buraya da
      });

      console.log(`✅ Liquidity removed for ${pool.name}:`, tx);
      await notifyTelegram(`✅ *Liquidity removed for ${pool.name}*\nTxID: \`${tx}\``);
    }

  } catch (err) {
    console.error('❌ Remove liquidity error:', err.message || err);
    await notifyTelegram(`❌ *Remove liquidity error:*\n${err.message}`);
  }
}

removeLiquidity();