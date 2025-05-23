import { TronWeb } from 'tronweb';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../justland/.env') });

// === ENV'DEN YÜKLENEN DEĞERLER ===
const { PRIVATE_KEY, USDTG_CONTRACT, OWNER_ADDRESS } = process.env;

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: PRIVATE_KEY,
});

async function loadRecipients(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return data
    .split('\n')
    .map((line) => line.trim())
    .filter((addr) => tronWeb.isAddress(addr));
}

async function sendAirdrop(recipient, amountSun, usdtg) {
  try {
    const tx = await usdtg.methods
      .transfer(recipient, amountSun)
      .send({ shouldPollResponse: true });
    console.log(`✅ Sent to ${recipient} | TxID: ${tx}`);
  } catch (err) {
    console.error(`❌ Failed to send to ${recipient}:`, err.message || err);
  }
}

async function main() {
  console.log('🚀 USDTg Airdrop Başlatıldı...');

  const usdtg = await tronWeb.contract().at(tronWeb.address.toHex(USDTG_CONTRACT));
  const recipients = await loadRecipients(path.resolve(__dirname, 'recipients.txt'));

  const amount = tronWeb.toSun(100); // 100 USDTg
  for (let i = 0; i < recipients.length; i++) {
    const addr = recipients[i];
    console.log(`📤 ${i + 1}/${recipients.length}: ${addr}`);
    await sendAirdrop(addr, amount, usdtg);
    await new Promise((r) => setTimeout(r, 250)); // küçük delay ekle
  }

  console.log('🎉 Airdrop tamamlandı!');
}

main();