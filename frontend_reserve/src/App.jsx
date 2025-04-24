import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ActionButtons from './components/ActionButtons';
import SwapModal from './components/SwapModal';
import SendModal from './components/SendModal';
import ReceiveModal from './components/ReceiveModal';
import SwapHistory from './components/SwapHistory';
import WalletDashboard from './WalletDashboard';
import WalletModal from './components/WalletModal'; // Added WalletModal import
import './i18n';
import { useTranslation } from 'react-i18next';
import LanguageSelector from "./components/settings/LanguageSelector";
import SettingsMenu from './components/settings/SettingsMenu';

const App = () => {
  const [isSwapOpen, setSwapOpen] = useState(false);
  const [isSendOpen, setSendOpen] = useState(false);
  const [isReceiveOpen, setReceiveOpen] = useState(false);
  const [isWalletOpen, setWalletOpen] = useState(false); // Added state for WalletModal
  const [swapHistory, setSwapHistory] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const { t } = useTranslation();

  useEffect(() => {
    const savedHistory = localStorage.getItem("USDTg-swap-history");
    if (savedHistory) {
      setSwapHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("USDTg-swap-history", JSON.stringify(swapHistory));
  }, [swapHistory]);

  const handleClearHistory = () => {
    setSwapHistory([]);
    localStorage.removeItem("USDTg-swap-history");
  };

  const handleSwap = (amount, targetToken) => {
    console.log(t("swap_log"), amount, targetToken);
    setSwapHistory((prev) => [
      ...prev,
      {
        amount,
        targetToken,
        timestamp: new Date().toLocaleString(),
      },
    ]);
  };

  const handleSendComplete = (recipient, amount) => {
    const newEntry = {
      type: 'Send',
      amount,
      recipient,
      timestamp: new Date().toLocaleString(),
    };
    const updated = [...swapHistory, newEntry];
    setSwapHistory(updated);
    localStorage.setItem("USDTg-swap-history", JSON.stringify(updated));
  };

  const handleImportWallet = (method, value) => {
    // Handle wallet import logic here
    console.log(`Importing wallet with ${method}: ${value}`);
  };

  return (
    <div className="flex flex-col items-center bg-zinc-900 min-h-screen text-white">
      <div className="w-full max-w-2xl p-24 md:p-8">

        <SettingsMenu />

        <Header />

        <br />

        <WalletDashboard />

        <br />

        <ActionButtons
              onSwapClick={() => setSwapOpen(true)}
              onSendClick={() => setSendOpen(true)}
              onReceiveClick={() => setReceiveOpen(true)}
              onWalletClick={() => setWalletOpen(true)} // Added onWalletClick handler
            />

        <br />

        <div className="flex flex-col items-center text-center gap-8 my-8">
          <SwapHistory
            history={swapHistory}
            onClear={handleClearHistory}
            filterType={filterType}
            setFilterType={setFilterType}
          />
          
          </div>
        
      </div>
      <SwapModal
        isOpen={isSwapOpen}
        onClose={() => setSwapOpen(false)}
        onConfirm={handleSwap}
      />

      <SendModal
        isOpen={isSendOpen}
        onClose={() => setSendOpen(false)}
        onSend={handleSendComplete}
      />

      <ReceiveModal
        isOpen={isReceiveOpen}
        onClose={() => setReceiveOpen(false)}
        walletAddress={window.ethereum?.selectedAddress || "0xYourWalletAddressHere"}
      />

      <WalletModal // Added WalletModal component
        isOpen={isWalletOpen}
        onClose={() => setWalletOpen(false)}
        onImport={handleImportWallet}
      />
    </div>
  );
};

export default App;