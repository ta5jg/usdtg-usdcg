const { TronWeb } = require('tronweb');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MOCK_PRICE_FEED = 'TMcucqPdKTrudji46RhVvWhH6zi4WTfzKn';

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

async function updateMockPriceFeed() {
    try {
        const priceFeed = await tronWeb.contract(MOCK_PRICE_FEED_ABI, MOCK_PRICE_FEED);
        
        // Mevcut fiyatı kontrol et
        const beforeData = await priceFeed.latestRoundData().call();
        console.log('Current price:', beforeData[1].toString());
        
        // Yeni fiyat: $1.00 (8 decimals)
        const newPrice = 100000000;
        console.log('\nSetting new price:', newPrice);
        
        // Fiyatı güncelle
        const tx = await priceFeed.setPrice(newPrice).send({
            feeLimit: 50000000,
            callValue: 0
        });
        console.log('Transaction:', tx);
        
        // Yeni fiyatı kontrol et
        const afterData = await priceFeed.latestRoundData().call();
        console.log('\nNew price confirmed:', afterData[1].toString());
        
    } catch (error) {
        console.error('Error:', error);
    }
}

updateMockPriceFeed();