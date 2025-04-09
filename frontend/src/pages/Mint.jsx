import React, { useState } from "react";

export default function Mint() {
  const [amount, setAmount] = useState("");

  const handleMint = async () => {
    alert(`Would mint ${amount} USDTz here.`);
    // Web3 interaction would go here
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Mint USDTz</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        className="p-2 bg-zinc-800 rounded mb-4"
      />
      <button
        onClick={handleMint}
        className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded"
      >
        Mint
      </button>
    </div>
  );
}