#!/bin/bash

# USDTz Launch Kit Full Auto Deploy Script
# ☕ Because the CEO shouldn't lift a finger

set -e

# Step 1: Create project folder
echo "📁 Creating project directory..."
mkdir -p usdtz-launch-kit && cd usdtz-launch-kit

# Step 2: Clone React website boilerplate (replace with actual repo if exists)
echo "🔁 Cloning website..."
git clone https://github.com/YOUR_USERNAME/FlashTetherTRC20.git || mkdir usdtz-website

# Step 3: Add metadata files
echo "📝 Creating CoinGecko metadata..."
cat <<EOF > coingecko-metadata.json
{
  "name": "USDTz",
  "symbol": "USDTz",
  "description": "USDTz is a TRC-20 stablecoin pegged 1:1 to USD, with fixed and oracle-based price control.",
  "contract_address": "[INSERT CONTRACT ADDRESS]",
  "decimals": 6,
  "website": "https://usdtz.io",
  "explorer": "https://tronscan.org/#/token20/[INSERT CONTRACT]",
  "twitter": "https://twitter.com/usdtzofficial",
  "telegram": "https://t.me/usdtz",
  "logo": "https://usdtz.io/logo.png",
  "tags": ["stablecoin", "tron", "defi"]
}
EOF

# Step 4: Write whitepaper
cat <<EOF > whitepaper.md
# The USDTz Protocol: A Tron-Based Stable Asset

USDTz is a TRC-20 stablecoin pegged 1:1 to USD. It uses a fixed price model with Chainlink oracle fallback, supports a transfer fee system, and includes owner-mint control with a capped max supply of 50 billion tokens.

## Tokenomics
- Max Supply: 50,000,000,000
- Fee: 1% per transfer
- Decimals: 6
- Symbol: USDTz
- Chain: Tron

## Roadmap
- Q2 2025: Token launch + DEX liquidity
- Q3 2025: CoinGecko/CMC listings
- Q4 2025: Wallet integrations

## Risks
- Centralized minting authority initially
- Liquidity-driven price credibility
EOF

# Step 5: GitHub Init
echo "🐱 Initializing GitHub repo..."
cd usdtz-website
if [ ! -d ".git" ]; then
  git init
  git add .
  git commit -m "Initial commit for USDTz"
fi

# Reminder to add remote manually
echo "🔗 REMINDER: Run 'git remote add origin <your-repo-url>' if needed"

# Step 6: Deploy to Vercel
echo "☁️ Deploying to Vercel..."
if ! command -v vercel &> /dev/null
then
  echo "Vercel CLI not found, installing..."
  npm install -g vercel
fi
vercel --prod --confirm || echo "⚠️ Vercel deploy skipped (interactive or error)"

# Step 7: Go back and ZIP it all
echo "📦 Creating ZIP archive..."
cd ..
zip -r usdtz-complete-launch-kit.zip usdtz-launch-kit

echo "✅ Done. Your empire has been built. Enjoy your coffee ☕"
