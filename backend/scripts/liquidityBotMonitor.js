require("dotenv").config();
const TronWeb = require("tronweb");

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey: process.env.PRIVATE_KEY,
});

const usdtgAddress = process.env.USDTG_CONTRACT;
const usdtAddress = process.env.USDT_CONTRACT;
const pairAddress = process.env.PAIR_CONTRACT;
const routerAddress = process.env.ROUTER_CONTRACT;
const walletAddress = process.env.OWNER_ADDRESS;

const CHECK_INTERVAL = 5 * 60 * 1000; // 5 dakika
const THRESHOLD = 0.15; // %15 fark varsa dengele

async function monitorAndRebalance() {
  try {
    console.log("🔍 Likidite durumu kontrol ediliyor...");

    const pairContract = await tronWeb.contract().at(pairAddress);
    const usdtgContract = await tronWeb.contract().at(usdtgAddress);
    const usdtContract = await tronWeb.contract().at(usdtAddress);
    const routerContract = await tronWeb.contract().at(routerAddress);

    // Havuzdaki token bakiyeleri
    const usdtgBalance = await usdtgContract.balanceOf(pairAddress).call();
    const usdtBalance = await usdtContract.balanceOf(pairAddress).call();

    const usdtgAmount = parseInt(usdtgBalance.toString());
    const usdtAmount = parseInt(usdtBalance.toString());

    const ratio = usdtgAmount / usdtAmount;

    console.log(`🔢 USDTg: ${usdtgAmount}, USDT: ${usdtAmount}, Oran: ${ratio.toFixed(2)}`);

    if (Math.abs(1 - ratio) > THRESHOLD) {
      console.log("⚠️ Dengesizlik tespit edildi. Likidite yeniden ekleniyor...");

      const amountUSDT = tronWeb.toSun("50");
      const amountUSDTg = tronWeb.toSun("50");
      const deadline = Math.floor(Date.now() / 1000) + 600;

      // Onay ver
      await usdtContract.approve(routerAddress, amountUSDT).send();
      await usdtgContract.approve(routerAddress, amountUSDTg).send();

      const tx = await routerContract
        .addLiquidity(
          usdtAddress,
          usdtgAddress,
          amountUSDT,
          amountUSDTg,
          0,
          0,
          walletAddress,
          deadline
        )
        .send({ shouldPollResponse: true });

      console.log("✅ Likidite eklendi:", tx);
    } else {
      console.log("✅ Oran dengede, işlem yapılmadı.");
    }
  } catch (err) {
    console.error("❌ Hata:", err.message || err);
  }
}

// Botu çalıştır
setInterval(monitorAndRebalance, CHECK_INTERVAL);
monitorAndRebalance();