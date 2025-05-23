// migrations/29_newPriceFeed.js
const USDTgToken = artifacts.require("USDTgToken");

module.exports = function(deployer) {
    deployer.then(async () => {
        try {
            const TOKEN_ADDRESS = "TEpGiLGNB7W9W26LbvtU9wdukrLgLZwFgr";
            
            console.log('Starting price update sequence...');
            const token = await USDTgToken.at(TOKEN_ADDRESS);
            
            // İlk fiyat kontrolü
            const initialPrice = await token.fixedUSDPrice();
            console.log('Initial price:', initialPrice.toString());
            
            // Fiyatı $1.01'e güncelle
            console.log('\nStep 1: Updating price to $1.01...');
            await token.setFixedUSDPrice('101000000');
            
            // Güncellemeyi kontrol et
            const midPrice = await token.fixedUSDPrice();
            console.log('Price after first update:', midPrice.toString());
            
            // 10 saniye bekle
            console.log('\nWaiting 10 seconds...');
            await new Promise(resolve => setTimeout(resolve, 10000));
            
            // Fiyatı $1.00'a geri döndür
            console.log('\nStep 2: Updating price back to $1.00...');
            await token.setFixedUSDPrice('100000000');
            
            // Son fiyatı kontrol et
            const finalPrice = await token.fixedUSDPrice();
            console.log('Final price:', finalPrice.toString());
            
            console.log('\nPrice update sequence completed!');
            
        } catch (error) {
            console.error('Error during price update:', error);
            throw error;
        }
    });
};