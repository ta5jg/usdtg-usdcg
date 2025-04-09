import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white p-6">
      <section className="text-center py-16">
        <img
          src="/usdtz-logo.png"
          alt="USDTz Logo"
          className="mx-auto w-32 h-32 mb-6 drop-shadow-xl"
        />
        <h1 className="text-4xl font-bold mb-4">USDTz - Stable, Simple, Solid</h1>
        <p className="text-zinc-300 max-w-xl mx-auto mb-6">
          A TRC-20 based stablecoin on the Tron blockchain. Pegged to USD. Backed by oracle feeds & logic. Fueled by ambition.
        </p>
        <Button className="text-lg px-6 py-3 rounded-2xl">Get USDTz</Button>
      </section>

      <section className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto py-12">
        <Card className="bg-zinc-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Tokenomics</h2>
            <ul className="text-sm text-zinc-400 list-disc pl-4 space-y-1">
              <li>Max Supply: 50 Billion USDTz</li>
              <li>Fee: 1% per transfer</li>
              <li>Decimals: 6</li>
              <li>Contract: [Insert Address]</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Roadmap</h2>
            <ul className="text-sm text-zinc-400 list-disc pl-4 space-y-1">
              <li>Q2 2025: Token launch + DEX liquidity</li>
              <li>Q3 2025: CoinGecko & CMC listing</li>
              <li>Q4 2025: Wallet integrations & platform build</li>
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-zinc-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-2">Links</h2>
            <ul className="text-sm text-zinc-400 list-disc pl-4 space-y-1">
              <li><a href="#" className="hover:underline">Telegram</a></li>
              <li><a href="#" className="hover:underline">Twitter / X</a></li>
              <li><a href="#" className="hover:underline">TronScan</a></li>
              <li><a href="#" className="hover:underline">DEX Listing</a></li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <footer className="text-center text-sm text-zinc-500 py-10">
        &copy; {new Date().getFullYear()} USDTz. All rights reserved.
      </footer>
    </main>
  );
}
