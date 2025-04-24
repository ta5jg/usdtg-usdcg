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
  privateKey: process.env.PRIVATE_KEY
});

const contractPath = './artifacts/USDTgStaking.json'; // derlenmiş ABI ve bytecode
const contractData = JSON.parse(fs.readFileSync(path.resolve(contractPath), 'utf8'));
const { abi, bytecode } = contractData;

async function deploy() {
  try {
    console.log('📦 Deploying USDTgStaking contract...');

    const tx = await tronWeb.contract().new({
      abi,
      bytecode,
      feeLimit: 100_000_000,
      callValue: 0,
      parameters: [process.env.REWARD_TOKEN] // constructor parametresi: token address
    });

    console.log(`✅ Contract deployed at: ${tx.address}`);
  } catch (err) {
    console.error('❌ Error during deployment:', err);
  }
}

deploy();