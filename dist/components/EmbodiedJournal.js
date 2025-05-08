import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
        }
        else {
            setRitualSuggestion("");
        }
    }
    function extractSymbol(text) {
        const words = text.split(" ");
        return words.find((w) => /^[A-Z][a-z]+$/.test(w)) || "Dream";
    }
    const filteredLog = journalLog.filter((j) => {
        return ((!filterTag || j.tag === filterTag) &&
            (!filterPhase || j.phase === filterPhase));
    });
    const chartData = Object.entries(filteredLog.reduce((acc, curr) => {
        const key = curr.symbol;
        if (!acc[key])
            acc[key] = [];
        acc[key].push({ x: new Date(curr.timestamp).toLocaleDateString(), y: acc[key].length + 1 });
        return acc;
    }, {})).map(([symbol, points]) => ({ id: symbol, data: points }));
    return (_jsxs(Card, { className: "p-4 space-y-4", children: [_jsx("h2", { className: "text-xl font-bold", children: "\u270D\uFE0F Embodied Journal" }), _jsx(Textarea, { placeholder: "Describe your emotional or physical sensation, dream, or insight...", value: entry, onChange: (e) => setEntry(e.target.value) }), _jsx("input", { className: "border px-2 py-1 rounded w-full", placeholder: "Where do you feel this in your body? (e.g., chest, gut, hands)", value: bodyLocation, onChange: (e) => setBodyLocation(e.target.value) }), _jsxs("select", { className: "border px-2 py-1 rounded w-full", value: tag, onChange: (e) => setTag(e.target.value), children: [_jsx("option", { value: "dream", children: "\uD83C\uDF19 Dream" }), _jsx("option", { value: "shadow", children: "\uD83D\uDF04 Shadow" }), _jsx("option", { value: "vision", children: "\uD83D\uDD25 Vision" }), _jsx("option", { value: "wound", children: "\uD83D\uDD73\uFE0F Wound" }), _jsx("option", { value: "desire", children: "\uD83D\uDC93 Desire" }), _jsx("option", { value: "symbol", children: "\uD83D\uDD2E Symbol" })] }), _jsxs("select", { className: "border px-2 py-1 rounded w-full", value: phase, onChange: (e) => setPhase(e.target.value), children: [_jsx("option", { children: "Fire" }), _jsx("option", { children: "Water" }), _jsx("option", { children: "Earth" }), _jsx("option", { children: "Air" }), _jsx("option", { children: "Aether" })] }), _jsx(Button, { onClick: handleSubmit, children: "Submit & Ask Oracle" }), oracleReply && (_jsxs(CardContent, { className: "bg-muted mt-4 p-4 rounded", children: [_jsx("h3", { className: "font-semibold", children: "Oracle Response:" }), _jsx("div", { className: "whitespace-pre-line", children: oracleReply })] })), ritualSuggestion && (_jsxs(CardContent, { className: "bg-yellow-100 border border-yellow-300 mt-4 p-4 rounded", children: [_jsx("h3", { className: "font-semibold", children: "\uD83D\uDD6F\uFE0F Ritual Insight:" }), _jsx("div", { children: ritualSuggestion })] })), _jsxs("div", { className: "flex gap-2 pt-4", children: [_jsxs("select", { className: "border rounded px-2", value: filterTag, onChange: (e) => setFilterTag(e.target.value), children: [_jsx("option", { value: "", children: "All Tags" }), _jsx("option", { value: "dream", children: "\uD83C\uDF19 Dream" }), _jsx("option", { value: "shadow", children: "\uD83D\uDF04 Shadow" }), _jsx("option", { value: "vision", children: "\uD83D\uDD25 Vision" }), _jsx("option", { value: "wound", children: "\uD83D\uDD73\uFE0F Wound" }), _jsx("option", { value: "desire", children: "\uD83D\uDC93 Desire" }), _jsx("option", { value: "symbol", children: "\uD83D\uDD2E Symbol" })] }), _jsxs("select", { className: "border rounded px-2", value: filterPhase, onChange: (e) => setFilterPhase(e.target.value), children: [_jsx("option", { value: "", children: "All Phases" }), _jsx("option", { value: "Fire", children: "Fire" }), _jsx("option", { value: "Water", children: "Water" }), _jsx("option", { value: "Earth", children: "Earth" }), _jsx("option", { value: "Air", children: "Air" }), _jsx("option", { value: "Aether", children: "Aether" })] })] }), filteredLog.length > 0 && (_jsxs("div", { className: "mt-6", children: [_jsx("h3", { className: "font-semibold", children: "\uD83D\uDCDC Past Entries" }), _jsx("ul", { className: "text-sm space-y-3 max-h-64 overflow-auto", children: filteredLog.map((j, i) => (_jsxs("li", { className: "border-b pb-2", children: [_jsx("strong", { children: j.symbol }), " (", j.tag, ", ", j.phase, ")", _jsx("br", {}), _jsx("span", { className: "text-muted-foreground", children: "Q:" }), " ", j.question, _jsx("br", {}), _jsx("span", { className: "text-muted-foreground", children: "A:" }), " ", j.response, _jsx("br", {}), _jsx("span", { className: "text-xs text-gray-400", children: new Date(j.timestamp).toLocaleString() })] }, i))) })] })), chartData.length > 0 && (_jsxs("div", { className: "h-72 mt-6", children: [_jsx("h3", { className: "font-semibold mb-2", children: "\uD83D\uDCC8 Symbol Frequency Over Time" }), _jsx(ResponsiveLine, { data: chartData, margin: { top: 10, right: 20, bottom: 50, left: 40 }, xScale: { type: "point" }, yScale: { type: "linear", min: "auto", max: "auto", stacked: false, reverse: false }, axisBottom: { legend: "Date", legendOffset: 36, legendPosition: "middle" }, axisLeft: { legend: "Entries", legendOffset: -30, legendPosition: "middle" }, colors: { scheme: "nivo" }, lineWidth: 2, pointSize: 6, pointBorderWidth: 1, pointBorderColor: { from: "serieColor" }, useMesh: true })] }))] }));
}
