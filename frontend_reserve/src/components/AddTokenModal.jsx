import React, { useState } from 'react';
import AddTokenButton from './components/AddTokenButton';
import AddTokenModal from './components/AddTokenButton';
import { ToastContainer } from 'react-toastify';

const WalletDashboard = () => {
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);

  const handleAddToken = (token) => {
    // Add token logic
  };

  return (
    <div>
      <button onClick={() => setIsTokenModalOpen(true)}>+ Add Token</button>
      <ToastContainer />
      <AddTokenModal
        tokenList={tokenList}
        handleAddToken={handleAddToken}
        isModalOpen={isTokenModalOpen}
        setIsModalOpen={setIsTokenModalOpen}
      />
    </div>
  );
};

export default WalletDashboard;