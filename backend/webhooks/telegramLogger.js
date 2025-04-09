require("dotenv").config();
const axios = require("axios");

const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

async function sendTelegramMessage(message) {
  try {
    await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        chat_id: CHAT_ID,
        text: message
      }
    );
    console.log("✅ Message sent to Telegram");
  } catch (err) {
    console.error("❌ Failed to send Telegram message:", err.message);
  }
}

module.exports = sendTelegramMessage;