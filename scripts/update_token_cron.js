// update_token_cron.js
const cron = require('node-cron');
const TronWeb = require('tronweb');
const axios = require('axios');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = 'TEpGiLGNB7W9W26LbvtU9wdukrLgLZwFgr';

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    privateKey: PRIVATE_KEY
});

async function updateToken() {
    try {
        console.log(`\n🕒 ${new Date().toISOString()}`);
        console.log('🚀 Starting scheduled token update...');

        const tokenMetadata = {
            name: "TetherGround USD",
            symbol: "USDTg",
            decimals: 6,
            description: "TetherGround USD Stablecoin",
            website: "https://tetherground.com",
            logo: "https://your-logo-url.com/logo.png"
        };

        // Tronscan güncelleme
        await axios.post(
            'https://apilist.tronscan.org/api/token/update',
            {
                contract_address: CONTRACT_ADDRESS,
                ...tokenMetadata
            }
        );

        // Contract güncelleme
        const contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
        await contract.updatePrice(1000000).send({
            feeLimit: 100000000,
            callValue: 0
        });

        console.log('✅ Scheduled update completed successfully!');

    } catch (error) {
        console.error('❌ Error during scheduled update:', error);
    }
}

// Cron schedule ayarları
console.log('🔄 Starting token update service...');

// Her gün gece yarısı çalış
cron.schedule('0 0 * * *', () => {
    updateToken();
});

// Her saat başı fiyat güncelle
cron.schedule('0 * * * *', async () => {
    try {
        const contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
        await contract.updatePrice(1000000).send({
            feeLimit: 100000000,
            callValue: 0
        });
        console.log('💰 Price updated successfully');
    } catch (error) {
        console.error('❌ Price update error:', error);
    }
});

// İlk çalıştırmada hemen güncelle
updateToken();