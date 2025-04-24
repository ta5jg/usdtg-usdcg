import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { BrowserProvider } from "ethers/providers";
import TokenCard from "./components/TokenCard";
import ActionButtons from "./components/ActionButtons";
import SwapHistory from "./components/SwapHistory";
import { abi as tokenAbi } from "./abi/USDTgTokenTRC20.json";
//import { abi as priceFeedAbi } from './abi/MockPriceFeed.json';
import tokenList from "./data/tokenList.json";
import WalletModal from "./components/WalletModal"; // Added import for WalletModal
import AddTokenModal from "./components/AddTokenButton"; // Changed import to AddTokenModal
import { toast, ToastContainer } from "react-toastify"; // Added import for toast
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next"; // Added import for translation

const WalletDashboard = () => {
  const { t } = useTranslation(); // Added translation hook
  const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // updated token address
  //const priceFeedAddress = '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82';

  const [addresses, setAddresses] = useState([]);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState("0");
  const [price, setPrice] = useState("0");
  const [isModalOpen, setIsModalOpen] = useState(false); // Added state for modal
  const [importMethod, setImportMethod] = useState("Private Key");
  const [inputValue, setInputValue] = useState("");
  const [showFullAddress, setShowFullAddress] = useState(false);
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false); // Added state for token modal
  const [customTokens, setCustomTokens] = useState([]); // Added state for custom tokens
  const [selectedToken, setSelectedToken] = useState(null); // Added state for selected token

  const handleImport = () => {
    if (!inputValue) return;
    console.log("Import edilen cüzdan:", inputValue);
    const updatedAddresses = [...addresses, inputValue];
    setAddresses(updatedAddresses);
    localStorage.setItem("walletAddresses", JSON.stringify(updatedAddresses));
    localStorage.setItem("selectedAddress", JSON.stringify(inputValue));
    setInputValue("");
    setIsModalOpen(false);
  };

  const handleWalletChange = (e) => {
    if (e.target.value === "add-new") {
      setIsModalOpen(true);
    } else {
      setAddress(e.target.value);
      localStorage.setItem("selectedAddress", JSON.stringify(e.target.value));
    }
  };

  const handleAddToken = async (token) => {
    if (!token || !window.ethereum || !window.ethereum.request) return;

    // Prevent duplicate tokens
    const isAlreadyAdded = customTokens.some(
      (t) => t.address === token.address || t.symbol === token.symbol,
    );
    if (isAlreadyAdded) {
      toast.info(`${token.symbol} zaten eklenmiş.`, {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    try {
      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.logoURI || "/default-token-logo.png",
          },
        },
      });
      if (wasAdded) {
        const updatedTokens = [...customTokens, token];
        setCustomTokens(updatedTokens);
        setSelectedToken(token); // Set selected token upon successful addition
        localStorage.setItem("tokenMetadata", JSON.stringify(token));

        const allTokens = JSON.parse(
          localStorage.getItem("customTokens") || "{}",
        );
        allTokens[address] = updatedTokens;
        localStorage.setItem("customTokens", JSON.stringify(allTokens));

        toast.success(`${token.symbol} başarıyla eklendi.`, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      } else {
        toast.info(`${token.symbol} zaten eklenmiş olabilir.`, {
          position: "top-center",
          autoClose: 2000,
          theme: "dark",
        });
      }
    } catch (err) {
      toast.error(`${token.symbol} eklenemedi.`, {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      console.error("Token eklenemedi:", err);
    }
  };

  useEffect(() => {
    const storedAddresses = JSON.parse(
      localStorage.getItem("walletAddresses") || "[]",
    );
    const storedAddress = JSON.parse(
      localStorage.getItem("selectedAddress") || "null",
    );

    if (storedAddresses.length > 0) {
      setAddresses(storedAddresses);
    }

    if (storedAddress) {
      setAddress(storedAddress);
    }
  }, []);

  useEffect(() => {
    if (!address) return;
    const storedCustomTokens = JSON.parse(
      localStorage.getItem("customTokens") || "{}",
    );
    const tokensForAddress = storedCustomTokens[address] || [];
    setCustomTokens(tokensForAddress);
    setSelectedToken(tokensForAddress[0] || null);
  }, [address]);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const token = {
          address: tokenAddress,
          symbol: "USDTg",
          name: "TetherGround USD",
          decimals: 18, // Reverted back to 18 to match updated contract
          logoURI:
            "https://gateway.pinata.cloud/ipfs/bafkreidmrotlmuxjooihz4omwosupptt43apwu7ps5onuizpetdonp7f3u",
        };
        const userAddress = await signer.getAddress();
        const storedCustomTokens = JSON.parse(
          localStorage.getItem("customTokens") || "{}",
        );
        const alreadyHasToken = storedCustomTokens[userAddress]?.some(
          (t) => t.address.toLowerCase() === token.address.toLowerCase(),
        );

        if (!alreadyHasToken) {
          const updatedTokens = [token];
          setCustomTokens(updatedTokens);
          setSelectedToken(token);
          const allTokens = JSON.parse(
            localStorage.getItem("customTokens") || "{}",
          );
          allTokens[userAddress] = updatedTokens;
          localStorage.setItem("customTokens", JSON.stringify(allTokens));
        }
        const savedAddresses = JSON.parse(
          localStorage.getItem("walletAddresses") || "[]",
        );
        const updatedAddresses = savedAddresses.includes(userAddress)
          ? savedAddresses
          : [...savedAddresses, userAddress];
        setAddresses(updatedAddresses);
        setAddress(userAddress);
        localStorage.setItem(
          "walletAddresses",
          JSON.stringify(updatedAddresses),
        );
        localStorage.setItem("selectedAddress", JSON.stringify(userAddress));
        console.log("✅ Cüzdan adresi:", userAddress);

        if (token) {
          document.title = `${token.name} Wallet`;
          const link = document.querySelector("link[rel~='icon']");
          if (link) {
            link.href = token.logoURI;
          }
        }

        //const contractToken = new ethers.Contract(tokenAddress, tokenAbi, signer);
        // setTokenContract(contractToken); // Removed unused state

        //const priceFeed = new ethers.Contract(priceFeedAddress, priceFeedAbi, signer);
        // setPriceFeedContract(priceFeed); // Removed unused state

        // Otomatik token tanıtımı sadece eğer daha önce eklenmemişse tetiklenir

        if (!alreadyHasToken && window.ethereum && window.ethereum.request) {
          try {
            const wasAdded = await window.ethereum.request({
              method: "wallet_watchAsset",
              params: {
                type: "ERC20",
                options: {
                  address: token.address,
                  symbol: token.symbol,
                  decimals: token.decimals,
                  image: token.logoURI || "/default-token-logo.png",
                },
              },
            });

            if (wasAdded) {
              console.log(
                `✅ Token otomatik olarak cüzdana eklendi: ${token.symbol}`,
              );
            } else {
              console.log(
                `ℹ️ Kullanıcı ${token.symbol} tokenını eklemeyi reddetti veya zaten ekli.`,
              );
            }
          } catch (error) {
            console.warn(`⚠️ Token eklenemedi: ${token.symbol}`, error);
          }
          const savedToken = JSON.parse(
            localStorage.getItem("tokenMetadata") || "{}",
          );
          if (savedToken?.symbol) {
            const tokenExists = tokenList.some(
              (t) => t.symbol === savedToken.symbol,
            );
            if (!tokenExists) {
              tokenList.push(savedToken);
            }
          }
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!address || !selectedToken) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      let formattedBal = "0";
      let fetchedPrice = "1.00";

      try {
        if (selectedToken.address && selectedToken.address !== "N/A") {
          const tokenContract = new ethers.Contract(
            selectedToken.address,
            tokenAbi,
            provider,
          );
          const tokenBal = await tokenContract.balanceOf(address);
          const decimals = Number(selectedToken?.decimals ?? 18);
          formattedBal = parseFloat(
            ethers.formatUnits(tokenBal, decimals),
          ).toFixed(2);
        } else {
          formattedBal = "0.00";
        }

        fetchedPrice = (1.0).toFixed(2); // Price is fixed in contract at 1.00 USD

        setBalance(formattedBal);
        setPrice(fetchedPrice);
      } catch (err) {
        console.warn(`⚠️ ${selectedToken.symbol} verileri alınamadı:`, err);
        setBalance("0.00");
        setPrice("0.00");
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 15000);

    return () => clearInterval(intervalId);
  }, [customTokens, selectedToken, address, balance, price]);

  return (
    <div className="p-4">
      <WalletModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        addresses={addresses}
        importMethod={importMethod}
        setImportMethod={setImportMethod}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleImport={handleImport}
      />{" "}
      {/* Updated WalletModal component */}
      <div className="mt-6 flex justify-center text-center">
        <div className="text-left w-full max-w-xs">
          <select
            value={address}
            onChange={handleWalletChange}
            className="w-full mb-4 p-3 rounded bg-zinc-800 text-white border border-zinc-700 text-center"
          >
            {[
              ...addresses.map((addr, idx) => (
                <option key={addr} value={addr}>
                  {`Cüzdan ${idx + 1} - ${addr.slice(0, 6)}...${addr.slice(-4)}`}
                </option>
              )),
              <option
                key="add-new"
                value="add-new"
                className="text-green-500 font-semibold"
              >
                ➕ Yeni Cüzdan Ekle
              </option>,
            ]}
          </select>
          {address && (
            <div className="mt-2 flex justify-center items-center gap-2 text-sm text-white">
              <div className="bg-zinc-800 px-3 py-1 rounded-full break-all text-sm max-w-full">
                {showFullAddress
                  ? address
                  : `${address.slice(0, 6)}...${address.slice(-4)}`}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={async () => {
                    try {
                      console.log("✅ Kopyalandı:", address);
                      await navigator.clipboard.writeText(address);
                      toast.success("Cüzdan adresi kopyalandı", {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "dark",
                      });
                    } catch (err) {
                      toast.error("Kopyalama başarısız!", {
                        position: "top-center",
                        autoClose: 2000,
                        theme: "dark",
                      });
                      console.error("Clipboard error:", err);
                    }
                  }}
                  className="text-blue-300 hover:text-blue-500 text-lg"
                  title="Kopyala"
                >
                  📋
                </button>
                <button
                  onClick={() => setShowFullAddress(!showFullAddress)}
                  className="text-sm text-blue-400 underline hover:text-blue-200"
                >
                  {showFullAddress ? "Kısalt" : "Tam Göster"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 text-center text-gray-400 text-sm"></div>
      <div className="mt-6 text-center">
        <h3 className="text-white text-lg font-semibold mb-2">
          Eklenen Tokenlar
        </h3>
        <div className="flex flex-wrap justify-center gap-4">
          {customTokens.map((token, index) => (
            <div
              key={index}
              className={`relative flex flex-col items-center bg-zinc-800 p-3 rounded-xl shadow text-white cursor-pointer group ${
                selectedToken?.symbol === token.symbol
                  ? "ring-2 ring-blue-400"
                  : ""
              }`}
              onClick={() => setSelectedToken(token)}
            >
              <button
                className="absolute top-1 -right-2 text-red-400 hover:text-red-600 text-sm z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  const filtered = customTokens.filter(
                    (t) => t.symbol !== token.symbol,
                  );
                  setCustomTokens(filtered);
                  setSelectedToken(filtered[0] || null);
                  const allTokens = JSON.parse(
                    localStorage.getItem("customTokens") || "{}",
                  );
                  allTokens[address] = filtered;
                  localStorage.setItem(
                    "customTokens",
                    JSON.stringify(allTokens),
                  );
                }}
                title="Tokenı sil"
              >
                🗑️
              </button>
              <img
                src={
                  token.logoURI ||
                  tokenList.find((t) => t.symbol === token.symbol)?.logoURI ||
                  "/default-token-logo.png"
                }
                alt={`${token.symbol} logo`}
                className="w-8 h-8 mb-1"
              />
              <span className="text-sm">{token.symbol}</span>
              {/*
              {(Number(balance) * Number(price)) > 0 && (
              <span className="text-xs text-green-400 mt-1 hidden group-hover:block">
                ${(Number(balance) * Number(price)).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              )}
              */}
            </div>
          ))}
        </div>
      </div>
      {selectedToken && (
        <div className="mt-8 text-center text-white">
          <div className="flex flex-col items-center">
            <div title={`$${(Number(balance) * Number(price)).toFixed(2)}`}>
              <img
                src={selectedToken.logoURI || "/default-token-logo.png"}
                alt={selectedToken.symbol}
                className="w-10 h-10 mb-2"
              />
            </div>
            <div className="text-lg font-semibold">Your Balance</div>
            <div className="text-3xl font-bold">
              {Number(balance).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {selectedToken.symbol}
            </div>
            <div className="text-md text-green-400 mt-2 font-semibold">
              Total Value: $
              {(Number(balance) * Number(price)).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="text-md text-gray-400">
              1 {selectedToken.symbol} = ${parseFloat(price).toFixed(3)}
            </div>
          </div>
        </div>
      )}
      {/* <TokenCard balance={balance} price={price} /> */}
      <br />
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-lg text-center mb-6 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <span className="text-lg font-semibold">{t("wallet.actions")}</span>
          <button
            onClick={() => setIsTokenModalOpen(true)} // Updated onClick to open token modal
            className="px-4 py-2 bg-white text-blue-700 hover:bg-blue-100 font-semibold rounded-xl shadow"
          >
            {t("addTokenButton.label")}{" "}
            {/* Updated button label with translation */}
          </button>
        </div>
      </div>
      <ToastContainer />
      <AddTokenModal
        tokenList={tokenList}
        handleAddToken={(token) => handleAddToken(token)} // Updated handleAddToken prop
        isModalOpen={isTokenModalOpen}
        setIsModalOpen={setIsTokenModalOpen}
      />{" "}
      {/* Added AddTokenModal component */}
    </div>
  );
};

export default WalletDashboard;
