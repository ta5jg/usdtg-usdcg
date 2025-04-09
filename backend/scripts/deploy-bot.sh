#!/bin/bash

echo "🚀 Starting USDTz Swap Bot (JustMoney)"
cd "$(dirname "$0")"
npm install

echo "🔐 Loading environment variables..."
source .env

echo "💡 Launching swap bot..."
node jm-bot.js