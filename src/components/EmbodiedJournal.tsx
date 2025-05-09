// File: /src/components/EmbodiedJournal.tsx

import { useState, useEffect } from "react";
import { askOracle } from "@/agents/oracleRouter";
import { insertJournalEntry } from "@/lib/jounralService";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";

export default function EmbodiedJournal() {
  const [entry, setEntry] = useState("");
  const [bodyLocation, setBodyLocation] = useState("");
  const [phase, setPhase] = useState("Water");
  const [tag, setTag] = useState("dream");
  const [oracleReply, setOracleReply] = useState("");
  const [journalLog, setJournalLog] = useState([]);
  const [filterTag, setFilterTag] = useState("");
  const [filterPhase, setFilterPhase] = useState("");
  const [ritualSuggestion, setRitualSuggestion] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("journalEntries") || "[]");
    setJournalLog(stored);
  }, []);

  async function handleSubmit() {
    const symbol = extractSymbol(entry);
    const question = `(${tag}) What guidance can you offer regarding: ${entry}`;
    const response = await askOracle({ symbol, phase, question, source: "journal" });
    setOracleReply(response);

    const entryData = {
      entry,
      bodyLocation,
      phase,
      tag,
      symbol,
      question,
      response,
      timestamp: new Date().toISOString(),
    };

    await insertJournalEntry(entryData);

    const updatedLog = [...journalLog, entryData];
    setJournalLog(updatedLog);
    localStorage.setItem("journalEntries", JSON.stringify(updatedLog));

    const recurrenceCount = updatedLog.filter(e => e.symbol === symbol).length;
    if (recurrenceCount >= 3) {
      setRitualSuggestion(`🔥 Suggested Ritual for recurring symbol "${symbol}": Fire Rebirth Breath ✨`);
    } else {
      setRitualSuggestion("");
    }
  }

  function extractSymbol(text: string) {
    const words = text.split(" ");
    return words.find((w) => /^[A-Z][a-z]+$/.test(w)) || "Dream";
  }

  const filteredLog = journalLog.filter((j) => {
    return (
      (!filterTag || j.tag === filterTag) &&
      (!filterPhase || j.phase === filterPhase)
    );
  });

  const chartData = Object.entries(
    filteredLog.reduce((acc, curr) => {
      const key = curr.symbol;
      if (!acc[key]) acc[key] = [];
      acc[key].push({ x: new Date(curr.timestamp).toLocaleDateString(), y: acc[key].length + 1 });
      return acc;
    }, {})
  ).map(([symbol, points]) => ({ id: symbol, data: points }));

  return (
    <Card className="p-4 space-y-4">
      <h2 className="text-xl font-bold">✍️ Embodied Journal</h2>
      <Textarea
        placeholder="Describe your emotional or physical sensation, dream, or insight..."
        value={entry}
        onChange={(e) => setEntry(e.target.value)}
      />
      <input
        className="border px-2 py-1 rounded w-full"
        placeholder="Where do you feel this in your body? (e.g., chest, gut, hands)"
        value={bodyLocation}
        onChange={(e) => setBodyLocation(e.target.value)}
      />
      <select
        className="border px-2 py-1 rounded w-full"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
      >
        <option value="dream">🌙 Dream</option>
        <option value="shadow">🜄 Shadow</option>
        <option value="vision">🔥 Vision</option>
        <option value="wound">🕳️ Wound</option>
        <option value="desire">💓 Desire</option>
        <option value="symbol">🔮 Symbol</option>
      </select>
      <select
        className="border px-2 py-1 rounded w-full"
        value={phase}
        onChange={(e) => setPhase(e.target.value)}
      >
        <option>Fire</option>
        <option>Water</option>
        <option>Earth</option>
        <option>Air</option>
        <option>Aether</option>
      </select>
      <Button onClick={handleSubmit}>Submit & Ask Oracle</Button>

      {oracleReply && (
        <CardContent className="bg-muted mt-4 p-4 rounded">
          <h3 className="font-semibold">Oracle Response:</h3>
          <div className="whitespace-pre-line">{oracleReply}</div>
        </CardContent>
      )}

      {ritualSuggestion && (
        <CardContent className="bg-yellow-100 border border-yellow-300 mt-4 p-4 rounded">
          <h3 className="font-semibold">🕯️ Ritual Insight:</h3>
          <div>{ritualSuggestion}</div>
        </CardContent>
      )}

      <div className="flex gap-2 pt-4">
        <select className="border rounded px-2" value={filterTag} onChange={(e) => setFilterTag(e.target.value)}>
          <option value="">All Tags</option>
          <option value="dream">🌙 Dream</option>
          <option value="shadow">🜄 Shadow</option>
          <option value="vision">🔥 Vision</option>
          <option value="wound">🕳️ Wound</option>
          <option value="desire">💓 Desire</option>
          <option value="symbol">🔮 Symbol</option>
        </select>
        <select className="border rounded px-2" value={filterPhase} onChange={(e) => setFilterPhase(e.target.value)}>
          <option value="">All Phases</option>
          <option value="Fire">Fire</option>
          <option value="Water">Water</option>
          <option value="Earth">Earth</option>
          <option value="Air">Air</option>
          <option value="Aether">Aether</option>
        </select>
      </div>

      {filteredLog.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">📜 Past Entries</h3>
          <ul className="text-sm space-y-3 max-h-64 overflow-auto">
            {filteredLog.map((j, i) => (
              <li key={i} className="border-b pb-2">
                <strong>{j.symbol}</strong> ({j.tag}, {j.phase})<br />
                <span className="text-muted-foreground">Q:</span> {j.question}<br />
                <span className="text-muted-foreground">A:</span> {j.response}<br />
                <span className="text-xs text-gray-400">{new Date(j.timestamp).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {chartData.length > 0 && (
        <div className="h-72 mt-6">
          <h3 className="font-semibold mb-2">📈 Symbol Frequency Over Time</h3>
          <ResponsiveLine
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 50, left: 40 }}
            xScale={{ type: "point" }}
            yScale={{ type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }}
            axisBottom={{ legend: "Date", legendOffset: 36, legendPosition: "middle" }}
            axisLeft={{ legend: "Entries", legendOffset: -30, legendPosition: "middle" }}
            colors={{ scheme: "nivo" }}
            lineWidth={2}
            pointSize={6}
            pointBorderWidth={1}
            pointBorderColor={{ from: "serieColor" }}
            useMesh={true}
          />
        </div>
      )}
    </Card>
  );
}
