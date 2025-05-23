const { TronWeb } = require('tronweb');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const TRONSCAN_API_KEY = process.env.TRONSCAN_API_KEY; // .env dosyasına eklenmeli

const tronWeb = new TronWeb({
    fullHost: 'https://api.trongrid.io',
    privateKey: PRIVATE_KEY
});

async function updateTokenInfo() {
    try {
        console.log('🚀 Starting token update process...');
        
        const contract = await tronWeb.contract().at(CONTRACT_ADDRESS);
        
        // 1. Token bilgilerini güncelle
        const tokenInfo = {
            name: await contract.name().call(),
            symbol: await contract.symbol().call(),
            decimals: await contract.decimals().call(),
            totalSupply: await contract.totalSupply().call(),
            price: await contract.fixedUSDPrice().call()
        };

        console.log('Current Token Info:', tokenInfo);

        // 2. Tronscan'de token bilgilerini güncelle
        const tronscanData = {
            token_name: "TetherGround USD",
            token_abbr: "USDTg",
            token_description: "TetherGround USD Stablecoin",
            token_url: "https://usdtg.net",
            token_logo: "https://gateway.pinata.cloud/ipfs/bafkreidmrotlmuxjooihz4omwosupptt43apwu7ps5onuizpetdonp7f3u",
            social_media: {
                twitter: "https://twitter.com/tetherground",
                telegram: "https://x.com/usdtgcoin"
            }
        };

        await updateTronscanInfo(CONTRACT_ADDRESS, tronscanData);

        // 3. Fiyat güncelleme (1 USD = 1000000)
        await contract.setFixedUSDPrice(1000000).send({
            feeLimit: 100000000
        });

        console.log('✅ Token update completed successfully!');

    } catch (error) {
        console.error('❌ Error:', error);
        throw error; // Hataları yukarı ilet
    }
}

async function updateTronscanInfo(contractAddress, data) {
    try {
        // Rate limiting için delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch('https://apilist.tronscan.org/api/contract/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'TRON-PRO-API-KEY': TRONSCAN_API_KEY,
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                contract_address: contractAddress,
                token_info: {
                    ...data,
                    overview: {
                        en: data.token_description
                    }
                }
            })
        });

        // Response kontrolü
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await response.text();
            throw new Error(`API returned non-JSON response: ${text}`);
        }

        const result = await response.json();
        console.log('Tronscan Update Result:', result);
        return result;

    } catch (error) {
        console.error('Tronscan Update Error:', error);
        throw error; // Hataları yukarı ilet
    }
}

// Script'i çalıştır
updateTokenInfo().catch(console.error);