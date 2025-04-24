

import React, { useState } from 'react';

const ListingManager = () => {
  const [listings, setListings] = useState([
    { name: 'CoinMarketCap', status: 'Pending', link: '' },
    { name: 'CoinGecko', status: 'Pending', link: '' },
    { name: 'TrustWallet', status: 'Pending', link: '' },
    { name: 'DEXTools', status: 'Pending', link: '' },
    { name: 'Nomics', status: 'Pending', link: '' },
  ]);

  const updateStatus = (index, field, value) => {
    const updated = [...listings];
    updated[index][field] = value;
    setListings(updated);
  };

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">🔍 Token Listing Status</h2>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="text-left bg-gray-800">
            <th className="p-2">Platform</th>
            <th className="p-2">Status</th>
            <th className="p-2">Link</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((entry, idx) => (
            <tr key={entry.name} className="border-t border-gray-700">
              <td className="p-2">{entry.name}</td>
              <td className="p-2">
                <select
                  className="bg-gray-800 text-white px-2 py-1 rounded"
                  value={entry.status}
                  onChange={(e) => updateStatus(idx, 'status', e.target.value)}
                >
                  <option>Pending</option>
                  <option>Submitted</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
              </td>
              <td className="p-2">
                <input
                  type="text"
                  className="bg-gray-800 text-white px-2 py-1 rounded w-full"
                  placeholder="Tracking link"
                  value={entry.link}
                  onChange={(e) => updateStatus(idx, 'link', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListingManager;