// src/components/SectionCard.jsx
import { Card, CardContent } from "@/components/ui/card";

export default function SectionCard({ title, children }) {
  return (
    <Card className="bg-zinc-900 border border-zinc-700 rounded-xl overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {children}
      </CardContent>
    </Card>
  );
}
