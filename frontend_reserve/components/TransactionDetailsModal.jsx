import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, formatUSD, shortenAddress } from '../utils/format';

const TransactionDetailsModal = ({ isOpen, onClose, transaction }) => {
  const { t } = useTranslation();

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white rounded-lg shadow-lg p-6 w-96 relative">
        <button
          className="absolute top-2 right-2 text-xl font-bold hover:text-red-500"
          onClick={onClose}
          tabIndex={0}
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">{t('transactionDetails.title')}</h2>
        <div className="space-y-2 text-sm">
          <p><strong>{t('transactionDetails.type')}:</strong> {transaction.type ?? 'Swap'}</p>
          <p><strong>{t('transactionDetails.date')}:</strong> {formatDate(transaction.timestamp)}</p>

          <p><strong>{t('swapHistory.amountPrefix')}:</strong> {formatUSD(transaction.amount || 0)} {t('transactionDetails.USDTg')}</p>
          {(transaction.type ?? '').toLowerCase() === 'swap' && (
            <p><strong>{t('transactionDetails.swap')}:</strong> <span>{t('transactionDetails.USDTg')} &lt;&gt; {transaction.targetToken || t('transactionDetails.empty')}</span></p>
          )}
          {(transaction.type ?? '').toLowerCase() === 'send' && (
          <p><strong>{t('transactionDetails.send')}:</strong> <span>{t('transactionDetails.to')} {shortenAddress(transaction.walletAddress || transaction.recipient)}</span></p>
          )}
          {(transaction.type ?? '').toLowerCase() === 'receive' && (
            <>
              <p><strong>{t('swapHistory.transactionFormat', { amount: formatUSD(transaction.amount || 0), address: shortenAddress(transaction.sender) })}:</strong> <span>{formatUSD(transaction.amount || 0)} {t('transactionDetails.USDTg')} {t('transactionDetails.USDTgFrom')} {shortenAddress(transaction.sender)}</span></p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsModal;