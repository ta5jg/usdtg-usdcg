import { logExportedData } from '../api/sendToServer';
export const shortenAddress = (addr) => {
  if (typeof addr !== 'string' || !addr.startsWith('0x')) return 'Not available';
  return addr.slice(0, 6) + '...' + addr.slice(-4);
};

export const shortenHash = (hash) => {
  if (!hash) return '';
  return hash.slice(0, 10) + '...' + hash.slice(-6);
};

export const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

export const formatUSD = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return '$0.00';
  return `$${(num).toFixed(2)}`;
};

import * as XLSX from 'xlsx';
import i18n from '../i18n';

export const handleDownloadCSV = (history = []) => {
  const fixedT = i18n.getFixedT(i18n.language);
  
  const correctedHistory = history.map((item) => {
    if ((item.type ?? '').toLowerCase() === 'send') {
      const isAddress = typeof item.amount === 'string' && item.amount.startsWith('0x');
      const isNumber = !isNaN(parseFloat(item.walletAddress));
      if (isAddress && isNumber) {
        return {
          ...item,
          amount: parseFloat(item.walletAddress),
          walletAddress: item.amount
        };
      }
    }
    return item;
  });

  const headers = [
    fixedT('csv.headers.type'),
    fixedT('csv.headers.date'),
    fixedT('csv.headers.time'),
    fixedT('csv.headers.amount'),
    fixedT('csv.headers.targetToken'),
    fixedT('csv.headers.walletAddress'),
  ];

  const rows = correctedHistory.map(item => {
    const type = item.type || 'Swap';
    const dateObj = new Date(item.timestamp);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();

    let amount = '';
    let targetToken = '';
    let walletAddress = '';

    if (type === 'Swap') {
      amount = item.amount && !isNaN(item.amount)
        ? `$${parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '';
      targetToken = item.targetToken || '';
    } else if (type === 'Send') {
      walletAddress = item.walletAddress || item.recipient || '';
      amount = item.amount && !isNaN(item.amount)
        ? `$${parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '';
      targetToken = '';
    } else if (type === 'Receive') {
      amount = item.amount && !isNaN(item.amount)
        ? `$${parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '';
      walletAddress = item.sender || '';
      targetToken = '';
    }

    return [type, date, time, amount, targetToken, walletAddress];
  });

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'SwapHistory');

  const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([xlsxData], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'Swap-History.xlsx';
  link.click();
  logExportedData(blob);
};
