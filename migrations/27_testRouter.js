const USDTgToken = artifacts.require("USDTgToken");

module.exports = function(deployer) {
    deployer.then(async () => {
        try {
            const TOKEN_ADDRESS = "TEpGiLGNB7W9W26LbvtU9wdukrLgLZwFgr";
            
            console.log('Testing price mechanisms...');
            const token = await USDTgToken.at(TOKEN_ADDRESS);
            
            // Get router address
            const router = await token.justMoneyRouter();
            console.log('JustMoney Router address:', router);
            
            // Get USDT address
            const usdt = await token.usdtAddress();
            console.log('USDT address:', usdt);
            
            try {
                console.log('\nTesting getLatestPrice...');
                const livePrice = await token.getLatestPrice();
                console.log('Live price from JustMoney:', livePrice.toString());
            } catch (error) {
                console.error('Error getting live price:', error.message);
            }
            
            try {
                // Test liveUSDValue for 1 token
                const oneToken = '1000000'; // 1 token with 6 decimals
                const liveValue = await token.liveUSDValue(oneToken);
                console.log('\nLive USD value of 1 token:', liveValue.toString());
            } catch (error) {
                console.error('Error getting live USD value:', error.message);
            }
            
        } catch (error) {
            console.error('Main error:', error);
            throw error;
        }
    });
};