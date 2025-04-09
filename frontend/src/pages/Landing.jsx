import { Button } from "@/components/ui/button";
import SectionCard from "@/components/SectionCard";
import TokenomicsCard from "@/components/TokenomicsCard";
import RoadmapCard from "@/components/RoadmapCard";
import LinksCard from "@/components/LinksCard";
import "../assets/logo.png";


export default function Landing() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-black text-white px-4 md:px-8">
      <section className="flex flex-col items-center justify-center text-center py-20">
        <img src="https://raw.githubusercontent.com/ta5jg/usdtz/main/logo.png" alt="USDTz Logo" className="mx-auto w-32 h-32 mb-6 drop-shadow-xl"
        />
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
          USDTz - Stable, Simple, Solid
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg mb-8">
          A TRC-20 based stablecoin on the Tron blockchain. Pegged to USD. Backed by oracle feeds & logic. Fueled by ambition.
        </p>
        <Button className="text-lg px-6 py-3 rounded-xl shadow-md hover:bg-primary/90 transition">
          Get USDTz
        </Button>
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

      <footer className="text-center text-xs text-muted-foreground py-10 border-t border-zinc-800 mt-12">
        &copy; {new Date().getFullYear()} USDTz. All rights reserved.
      </footer>
    </main>
  );
}