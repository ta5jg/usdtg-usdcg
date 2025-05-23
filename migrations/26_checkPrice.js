const USDTgToken = artifacts.require("USDTgToken");

module.exports = function(deployer) {
    deployer.then(async () => {
        try {
            const TOKEN_ADDRESS = "TEpGiLGNB7W9W26LbvtU9wdukrLgLZwFgr";
            
            console.log('Checking current price...');
            const token = await USDTgToken.at(TOKEN_ADDRESS);
            
            // Get fixed USD price
            const price = await token.fixedUSDPrice();
            console.log('Current fixed USD price:', price.toString());
            
            // Test USD value calculation for 1 token
            const oneToken = '1000000'; // 1 token with 6 decimals
            const usdValue = await token.usdValue(oneToken);
            console.log('USD value of 1 token:', usdValue.toString());
            
        } catch (error) {
            console.error('Error checking price:', error);
            throw error;
        }
    });
};