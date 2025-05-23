const {TronWeb} = require('tronweb');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const TOKEN_ADDRESS = 'TEpGiLGNB7W9W26LbvtU9wdukrLgLZwFgr';
const MOCK_PRICE_FEED = 'TMcucqPdKTrudji46RhVvWhH6zi4WTfzKn';

// MockPriceFeed ABI
const MOCK_PRICE_FEED_ABI = [
    {
        "inputs": [{"name": "initialPrice", "type": "int256"}],
        "stateMutability": "Nonpayable",
        "type": "Constructor"
    },
    {
        "outputs": [{"type": "uint8"}],
        "name": "decimals",
        "stateMutability": "Pure",
        "type": "Function"
    },
    {
        "outputs": [{"type": "string"}],
        "name": "description",
        "stateMutability": "Pure",
        "type": "Function"
    },
    {
        "outputs": [
            {"type": "uint80"},
            {"type": "int256"},
            {"type": "uint256"},
            {"type": "uint256"},
            {"type": "uint80"}
        ],
        "name": "latestRoundData",
        "stateMutability": "View",
        "type": "Function"
    },
    {
        "inputs": [{"name": "newPrice", "type": "int256"}],
        "name": "setPrice",
        "stateMutability": "Nonpayable",
        "type": "Function"
    }
];

const tronWeb = new TronWeb({
    fullNode: 'https://api.trongrid.io',
    solidityNode: 'https://api.trongrid.io',
    eventServer: 'https://api.trongrid.io',
    privateKey: PRIVATE_KEY
});

async function checkTokenMetadata() {
    try {
        // Token kontratını kontrol et
        const token = await tronWeb.contract().at(TOKEN_ADDRESS);
        
        console.log('Token Contract Info:');
        console.log('Address:', TOKEN_ADDRESS);
        console.log('Name:', await token.name().call());
        console.log('Symbol:', await token.symbol().call());
        console.log('Decimals:', await token.decimals().call());
        console.log('Fixed USD Price:', await token.fixedUSDPrice().call());
        
        // Price Feed kontratını kontrol et
        const priceFeed = await tronWeb.contract(MOCK_PRICE_FEED_ABI, MOCK_PRICE_FEED);
        const latestData = await priceFeed.latestRoundData().call();
        
        console.log('\nPrice Feed Info:');
        console.log('Address:', MOCK_PRICE_FEED);
        console.log('Price:', latestData[1].toString());
        console.log('Decimals:', await priceFeed.decimals().call());
        
        // TronScan için meta veri
        const metadata = {
            token: {
                address: TOKEN_ADDRESS,
                name: await token.name().call(),
                symbol: await token.symbol().call(),
                decimals: (await token.decimals().call()).toString()
            },
            priceFeed: {
                address: MOCK_PRICE_FEED,
                price: latestData[1].toString(),
                decimals: (await priceFeed.decimals().call()).toString()
            }
        };
        
        console.log('\nMetadata for TronScan:');
        console.log(JSON.stringify(metadata, null, 2));
        
    } catch (error) {
        console.error('Error:', error);
    }
}

checkTokenMetadata();