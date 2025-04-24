import { useEffect, useState } from "react";
import { ethers } from "ethers";
import tokenAbi from "./abi/USDTgTokenTRC20.json";
import priceFeedAbi from "./abi/MockPriceFeed.json";

const tokenAddress = "0xFe945a2021cc09716d8Efa66c6D10e4F39FB62c7";
const priceFeedAddress = "0x4752084d105fC5C3BB05d0d924E03bEF45e9E468";

export default function WalletDashboard() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [price, setPrice] = useState("0");
  const [usdValue, setUsdValue] = useState("0");

  useEffect(() => {
    async function loadData() {
      try {
        if (!window.ethereum) return alert("MetaMask not found");

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setAccount(userAddress);

        const token = new ethers.Contract(tokenAddress, tokenAbi.abi, signer);
        const feed = new ethers.Contract(priceFeedAddress, priceFeedAbi.abi, signer);

        const rawBalance = await token.balanceOf(userAddress);
        const decimals = await token.decimals();
        const formatted = Number(ethers.formatUnits(rawBalance, decimals));
        setBalance(formatted);

        const round = await feed.latestRoundData();
        const priceUSD = Number(round.answer) / 1e8;
        setPrice(priceUSD);

        setUsdValue(formatted * priceUSD);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      }
    }

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">USDTg Wallet</h1>

        <div className="space-y-3">
          <div>
            <p className="text-sm text-gray-500">Connected Wallet</p>
            <p className="font-medium break-all">{account}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Balance</p>
            <p className="text-lg font-semibold">{balance} USDTg</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Token Price</p>
            <p className="text-lg font-semibold">${price} USD</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Total Value</p>
            <p className="text-lg font-semibold">${usdValue.toLocaleString()} USD</p>
          </div>
        </div>
      </div>
    </div>
  );
}
