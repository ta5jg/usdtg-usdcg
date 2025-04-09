import TronWeb from "tronweb";
import dotenv from "dotenv";
dotenv.config();

const { PRIVATE_KEY, ROUTER_ADDR, TOKEN_A, TOKEN_B, WALLET } = process.env;

const tronWeb = new TronWeb({
  fullHost: "https://api.trongrid.io",
  privateKey: PRIVATE_KEY,
});

async function addLiquidity() {
  const router = await tronWeb.contract().at(ROUTER_ADDR);

  const amountADesired = tronWeb.toSun("100"); // 100 USDTz
  const amountBDesired = tronWeb.toSun("100"); // 100 TRX (or USDT)
  const deadline = Math.floor(Date.now() / 1000) + 600;

  const tx = await router
    .addLiquidity(
      TOKEN_A,
      TOKEN_B,
      amountADesired,
      amountBDesired,
      0,
      0,
      WALLET,
      deadline
    )
    .send();

  console.log("💧 Liquidity added:", tx);
}

addLiquidity();