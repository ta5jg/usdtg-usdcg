import TronWeb from "tronweb";
import dotenv from "dotenv";
dotenv.config();

const {
  PRIVATE_KEY,
  ADDRESS,
  CONTRACT_USDTg,
  CONTRACT_TRX,
  JM_ROUTER,
} = process.env;

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey: PRIVATE_KEY,
});

async function createPair() {
  const router = await tronWeb.contract().at(JM_ROUTER);
  const tx = await router.createPair(CONTRACT_USDTg, CONTRACT_TRX).send();
  console.log("✅ Pair created:", tx);
}

async function swapVolume() {
  const router = await tronWeb.contract().at(JM_ROUTER);
  const amountIn = tronWeb.toSun("5"); // 5 USDTg or whatever you're swapping

  try {
    const tx = await router
      .swapExactTokensForTokens(
        amountIn,
        0,
        [CONTRACT_USDTg, CONTRACT_TRX],
        ADDRESS,
        Math.floor(Date.now() / 1000) + 60
      )
      .send();
    console.log("🔁 Swap successful:", tx);
  } catch (err) {
    console.error("Swap failed:", err.message);
  }
}

async function startBot() {
  console.log("🤖 Starting bot...");
  while (true) {
    await swapVolume();
    const delay = Math.floor(Math.random() * 60000) + 45000; // 45s to 105s
    console.log(`⏳ Waiting ${delay / 1000}s before next swap...`);
    await new Promise((res) => setTimeout(res, delay));
  }
}

// Optional: First-time setup
// await createPair(); // Uncomment if pair doesn't exist

startBot();