const {TronWeb} = require("tronweb");
require("dotenv").config();  // .env dosyanızdan PRIVATE_KEY almak için

const tronWeb = new TronWeb({
                                fullHost: "https://api.trongrid.io",  // Mainnet için
                                privateKey: process.env.PRIVATE_KEY,
                            });

async function checkEnergy() {
    try {
        const account = await tronWeb.trx.getAccount("TJGz93nx1LXPMioQnHH3d7e1XovpnDU1h3"); // TRON adresinizi yazın
        console.log("🔹 Energy Kullanılan:", account.energyUsed || 0);
        console.log("🔹 Energy Limiti:", account.energyLimit || 0);
    } catch (error) {
        console.error("🚨 Hata:", error);
    }
}

checkEnergy();