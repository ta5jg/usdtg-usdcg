import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/styles/SwapModal.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const tokenIcons = {
  BNB: '🟡',
  BTC: '🟠',
  ETH: '🟣',
  USDC: '🔵',
};

const SwapModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [targetToken, setTargetToken] = useState('BNB');
  const [isLoading, setIsLoading] = useState(false);
  
  // useEffect(() => {
  //   if (isOpen && amount && parseFloat(amount) > 0) {
  //     confirmRef.current.focus();
  //   }
  // }, [isOpen, amount]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error(t('swap.toastError'));
      return;
    }

    setIsLoading(true);

    setTimeout(async () => {
      const txObject = {
        type: "swap",
        amount: parseFloat(amount),
        targetToken,
        timestamp: new Date().toISOString(),
        recipient: targetToken, // for formatting clarity
      };
    
      try {
        await fetch("http://localhost:5050/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(txObject),
        });
        toast.success(t('swap.toastSuccess'));
      } catch (error) {
        toast.error("Server log hatası.");
        console.error("Log gönderme hatası:", error);
      }
    
      onConfirm(amount, targetToken);
      setIsLoading(false);
      setAmount('');
      onClose();
    }, 1000);
  };

  const estimatedValue = parseFloat(amount || 0) * 0.998;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: '1rem' }}>{t('swap.title')}</h2>

        <label>
          {t('swap.amountLabel')}
          <input
            type="number"
            placeholder={t('swap.placeholder')}
            value={amount}
            onChange={(e) => {
              const input = e.target.value;
              if (/^\d*\.?\d{0,2}$/.test(input)) {
                setAmount(input);
              }
            }}
          />
        </label>

        {amount > 0 && (
          <p style={{ fontSize: '0.9rem', color: '#ccc' }}>
            {t('swap.estimatedValue')}: ≈ ${estimatedValue.toFixed(2)}
          </p>
        )}

        <label>
          {t('swap.targetTokenLabel')}
          <select
            value={targetToken}
            onChange={(e) => setTargetToken(e.target.value)}
          >
            {Object.keys(tokenIcons).map((token) => (
              <option key={token} value={token}>
                {tokenIcons[token]} {token}
              </option>
            ))}
          </select>
        </label>

        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-btn">
            {t('swap.close')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!amount || !/^\d*\.?\d{0,2}$/.test(amount) || Number(amount) <= 0 || isLoading}
            className={`confirm-btn ${(!amount || !/^\d*\.?\d{0,2}$/.test(amount) || Number(amount) <= 0) ? 'disabled' : ''}`}
            tabIndex={0}
          >
            {isLoading ? t('swapModal.loading') : t('swapModal.confirm')}
          </button>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default SwapModal;