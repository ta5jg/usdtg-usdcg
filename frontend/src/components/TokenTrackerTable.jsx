import React from "react";

export default function TokenTrackerTable({ balances }) {
  return (
    <table className="w-full text-left text-white border border-zinc-600">
      <thead>
        <tr>
          <th className="p-2 border-b border-zinc-700">Wallet</th>
          <th className="p-2 border-b border-zinc-700">Balance</th>
        </tr>
      </thead>
      <tbody>
        {balances.map((row, i) => (
          <tr key={i}>
            <td className="p-2 border-b border-zinc-800">{row.address}</td>
            <td className="p-2 border-b border-zinc-800">{row.balance} USDTz</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}