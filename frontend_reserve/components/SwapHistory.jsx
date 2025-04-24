import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TransactionDetailsModal from './TransactionDetailsModal';
import { shortenAddress, formatDate, formatUSD } from '../utils/format';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const SwapHistory = () => {
  const { t } = useTranslation();
  const [filterType, setFilterType] = useState('All');
  const [selectedTx, setSelectedTx] = useState(null);
  const [limit, setLimit] = useState(10);
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetch("http://localhost:5050/api/transactions")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch((err) => console.error("Veri çekme hatası:", err));
  }, []);

  const getFilteredTransactions = () => {
    return [...history]
    .filter(item => {
      const currentType = (item.type ?? 'Swap').toLowerCase().trim();
      const selected = filterType.toLowerCase().trim();
      const includeType = selected === 'all' || currentType === selected;
    
      const itemTime = new Date(item.timestamp).getTime();
      const afterStart = startDate ? itemTime >= new Date(startDate).getTime() : true;
      const beforeEnd = endDate ? itemTime <= new Date(endDate).getTime() : true;
    
      const searchTags = searchQuery.split(' ').map(tag => tag.trim().toLowerCase());

      const matchesSearch = searchTags.every(tag =>
        tag === '' ||
        (item.amount && item.amount.toString().toLowerCase().includes(tag)) ||
        (item.walletAddress && item.walletAddress.toLowerCase().includes(tag)) ||
        (item.sender && item.sender.toLowerCase().includes(tag)) ||
        (item.targetToken && item.targetToken.toLowerCase().includes(tag)) ||
        (item.timestamp && item.timestamp.toLowerCase().includes(tag)) ||
        (item.type && item.type.toLowerCase().includes(tag))
      );
      return includeType && afterStart && beforeEnd && matchesSearch;
    })
    .sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    })
    .slice(0, limit);
  };

  const handleViewDetails = (item) => setSelectedTx(item);
  const handleCloseModal = () => setSelectedTx(null);

  const formatTransaction = (item) => {
    const type = (item.type ?? 'Swap').toLowerCase();
    let address = '';
 
    if (type === 'swap') {
      address = item.targetToken || t('transactionDetails.empty');
      return `USDTg ⇄ ${address}`;
    } else if (type === 'send') {
      address = shortenAddress(item.walletAddress || item.recipient);
      return `to ${address}`;
    } else if (type === 'receive') {
      address = item.sender ? shortenAddress(item.sender) : t('transactionDetails.empty');
      return `from ${address}`;
    } else {
      return t('swapHistory.unknownType');
    }
  };

  const correctedTransactions = getFilteredTransactions().map((item) => {
    const type = (item.type ?? '').toLowerCase();

    if (type === 'send') {
      const amount = parseFloat(item.amount);
      const walletAddress = item.walletAddress || item.recipient || '';

      return {
        ...item,
        amount: isNaN(amount) ? 0 : amount,
        walletAddress,
      };
    }

    return {
      ...item,
      amount: parseFloat(item.amount) || 0,
    };
  });

  const stats = {
    swapCount: correctedTransactions.filter(tx => (tx.type ?? '').toLowerCase() === 'swap').length,
    sendCount: correctedTransactions.filter(tx => (tx.type ?? '').toLowerCase() === 'send').length,
    tokenStats: correctedTransactions.reduce((acc, tx) => {
      if ((tx.type ?? '').toLowerCase() === 'swap') {
        const key = tx.targetToken || 'Other';
        acc[key] = (acc[key] || 0) + (parseFloat(tx.amount) || 0);
      }
      return acc;
    }, {})
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-[15px] md:px-8 w-full pb-64">
    
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ color: 'white', fontWeight: 'bold', marginBottom: '1rem' }}>{t('swapHistory.title')}</h2>
        
        <div className="flex justify-end w-full mb-4">
          <a
            href="http://localhost:5050/history-xlsx"
            download
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition text-sm"
          >
            {t('swapHistory.download')}
          </a>
        </div>

        <input
          type="text"
          placeholder={t('swapHistory.searchPlaceholder') || 'Search by amount, address, or date'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 w-full rounded text-black text-sm"
        />

        {!history || history.length === 0 ? (
          <p style={{ color: '#aaa' }}>{t('swapHistory.empty')}</p>
        ) : (
            
              <div className="w-full px-4 sm:px-[15px] md:px-8">
                <div className="flex flex-col md:flex-row md:items-stretch items-center gap-4 bg-gray-900 px-4 py-4 rounded-lg mb-4 w-full">

              {/* Left Column: Filter Types & Limits */}
              <div className="flex flex-col justify-center gap-2 bg-gray-800 px-4 py-2 rounded min-w-fit min-h-[80px] h-full w-full md:w-auto text-center">
                <div className="flex gap-1">
                  {['All', 'Swap', 'Send', 'Receive'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilterType(type)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        filterType === type ? 'bg-blue-600 text-white' : 'bg-gray-600 text-gray-100'
                      }`}
                    >
                      {t(`swapHistory.${type.toLowerCase()}`)}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1 text-center">
                  {['5', '10', '20', '50', 'ALL'].map(value => (
                    <button
                      key={value}
                      onClick={() => setLimit(value === 'ALL' ? Infinity : parseInt(value))}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        (limit === Infinity && value === 'ALL') || limit === parseInt(value)
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-700 text-gray-200'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Center: Sort Order Button */}
              <div className="bg-indigo-600 text-white px-6 py-2 rounded text-xs h-full w-full md:w-auto flex items-center justify-center min-h-[80px]">
                <button onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}>
                  {sortOrder === 'desc' ? t('swapHistory.sortNewest') : t('swapHistory.sortOldest')}
                </button>
              </div>

              {/* Right Column: Date Filters */}
              <div className="flex flex-col md:flex-row gap-3 bg-slate-800 px-4 py-2 rounded items-center h-full w-full md:w-auto min-h-[80px]">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">{t('swapHistory.startDate')}</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-36 text-black rounded px-2 py-1 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">{t('swapHistory.endDate')}</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-36 text-black rounded px-2 py-1 text-sm"
                  />
                </div>
              </div>
            </div>

            <ul className="w-full overflow-y-auto max-h-[60vh] px-4 sm:px-[15px] md:px-8 mb-4">
              {correctedTransactions.map((item, index) => {
                console.log(item);
                return (
                  <li
                    key={index}
                    style={{
                      backgroundColor: '#222',
                      padding: '1rem',
                      borderRadius: '10px',
                      marginBottom: '1rem',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <strong>{t(`transactionTypes.${(item.type ?? 'swap').toLowerCase()}`)}:</strong> <span>{formatTransaction(item)}</span>
                    <p><strong>{t('swapHistory.amountPrefix')}:</strong> {formatUSD(item.amount || 0)} USDTg</p>
                    <div style={{ fontSize: '0.8rem', color: '#bbb' }}>{formatDate(item.timestamp)}</div>
                    <button
                      onClick={() => handleViewDetails(item)}
                      style={{
                        fontSize: '0.75rem',
                        color: 'skyblue',
                        marginTop: '0.3rem',
                        cursor: 'pointer',
                        display: 'inline-block',
                      }}
                      tabIndex={0}
                    >
                      {t('swapHistory.details') || 'Details'}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          
        )}
      </div>
      <div className="w-full mb-6 bg-gray-800 p-4 rounded text-white">
        <h3 className="font-bold text-lg mb-2">{t('swapHistory.summary')}</h3>
        <p className="text-sm">{t('swapHistory.totalSwaps')} {stats.swapCount}</p>
        <p className="text-sm">{t('swapHistory.totalSends')} {stats.sendCount}</p>
        <div className="mt-4">
          <Bar
            data={{
              labels: Object.keys(stats.tokenStats),
              datasets: [{
                label: t('swapHistory.chartLabel') || 'Swap Amount',
                data: Object.values(stats.tokenStats),
                backgroundColor: 'rgba(59, 130, 246, 0.7)'
              }]
            }}
            options={{
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: { beginAtZero: true }
              },
              responsive: true,
              maintainAspectRatio: false,
            }}
            height={200}
          />
        </div>
      </div>
      <TransactionDetailsModal
        isOpen={!!selectedTx}
        onClose={handleCloseModal}
        transaction={selectedTx}
      />
    </div>
  );
  
};

export default SwapHistory;