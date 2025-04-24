import { Button } from "@/components/ui/button";
import SectionCard from "@/components/SectionCard";
import TokenomicsCard from "@/components/TokenomicsCard";
import RoadmapCard from "@/components/RoadmapCard";
import LinksCard from "@/components/LinksCard";
import "../assets/logo.webp";
import EnergyCalculator from "../components/EnergyCalculator";


export default function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white px-4 md:px-8">
      <section className="flex flex-col items-center justify-center text-center py-20">
        <img src="https://gateway.pinata.cloud/ipfs/bafkreidmrotlmuxjooihz4omwosupptt43apwu7ps5onuizpetdonp7f3u" alt="USDTg Logo" className="mx-auto w-32 h-32 mb-6 drop-shadow-xl"
        />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          USDTg - Stable, Simple, Solid
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg mb-8">
          A TRC-20 based stablecoin on the Tron blockchain. Pegged to USD. Backed by oracle feeds & logic. Fueled by ambition.
        </p>
        <Button className="text-lg px-6 py-3 rounded-xl shadow-md hover:bg-primary/90 transition">
          Claim USDTg
        </Button>
      </section>
      
      <section className="flex justify-center items-center px-4 py-10">
        <div className="bg-gradient-to-r from-green-700 to-emerald-500 text-white rounded-xl shadow-lg p-8 w-full max-w-3xl text-center">
          <h2 className="text-2xl font-extrabold mb-3 flex items-center justify-center">
            🎁 <span className="ml-2">Join the <span className="text-white font-bold">USDTg Airdrop</span> Campaign!</span>
          </h2>
          <p className="mb-6 text-white text-lg">
            Fill out the form and receive <strong>5–10 USDTg</strong> as a gift. Support the campaign and spread the word!
          </p>
          <a
            href="https://forms.gle/6YATrE354istfuHf6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-green-700 font-semibold px-8 py-3 rounded-full shadow-md hover:bg-gray-200 transition"
          >
            Participate Now
          </a>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto py-16 px-4">
        <SectionCard title="Tokenomics">
          <TokenomicsCard />
        </SectionCard>

        <SectionCard title="Roadmap">
          <RoadmapCard />
        </SectionCard>

        <SectionCard title="Links">
          <LinksCard />
        </SectionCard>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-4 text-center">🔋 Energy Estimation Tool</h2>
        <EnergyCalculator />
      </section>

      <footer className="text-center text-xs text-muted-foreground py-10 border-t border-zinc-800 mt-12">
        &copy; {new Date().getFullYear()} USDTg. All rights reserved.
      </footer>
    </main>
  );
}