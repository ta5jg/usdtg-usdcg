const TronWeb = require('tronweb');
require('dotenv').config();

async function verifyContract() {
    try {
        const tronWeb = new TronWeb({
            fullHost: 'https://api.trongrid.io',
            privateKey: process.env.PRIVATE_KEY
        });

        const contract = await tronWeb.contract().at(process.env.CONTRACT_ADDRESS);

        // Contract bilgilerini kontrol et
        const name = await contract.name().call();
        const symbol = await contract.symbol().call();
        const decimals = await contract.decimals().call();
        const totalSupply = await contract.totalSupply().call();
        const price = await contract.fixedUSDPrice().call();
        const owner = await contract.owner().call();

        console.log('\n=== Contract Verification ===');
        console.log('Name:', name);
        console.log('Symbol:', symbol);
        console.log('Decimals:', decimals.toString());
        console.log('Total Supply:', totalSupply.toString());
        console.log('Fixed USD Price:', price.toString());
        console.log('Owner:', owner);
        console.log('Contract Address:', process.env.CONTRACT_ADDRESS);

        // Önemli fonksiyonları test et
        console.log('\n=== Testing Functions ===');
        
        // getLatestPrice test
        const latestPrice = await contract.getLatestPrice().call();
        console.log('Latest Price:', latestPrice.toString());

        // usdValue test
        const testAmount = 1000000; // 1 token
        const usdValue = await contract.usdValue(testAmount).call();
        console.log('USD Value of 1 token:', usdValue.toString());

        console.log('\n✅ Contract verification completed successfully!');

    } catch (error) {
        console.error('\n❌ Verification failed:', error);
    }
}

verifyContract();
