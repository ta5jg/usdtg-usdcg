import { useEffect, useState } from "react";

export default function SwapBotStatus() {
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/status.json") // Vercel kullanıyorsan API route'a yönlendir
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => setStatus(null));
  }, []);

  if (!status) {
    return (
      <div className="bg-zinc-800 text-white p-4 rounded">
        🤖 Bot status: <span className="text-red-400">offline or unreachable</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800 text-white p-4 rounded space-y-2">
      <div>
        🤖 <strong>Swap Bot Active:</strong>{" "}
        {status.active ? (
          <span className="text-green-400">✅ Yes</span>
        ) : (
          <span className="text-red-400">❌ No</span>
        )}
      </div>
      <div>
        ⏱ <strong>Last Swap:</strong>{" "}
        {new Date(status.lastSwap).toLocaleString()}
      </div>
      <div>
        🔁 <strong>Total Swaps:</strong>{" "}
        <span className="text-blue-300">{status.swapCount}</span>
      </div>
    </div>
  );
}