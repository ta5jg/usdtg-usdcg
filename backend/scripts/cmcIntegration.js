import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

// ENV üzerinden çekiyoruz
const API_KEY = process.env.CMC_API_KEY;
const TOKEN_ID = process.env.CMC_TOKEN_ID; // CMC sistemindeki token ID (manüel atanır)
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS; // TRON contract address

// Örnek fiyat ve arz verileri (bunlar backend’den çekilebilir)
const getTokenStats = async () => {
  return {
    price: 1.00, // Sabit fiyat örneği
    market_cap: 1000000, // USDTg arz x fiyat
    total_supply: 1000000000, // token adedi
    circulating_supply: 900000000
  };
};

// Veri gönderme
const pushToCMC = async () => {
  try {
    const stats = await getTokenStats();

    const response = await axios.post(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/info`,
      {
        id: TOKEN_ID,
        contract_address: CONTRACT_ADDRESS,
        platform: 'TRON',
        quote: {
          USD: {
            price: stats.price,
            market_cap: stats.market_cap,
            volume_24h: 0, // İsteğe bağlı
            circulating_supply: stats.circulating_supply,
            total_supply: stats.total_supply
          }
        }
      },
      {
        headers: {
          'X-CMC_PRO_API_KEY': API_KEY,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('✅ CoinMarketCap data push successful:', response.data);
  } catch (err) {
    console.error('❌ Error pushing to CMC:', err.message);
  }
};

pushToCMC();