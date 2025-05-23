import { TronWeb } from 'tronweb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import routerABI from '../abi/routerABI.json' assert { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../justland/.env') });

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: process.env.PRIVATE_KEY,
});

function toHexAddress(address) {
  if (!tronWeb.isAddress(address)) throw new Error(`Invalid address: ${address}`);
  return tronWeb.address.toHex(address);
}

const tokenA = process.env.USDTG_CONTRACT;
const tokenB = process.env.WTRX_CONTRACT;
const routerAddress = process.env.ROUTER_CONTRACT;
const ownerAddress = process.env.OWNER_ADDRESS;

async function loadContract(address, name) {
  try {
    return await tronWeb.contract().at(address);
  } catch (err) {
    throw new Error(`❌ Contract load failed: ${name} → ${err.message}`);
  }
}

async function addLiquidity() {
  try {
    console.log('🚀 Starting Sunswap V2 Liquidity Add...');

    const usdtgAmount = tronWeb.toSun(10);  // 10 USDTg
    const wtrxAmount  = tronWeb.toSun(38.6); // 38.6 TRX

    const deadline = Math.floor(Date.now() / 1000) + 600;

    const usdtgContract = await loadContract(tokenA, 'USDTg');
    const wtrxContract = await loadContract(tokenB, 'WTRX');
    const routerContract = await tronWeb.contract(routerABI, routerAddress);

    console.log('🔐 Approving USDTg...');
    await usdtgContract.methods.approve(routerAddress, usdtgAmount).send();

    console.log('🔐 Approving WTRX...');
    await wtrxContract.methods.approve(routerAddress, wtrxAmount).send();

    console.log('💧 Adding liquidity...');

    const tx = await routerContract.addLiquidity(
      tokenA,
      tokenB,
      usdtgAmount,
      wtrxAmount,
      0,
      0,
      ownerAddress,
      deadline
    ).send();

    console.log(`✅ Liquidity added! TxID: ${tx}`);
  } catch (err) {
    console.error(`❌ Liquidity add failed:`, err.message || err);
  }
}

addLiquidity();