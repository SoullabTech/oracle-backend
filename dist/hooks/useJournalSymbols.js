// File: /hooks/useJournalSymbols.ts
import { useEffect, useState } from "react";
export function useJournalSymbols() {
    const [nodes, setNodes] = useState([]);
    useEffect(() => {
        const entries = JSON.parse(localStorage.getItem("journalEntries") || "[]");
        const formattedNodes = entries.map((entry, index) => ({
            id: `journal-${index}`,
            label: entry.symbol,
            group: "journal",
            tag: entry.tag,
            phase: entry.phase,
            source: "journal",
            timestamp: entry.timestamp,
            summary: entry.entry.slice(0, 80) + (entry.entry.length > 80 ? "..." : ""),
            linkedTo: entry.symbol,
            fx: null,
            fy: null
        }));
        setNodes(formattedNodes);
    }, []);
    return nodes;
}
