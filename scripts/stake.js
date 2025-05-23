const {TronWeb} = require("tronweb");
require("dotenv").config();

const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io",
    privateKey: process.env.PRIVATE_KEY
});

async function stakeTRX() {
    try {
        const amount = tronWeb.toSun(373); // 373 TRX stake et
        const result = await tronWeb.trx.freezeBalance(amount, 3, "BANDWIDTH");
        console.log("✅ 373 TRX başarıyla Bandwidth için stake edildi:", result);
    } catch (error) {
        console.error("⚠️ Hata oluştu:", error);
    }
}

stakeTRX();