// BalanceViewer.jsx
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import tokenAbi from "./abi/USDTgTokenTRC20.json";
import priceFeedAbi from "./abi/MockPriceFeed.json";

const tokenAddress = '0x9A676e781A523b5d0C0e43731313A708CB607508'; // updated token address (same as before, reconfirmed)
const priceFeedAddress = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82';

function BalanceViewer() {
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [usdValue, setUsdValue] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (!window.ethereum) {
        alert("Lütfen Metamask'ı yükleyin!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const address = signer.address;
      setAccount(address);

      const token = new ethers.Contract(tokenAddress, tokenAbi.abi, signer);
      const priceFeed = new ethers.Contract(priceFeedAddress, priceFeedAbi.abi, signer);

      const rawBalance = await token.balanceOf(address);
      const decimals = await token.decimals();
      const formattedBalance = parseFloat(ethers.formatUnits(rawBalance, decimals));
      setBalance(formattedBalance);

      const roundData = await priceFeed.latestRoundData();
      const priceUSD = Number(roundData[1]) / 1e8; // answer index
      setPrice(priceUSD);

      setUsdValue(formattedBalance * priceUSD);
    }

    loadData().catch(console.error);
  }, []);

  // Sayı formatlayıcı
  const formatNumber = (value) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);

  return (
    <div>
      {account && <p><strong>Connected:</strong> {account}</p>}
      <p><strong>Balance:</strong> {formatNumber(balance)} USDTg</p>
      <p><strong>Price:</strong> ${formatNumber(price)} USD</p>
      <p><strong>Total Value:</strong> ${formatNumber(usdValue)} USD</p>
    </div>
  );
}

export default BalanceViewer;