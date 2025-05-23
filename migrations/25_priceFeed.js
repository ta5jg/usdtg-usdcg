const USDTgToken = artifacts.require("USDTgToken");

module.exports = function(deployer) {
    deployer.then(async () => {
        try {
            // Token contract address
            const TOKEN_ADDRESS = "TEpGiLGNB7W9W26LbvtU9wdukrLgLZwFgr";
            
            // New Oracle address (hex format)
            const ORACLE_ADDRESS = "414ad7cb9e1eea07cb68c96e78ac714f58a539b1e3";
            
            console.log('Updating price feed...');
            console.log('Token Address:', TOKEN_ADDRESS);
            console.log('Oracle Address:', ORACLE_ADDRESS);
            
            const token = await USDTgToken.at(TOKEN_ADDRESS);
            
            console.log('Setting new price feed address...');
            const tx = await token.setFixedUSDPrice(100000000); // $1.00 with 8 decimals
            
            console.log('Transaction successful!');
            console.log('Transaction ID:', tx.tx);
            
        } catch (error) {
            console.error('Detailed error:', error);
            throw error;
        }
    });
};