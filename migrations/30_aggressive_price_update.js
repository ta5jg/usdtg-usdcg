// migrations/30_aggressive_price_update.js
const USDTgToken = artifacts.require("USDTgToken");

module.exports = function(deployer) {
    deployer.then(async () => {
        try {
            const TOKEN_ADDRESS = "TEpGiLGNB7W9W26LbvtU9wdukrLgLZwFgr";
            
            console.log('Starting aggressive price update sequence...');
            const token = await USDTgToken.at(TOKEN_ADDRESS);
            
            // Fiyatı $2.00'a yükselt
            console.log('\nStep 1: Updating price to $2.00...');
            await token.setFixedUSDPrice('200000000');
            
            // 15 saniye bekle
            console.log('\nWaiting 15 seconds...');
            await new Promise(resolve => setTimeout(resolve, 15000));
            
            // Fiyatı $1.00'a geri döndür
            console.log('\nStep 2: Updating price back to $1.00...');
            await token.setFixedUSDPrice('100000000');
            
            // Son kontrol
            const finalPrice = await token.fixedUSDPrice();
            console.log('\nFinal price:', finalPrice.toString());
            
        } catch (error) {
            console.error('Error during price update:', error);
            throw error;
        }
    });
};