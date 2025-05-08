// File: /src/components/RitualLibrary.tsx

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function RitualLibrary() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("oracleMemory") || "[]");
    setEntries(stored);
  }, []);

  return (
    <Card className="p-4">
      <h2 className="text-xl font-bold mb-4">🕯️ Ritual Library</h2>
      <div className="space-y-4 max-h-[500px] overflow-y-scroll">
        {entries.map((entry, index) => (
          <div
            key={index}
            className="p-3 bg-muted rounded border shadow hover:bg-background transition cursor-pointer"
            onClick={() => {
              const blob = new Blob([JSON.stringify(entry, null, 2)], {
                type: "application/json",
              });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `ritual_${entry.symbol}_${index}.json`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <div className="text-sm text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</div>
            <div><strong>{entry.symbol}</strong> ({entry.phase})</div>
            <div className="italic">Q: {entry.question}</div>
            <div>A: {entry.response}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}
