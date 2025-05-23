// migrations/2_deploy_tetherground.js

const TetherGroundUSD = artifacts.require("TetherGroundUSD");
require('dotenv').config();

module.exports = async function(deployer, network, accounts) {
    try {
        console.log('\n=== TetherGround USD Token Deployment ===');
        console.log('Network:', network);
        console.log('Deployer:', accounts[0]);
        console.log('Timestamp:', new Date().toISOString());
        console.log('----------------------------------------');

        // 1. Deploy Contract
        console.log('\n📝 Deploying TetherGroundUSD contract...');
        await deployer.deploy(TetherGroundUSD);
        const token = await TetherGroundUSD.deployed();
        console.log('✅ Contract deployed at:', token.address);

        // 2. Update Token Information
        console.log('\n📝 Updating token information...');
        
        const tokenInfo = {
            description: "TetherGround USD Stablecoin",
            website: "https://tetherground.com",
            logo: "https://your-logo-url.com/logo.png",
            email: "contact@tetherground.com",
            github: "https://github.com/tetherground",
            whitepaper: "https://tetherground.com/whitepaper",
            twitter: "https://twitter.com/tetherground",
            telegram: "https://t.me/tetherground",
            medium: "https://medium.com/@tetherground"
        };

        for (const [key, value] of Object.entries(tokenInfo)) {
            console.log(`Updating ${key}...`);
            await token.updateTokenInfo(key, value);
        }

        // 3. Set Initial Price
        console.log('\n💰 Setting initial price...');
        await token.updatePrice(1000000); // $1.00 with 6 decimals

        // 4. Verify Token Metadata
        console.log('\n🔍 Verifying token metadata...');
        const metadata = await token.getTokenMetadata();
        console.log('Token Metadata:', metadata);

        // 5. Deployment Summary
        console.log('\n=== Deployment Summary ===');
        console.log('Token Name:', await token.name());
        console.log('Token Symbol:', await token.symbol());
        console.log('Decimals:', (await token.decimals()).toString());
        console.log('Total Supply:', (await token.totalSupply()).toString());
        console.log('Contract Address:', token.address);
        console.log('Owner Address:', await token.owner());
        console.log('Initial Price:', (await token.tokenPrice()).toString());
        console.log('------------------------\n');

        // Write deployment info to file
        const fs = require('fs');
        const deploymentInfo = {
            network,
            contractAddress: token.address,
            deployerAddress: accounts[0],
            timestamp: new Date().toISOString(),
            tokenInfo
        };

        fs.writeFileSync(
            `deployment-${network}-${Date.now()}.json`,
            JSON.stringify(deploymentInfo, null, 2)
        );

    } catch (error) {
        console.error('\n❌ Deployment failed:', error);
        throw error;
    }
};
