const USDTgPriceOracle = artifacts.require("USDTgPriceOracle");

module.exports = function(deployer) {
    // Initial price $1.00 (8 decimals)
    const initialPrice = 100000000;
    
    deployer.then(async () => {
        try {
            console.log('Deploying new price oracle...');
            await deployer.deploy(USDTgPriceOracle, initialPrice);
            const oracle = await USDTgPriceOracle.deployed();
            console.log('Oracle deployed at:', oracle.address);
        } catch (error) {
            console.error('Deployment error:', error);
            throw error;
        }
    });
};