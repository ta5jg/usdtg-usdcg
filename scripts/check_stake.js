const {TronWeb} = require("tronweb");
require("dotenv").config();

const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io",
    privateKey: process.env.PRIVATE_KEY
});

async function checkStake() {
    try {
        const account = await tronWeb.trx.getAccountResources(tronWeb.defaultAddress.base58);

        console.log("✅ Mevcut Stake Edilen TRX Miktarı:");
        console.log("🔹 Bandwidth için Stake Edilen TRX:", account.frozenV2 ? account.frozenV2[0]?.amount / 1e6 || 0 : 0, "TRX");
        console.log("🔹 Energy için Stake Edilen TRX:", account.frozenV2 ? account.frozenV2[1]?.amount / 1e6 || 0 : 0, "TRX");

    } catch (error) {
        console.error("⚠️ Hata oluştu:", error);
    }
}

checkStake();