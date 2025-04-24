// utils/telegram.js
require('dotenv').config();
const axios = require('axios');

const sendTelegramMessage = async (text) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: `-${process.env.TELEGRAM_CHAT_ID}`, // dikkat: kanal ID'si negatif başlıyor
      text,
    });
  } catch (err) {
    console.error('❌ Telegram gönderimi başarısız:', err.response?.data || err.message);
  }
};

module.exports = sendTelegramMessage;