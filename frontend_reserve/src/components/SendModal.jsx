import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import '../assets/styles/SendModal.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SendModal = ({ isOpen, onClose, onSend }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // useEffect(() => {
  //   if (isOpen && !isLoading && recipient && parseFloat(amount) > 0) {
  //     confirmRef.current.focus();
  //   }
  // }, [isOpen, isLoading, recipient, amount]);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!recipient || !amount || parseFloat(amount) <= 0) {
      toast.error(t('sendModal.invalidInput'));
      return;
    }

    setIsLoading(true);

    const txObject = {
      type: "send",
      amount: parseFloat(amount),
      recipient: recipient && typeof recipient === 'string' ? recipient.trim() : null,
      walletAddress: recipient && typeof recipient === 'string' ? recipient.trim() : '',
      timestamp: new Date().toISOString(),
    };

    console.log("TX OBJECT:", txObject);

    try {
      const response = await fetch("http://localhost:5050/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(txObject),
      });

      if (!response.ok) {
        throw new Error("Server response was not OK");
      }

      toast.success(t('sendModal.success'));
    } catch (error) {
      toast.error("Server log hatası.");
      console.error("Log gönderme hatası:", error);
    }

    onSend(amount, recipient);
    setIsLoading(false);
    setAmount('');
    setRecipient('');
    onClose();
  };

  const estimatedValue = parseFloat(amount || 0) * 0.998;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: '1rem' }}>{t('sendModal.header')}</h2>

        <label>
          {t('sendModal.recipientLabel')}
          <input
            type="text"
            placeholder={t('sendModal.recipientPlaceholder')}
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </label>

        <label>
          {t('sendModal.amountLabel')}
          <input
            type="number"
            placeholder={t('sendModal.amountPlaceholder')}
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
            {t('sendModal.estimatedValue')} ≈ ${estimatedValue.toFixed(2)}
          </p>
        )}

        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-btn">{t('sendModal.cancel')}</button>
          <button
            onClick={handleConfirm}
            disabled={!amount || !/^\d*\.?\d{0,2}$/.test(amount) || Number(amount) <= 0 || isLoading}
            className={`confirm-btn ${(!amount || Number(amount) <= 0 || !/^\d*\.?\d{0,2}$/.test(amount)) ? 'disabled' : ''}`}
            tabIndex={0}
          >
            {isLoading ? t('sendModal.loading') : t('sendModal.confirm')}
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="dark"
      />
    </div>
  );
};

export default SendModal;