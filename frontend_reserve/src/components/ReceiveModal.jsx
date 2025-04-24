import React, { useRef, useEffect } from 'react';
import '../assets/styles/SendModal.css'; // Optional reuse of modal styles
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';

const ReceiveModal = ({ isOpen, onClose, walletAddress }) => {
  const { t } = useTranslation();
  const confirmRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      confirmRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    navigator.clipboard.writeText(walletAddress);
    toast.success(t('receive.copied'));
    try {
      await fetch("http://localhost:5050/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "receive",
          sender: "External", // or walletAddress if needed
          amount: 0, // optional unless tracking amount
          timestamp: new Date().toISOString(),
          recipient: walletAddress.trim(), // Ensure recipient is included
        }),
      });
    } catch (error) {
      console.error("Log gönderme hatası:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 style={{ marginBottom: '1rem' }}>{t('receive.title')}</h2>
        <p style={{ wordBreak: 'break-all', fontSize: '0.9rem', background: '#222', padding: '0.5rem', borderRadius: '6px' }}>
          {walletAddress}
        </p>
        <div className="modal-buttons">
          <button onClick={onClose} className="cancel-btn">{t('common.close')}</button>
          <button
            ref={confirmRef}
            onClick={handleCopy}
            className="confirm-btn"
            tabIndex={0}
          >
            {t('common.copy')}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </div>
  );
};

export default ReceiveModal;