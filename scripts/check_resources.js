const {TronWeb} = require("tronweb");
require("dotenv").config();

const tronWeb = new TronWeb({
    fullHost: "https://api.shasta.trongrid.io",
    privateKey: process.env.PRIVATE_KEY
});

async function checkResources() {
    try {
        // Hesap bilgilerini al
        const account = await tronWeb.trx.getAccount();
        console.log("✅ Hesap Adresi:", tronWeb.address.fromHex(account.address));

        // Bandwidth ve Energy kaynaklarını al
        const resources = await tronWeb.trx.getAccountResources(tronWeb.address.fromHex(account.address));

        console.log("✅ Hesap Kaynakları:");
        console.log("🔹 Bandwidth Kullanılan:", resources.freeNetUsed || 0);
        console.log("🔹 Bandwidth Limiti:", resources.freeNetLimit || 0);
        console.log("🔹 Energy Kullanılan:", resources.energyUsed || 0);
        console.log("🔹 Energy Limiti:", resources.energyLimit || 0);

    } catch (error) {
        console.error("⚠️ Hata oluştu:", error);
    }
}

checkResources();