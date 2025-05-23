import { TronWeb } from 'tronweb';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve('./justland/.env');
const tronWeb = new TronWeb({ fullHost: 'https://api.trongrid.io' });

dotenv.config({ path: envPath });

function convertBase58ToHex(address) {
  if (tronWeb.isAddress(address)) {
    return tronWeb.address.toHex(address);
  }
  return address; // already hex or invalid
}

const keysToConvert = [
  'USDTG_CONTRACT',
  'USDT_CONTRACT',
  'WTRX_CONTRACT',
  'ROUTER_CONTRACT',
  'JM_ROUTER_CONTRACT',
  'OWNER_ADDRESS',
  'USDC_ADDR',
  'ORACLE_ADDR',
  'STAKING_CONTRACT_ADDRESS',
  'REWARD_TOKEN',
  'CONTRACT_ADDRESS',
  'LP_TOKEN_CONTRACT_1',
  'LP_TOKEN_CONTRACT_2'
];

console.log('🔄 Base58 → HEX Dönüştürme:');

for (const key of keysToConvert) {
  const val = process.env[key];
  if (!val) continue;
  const converted = convertBase58ToHex(val);
  console.log(`${key}:\n  Base58: ${val}\n  Hex:    ${converted}\n`);
}