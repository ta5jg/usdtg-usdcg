// scripts/updateUSDTgPrice.js
const { TronWeb } = require('tronweb');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const USDTG_ADDRESS = process.env.USDTG_ADDRESS;
const JUSTMONEY_ROUTER = process.env.JUSTMONEY_ROUTER;
const SUNSWAP_ROUTER = process.env.SUNSWAP_ROUTER;
const USDT_ADDRESS = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"; // USDT contract

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    privateKey: PRIVATE_KEY
});

// JustMoney'den fiyat al
async function getJustMoneyPrice() {
    try {
        const router = await tronWeb.contract().at(JUSTMONEY_ROUTER);
        const path = [USDTG_ADDRESS, USDT_ADDRESS];
        const amountIn = "1000000"; // 1 USDTg (6 decimals)
        const amounts = await router.getAmountsOut(amountIn, path).call();
        return amounts[1].toString();
    } catch (error) {
        console.error('JustMoney price fetch failed:', error);
        return "0";
    }
}

// SunSwap'tan fiyat al
async function getSunSwapPrice() {
    try {
        const router = await tronWeb.contract().at(SUNSWAP_ROUTER);
        const path = [USDTG_ADDRESS, USDT_ADDRESS];
        const amountIn = "1000000"; // 1 USDTg (6 decimals)
        const amounts = await router.getAmountsOut(amountIn, path).call();
        return amounts[1].toString();
    } catch (error) {
        console.error('SunSwap price fetch failed:', error);
        return "0";
    }
}

// Token fiyatını güncelle
async function updateTokenPrice() {
    try {
        console.log('🚀 Fetching current prices...');
        
        // DEX'lerden fiyatları al
        const [justMoneyPrice, sunSwapPrice] = await Promise.all([
            getJustMoneyPrice(),
            getSunSwapPrice()
        ]);
        
        // Fiyatları sayıya çevir
        const jmPrice = parseInt(justMoneyPrice) || 0;
        const ssPrice = parseInt(sunSwapPrice) || 0;
        
        console.log('JustMoney Price:', jmPrice/1000000);
        console.log('SunSwap Price:', ssPrice/1000000);
        
        // Ortalama fiyatı hesapla
        let priceToSet;
        if (jmPrice === 0 && ssPrice === 0) {
            console.log('⚠️ No valid prices from DEXes, using default price');
            priceToSet = 1000000; // $1.00
        } else if (jmPrice === 0) {
            priceToSet = ssPrice;
        } else if (ssPrice === 0) {
            priceToSet = jmPrice;
        } else {
            priceToSet = Math.floor((jmPrice + ssPrice) / 2);
        }
        
        // Token kontratına bağlan
        const token = await tronWeb.contract().at(USDTG_ADDRESS);
        
        console.log(`Setting price to: $${priceToSet/1000000}`);
        
        // Fiyatı güncelle
        await token.setFixedUSDPrice(priceToSet.toString()).send({
            feeLimit: 100000000
        });
        
        console.log('✅ Price updated successfully');
        
        // Güncellenen fiyatı kontrol et
        const newPrice = await token.fixedUSDPrice().call();
        console.log(`Current token price: $${newPrice/1000000}`);
        
    } catch (error) {
        console.error('❌ Update failed:', error);
        console.error('Error details:', error.message);
    }
}

// Periyodik güncelleme fonksiyonu
async function startPriceUpdates() {
    console.log('Starting price update service...');
    
    // İlk güncellemeyi yap
    await updateTokenPrice();
    
    // Her 5 dakikada bir güncelle
    setInterval(updateTokenPrice, 5 * 60 * 1000);
}

// Scripti çalıştır
startPriceUpdates();