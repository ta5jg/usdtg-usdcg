// src/components/LinksCard.jsx
export default function LinksCard() {
    const links = [
      "Telegram",
      "Twitter / X",
      "TronScan",
      "DEX Listing",
    ];
  
    return (
      <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-4">
          <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-400">
            {links.map((link) => (
              <li key={link}>
                <a href="#" className="hover:underline">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }