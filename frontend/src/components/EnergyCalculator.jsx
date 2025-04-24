import { useState } from "react";

const EnergyCalculator = () => {
  const [action, setAction] = useState("transfer");
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);

  const energyRates = {
    transfer: 6500,
    approve: 12000,
    swap: 22000,
  };

  const estimate = () => {
    const baseEnergy = energyRates[action] || 0;
    const multiplier = parseFloat(amount) || 1;
    const totalEnergy = baseEnergy * multiplier;
    const trxCost = (totalEnergy / 28000).toFixed(2); // approx. 28000 energy = 1 TRX

    setResult({
      totalEnergy,
      trxCost,
    });
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg shadow-md mt-6">
      <h2 className="text-xl font-bold mb-3">⚡ Energy Estimation Tool</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="bg-gray-800 px-3 py-2 rounded"
        >
          <option value="transfer">Transfer</option>
          <option value="approve">Approve</option>
          <option value="swap">Swap</option>
        </select>

        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Number of operations"
          className="bg-gray-800 px-3 py-2 rounded"
        />

        <button
          onClick={estimate}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
        >
          Calculate
        </button>
      </div>

      {result && (
        <div className="bg-gray-800 p-3 rounded mt-2 text-sm">
          🔋 Estimated Energy: <strong>{result.totalEnergy}</strong><br />
          💸 TRX Cost: <strong>{result.trxCost} TRX</strong>
        </div>
      )}
    </div>
  );
};

export default EnergyCalculator;