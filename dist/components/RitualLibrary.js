import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: /src/components/RitualLibrary.tsx
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
export default function RitualLibrary() {
    const [entries, setEntries] = useState([]);
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("oracleMemory") || "[]");
        setEntries(stored);
    }, []);
    return (_jsxs(Card, { className: "p-4", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: "\uD83D\uDD6F\uFE0F Ritual Library" }), _jsx("div", { className: "space-y-4 max-h-[500px] overflow-y-scroll", children: entries.map((entry, index) => (_jsxs("div", { className: "p-3 bg-muted rounded border shadow hover:bg-background transition cursor-pointer", onClick: () => {
                        const blob = new Blob([JSON.stringify(entry, null, 2)], {
                            type: "application/json",
                        });
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = `ritual_${entry.symbol}_${index}.json`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }, children: [_jsx("div", { className: "text-sm text-muted-foreground", children: new Date(entry.timestamp).toLocaleString() }), _jsxs("div", { children: [_jsx("strong", { children: entry.symbol }), " (", entry.phase, ")"] }), _jsxs("div", { className: "italic", children: ["Q: ", entry.question] }), _jsxs("div", { children: ["A: ", entry.response] })] }, index))) })] }));
}
