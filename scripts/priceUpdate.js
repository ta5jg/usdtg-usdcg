const TronWeb = require('tronweb');
const cron = require('node-cron');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    privateKey: PRIVATE_KEY
});

async function updatePrice() {
    try {
        const contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
        
        // Sabit fiyat: 1 USD = 1000000 (6 decimals)
        await contract.setFixedUSDPrice(1000000).send({
            feeLimit: 100000000
        });

        console.log('✅ Price updated successfully:', new Date());
    } catch (error) {
        console.error('❌ Price update error:', error);
    }
}

// Her saat başı fiyat güncelle
cron.schedule('0 * * * *', () => {
    updatePrice();
});

console.log('💫 Price update service started');
updatePrice(); // İlk güncellemeyi hemen yap