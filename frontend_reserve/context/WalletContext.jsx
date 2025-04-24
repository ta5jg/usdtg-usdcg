import React, { createContext, useContext, useState, useEffect } from "react";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [usdValue, setUsdValue] = useState(0);

  const tokenAddress = "TDhqMjTnDAUxYraTVLLie9Qd8NDGY91idq"; // Replace with actual TRC20 contract address
  // const priceFeedAddress = "TMcucqPdKTrudji46RhVvWhH6zi4WTfzKn"; // No longer used

  useEffect(() => {
    const loadWalletData = async () => {
      try {
        if (window.tronWeb && window.tronWeb.ready) {
          const address = window.tronWeb.defaultAddress.base58;
          const contract = await window.tronWeb.contract().at(tokenAddress);

          const balanceResult = await contract.balanceOf(address).call();
          const decimals = await contract.decimals().call();
          const balanceFormatted =
            Number(balanceResult.toString()) / 10 ** Number(decimals);
          setBalance(balanceFormatted);

          try {
            const rawPrice = await contract.getLatestPrice().call();
            const priceFormatted = Number(rawPrice.toString()) / 1e6;
            setPrice(priceFormatted);
            setUsdValue(balanceFormatted * priceFormatted);
          } catch (error) {
            console.warn("getLatestPrice() failed:", error);
            setPrice(0);
            setUsdValue(0);
          }
        }
      } catch (error) {
        console.error("TRON wallet or contract interaction failed:", error);
      }
    };

    loadWalletData();
  }, []);

  return (
    <WalletContext.Provider value={{ balance, price, usdValue }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
