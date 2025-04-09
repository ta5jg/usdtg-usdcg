import SwapBotStatus from "@/components/SwapBotStatus";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white p-6 font-mono">
      <h1 className="text-3xl font-bold mb-6">📊 USDTz Admin Dashboard</h1>

      <section className="max-w-3xl mx-auto mb-12">
        <SwapBotStatus />
      </section>

      {/* Future: Add LogTable, VolumeChart, LiveTransactions */}
    </main>
  );
}