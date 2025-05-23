// update_token_once.js
const TronWeb = require('tronweb');
const axios = require('axios');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = 'TEpGiLGNB7W9W26LbvtU9wdukrLgLZwFgr';

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    privateKey: PRIVATE_KEY
});

async function updateTokenOnce() {
    try {
        console.log('🚀 Starting token update process...');

        // Token metadata
        const tokenMetadata = {
            name: "TetherGround USD",
            symbol: "USDTg",
            decimals: 6,
            description: "TetherGround USD Stablecoin",
            website: "https://tetherground.com",
            logo: "https://your-logo-url.com/logo.png",
            github: "https://github.com/tetherground",
            whitepaper: "https://tetherground.com/whitepaper",
            social: {
                twitter: "https://twitter.com/tetherground",
                telegram: "https://t.me/tetherground"
            }
        };

        // Tronscan güncelleme
        console.log('📝 Updating Tronscan information...');
        await axios.post(
            'https://apilist.tronscan.org/api/token/update',
            {
                contract_address: CONTRACT_ADDRESS,
                ...tokenMetadata
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        // Contract güncelleme
        console.log('📝 Updating contract information...');
        const contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
        await contract.updatePrice(1000000).send({
            feeLimit: 100000000,
            callValue: 0
        });

        console.log('✅ Token update completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

updateTokenOnce();