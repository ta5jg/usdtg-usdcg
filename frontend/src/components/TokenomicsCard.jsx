import { Card, CardContent } from "@/components/ui/card";

export default function TokenomicsCard() {
  return (
    <Card className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-2">
          <li>Max Supply: 50 Billion USDTz</li>
          <li>Fee: 1% per transfer</li>
          <li>Decimals: 6</li>
          <li>Contract: [Insert Address]</li>
        </ul>
      </CardContent>
    </Card>
  );
}
