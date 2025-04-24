import React, { createContext, useContext, useState, useEffect } from 'react';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [usdValue, setUsdValue] = useState(0);

  const tokenAddress = "TRC20_CONTRACT_ADDRESS"; // Replace with actual TRC20 contract address
  const priceFeedAddress = "PRICE_FEED_CONTRACT_ADDRESS"; // Replace with actual price feed contract address

  useEffect(() => {
    const loadWalletData = async () => {
      try {
        if (window.tronWeb && window.tronWeb.ready) {
          const address = window.tronWeb.defaultAddress.base58;
          const contract = await window.tronWeb.contract().at(tokenAddress);
          const balanceResult = await contract.balanceOf(address).call();
          const decimals = await contract.decimals().call();
          const balanceFormatted = Number(balanceResult.toString()) / (10 ** Number(decimals));
          setBalance(balanceFormatted);

          const priceFeed = await window.tronWeb.contract().at(priceFeedAddress);
          const priceResult = await priceFeed.latestAnswer().call();
          const priceFormatted = Number(priceResult.toString()) / 1e8;
          setPrice(priceFormatted);
          setUsdValue(balanceFormatted * priceFormatted);
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
