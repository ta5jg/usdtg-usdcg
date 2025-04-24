import i18n from 'i18next';
import { initReactI18next } from './node_modules/react-i18next';
import * as XLSX from 'xlsx';

import translationEN from './locales/en.json';
import translationTR from './locales/tr.json';
import translationDE from './locales/de.json';
import translationFR from './locales/fr.json';
import translationES from './locales/es.json';
import translationAR from './locales/ar.json';
import translationRU from './locales/ru.json';
import translationZH from './locales/zh-CN.json';
import translationVI from './locales/vi.json';
import translationIT from './locales/it.json';
import translationFA from './locales/fa.json';
import translationUK from './locales/uk.json';
import translationKO from './locales/ko.json';
import translationJA from './locales/ja.json';
import translationID from './locales/id.json';
import translationHI from './locales/hi.json';
import translationPTBR from './locales/pt-BR.json';

const resources = {
  en: { translation: translationEN },
  tr: { translation: translationTR },
  de: { translation: translationDE },
  fr: { translation: translationFR },
  es: { translation: translationES },
  ar: { translation: translationAR },
  ru: { translation: translationRU },
  zh: { translation: translationZH },
  vi: { translation: translationVI },
  it: { translation: translationIT },
  fa: { translation: translationFA },
  uk: { translation: translationUK },
  ko: { translation: translationKO },
  ja: { translation: translationJA },
  id: { translation: translationID },
  hi: { translation: translationHI },
  'pt-BR': { translation: translationPTBR },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: navigator.language || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export const shortenAddress = (addr) => {
  if (!addr) return '';
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
  return `$${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const handleDownloadCSV = (history = []) => {
  const fixedT = i18n.getFixedT(i18n.language);

  const headers = [
    fixedT('csv.headers.type'),
    fixedT('csv.headers.date'),
    fixedT('csv.headers.time'),
    fixedT('csv.headers.amount'),
    fixedT('csv.headers.targetToken'),
    fixedT('csv.headers.address'),
  ];

  const rows = history.map(item => {
    const type = item.type || 'Swap';
    const dateObj = new Date(item.timestamp);
    const date = dateObj.toLocaleDateString();
    const time = dateObj.toLocaleTimeString();
    const amount = item.amount ? `$${parseFloat(item.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '';

    let targetToken = item.targetToken || 'BNB';
    let address = '';

    if (type === 'Swap') {
      targetToken = item.targetToken || 'BNB';
    } else if (type === 'Send') {
      address = item.recipient || '';
    } else if (type === 'Receive') {
      address = item.sender || '';
    }

    return [type, date, time, amount, targetToken, address];
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
};

export default i18n;