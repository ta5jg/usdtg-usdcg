import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config({ path: './justland/.env' });

const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function testTelegram() {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: '📬 Bu mesaj bot tarafından gönderildi.',
      parse_mode: 'Markdown'
    })
  });

  const json = await res.json();
  console.log(json);
}

testTelegram();