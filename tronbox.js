require('dotenv').config();

// tronbox.js
module.exports = {
  networks: {
    mainnet: {
      privateKey: process.env.PRIVATE_KEY || '',
      consume_user_resource_percent: 30,
      fee_limit: 1_000_000_000,
      fullHost: "https://api.trongrid.io",
      network_id: "*"
    },
    shasta: {
      privateKey: process.env.PRIVATE_KEY || '',
      consume_user_resource_percent: 30,
      fee_limit: 1_000_000_000,
      fullHost: "https://api.shasta.trongrid.io",
      network_id: "*"
    },
  }
};