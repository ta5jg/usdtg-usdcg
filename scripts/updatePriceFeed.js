// migrations/25_updatePriceFeed.js

const USDTgToken = artifacts.require("USDTgTokenTRC20");

module.exports = function(deployer) {
    deployer.then(async () => {
        try {
            // Token contract address
            const TOKEN_ADDRESS = "TQeZV4JqRgMRYTUMxpPzxQxqXrfBaQ4jJh"; // Bunu güncel token adresinizle değiştirin
            
            // New Oracle address
            const ORACLE_ADDRESS = "TGnwWypN674yDteHEuzUAxoaGiDuLqX3S6";
            
            console.log('Updating price feed...');
            const token = await USDTgToken.at(TOKEN_ADDRESS);
            
            console.log('Setting new price feed address...');
            await token.setFixedUSDPrice(ORACLE_ADDRESS);
            
            console.log('Price feed updated successfully!');
            console.log('New Oracle Address:', ORACLE_ADDRESS);
            
        } catch (error) {
            console.error('Error during price feed update:', error);
            throw error;
        }
    });
};