// File: /src/agents/oracleRouter.ts
import { FireAgent } from "@/core/agents/FireAgent";
import { WaterAgent } from "@/core/agents/WaterAgent";
import { EarthAgent } from "@/core/agents/EarthAgent";
import { AirAgent } from "@/core/agents/AirAgent";
import { AetherAgent } from "@/core/agents/AetherAgent";
const agents = {
    Fire: new FireAgent(),
    Water: new WaterAgent(),
    Earth: new EarthAgent(),
    Air: new AirAgent(),
    Aether: new AetherAgent(),
};
export async function askOracle({ symbol, phase, question, source = "manual" }) {
    const agent = agents[phase] || agents.Aether;
    storeSymbolMemory({ symbol, phase, question, source });
    return await agent.respond({ symbol, question });
}
function storeSymbolMemory(entry) {
    const stored = JSON.parse(localStorage.getItem("oracleMemory") || "[]");
    stored.push({ ...entry, timestamp: new Date().toISOString() });
    localStorage.setItem("oracleMemory", JSON.stringify(stored));
}
// File: /src/components/OracleChat.tsx
import { useEffect, useState } from "react";
import { askOracle } from "@/agents/oracleRouter";
import dynamic from "next/dynamic";
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });
const PHASE_COLORS = {
    Fire: "#ff6b6b",
    Water: "#4dabf7",
    Earth: "#82c91e",
    Air: "#74c0fc",
    Aether: "#c69ff7",
};
export default function OracleChat() {
    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState("");
    const [phase, setPhase] = useState("Fire");
    const [symbol, setSymbol] = useState("Phoenix");
    const [history, setHistory] = useState([]);
    const [search, setSearch] = useState("");
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem("oracleMemory") || "[]");
        setHistory(stored);
    }, []);
    async function handleAsk() {
        const res = await askOracle({ symbol, phase, question, source: "manual" });
        const newEntry = { question, response: res, symbol, phase, timestamp: new Date().toISOString(), source: "manual" };
        const updatedHistory = [...history, newEntry];
        setResponse(res);
        setHistory(updatedHistory);
        localStorage.setItem("oracleMemory", JSON.stringify(updatedHistory));
    }
    const filteredHistory = search
        ? history.filter((entry) => entry.symbol.toLowerCase().includes(search.toLowerCase()) ||
            entry.question.toLowerCase().includes(search.toLowerCase()) ||
            entry.response.toLowerCase().includes(search.toLowerCase()))
        : history;
    const constellation = {
        nodes: filteredHistory.map((entry, index) => ({
            id: entry.symbol + "-" + index,
            symbol: entry.symbol,
            phase: entry.phase,
            question: entry.question,
            response: entry.response,
            source: entry.source,
        })),
        links: filteredHistory.slice(1).map((entry, i) => ({
            source: filteredHistory[i].symbol + "-" + i,
            target: entry.symbol + "-" + (i + 1),
        })),
    };
    return className = "p-4 space-y-4" >
        placeholder;
    "Ask the Oracle...";
    value = { question };
    onChange = {}(e);
    setQuestion(e.target.value);
}
/>
    < div;
className = "flex space-x-2" >
    value;
{
    phase;
}
onChange = {}(e);
setPhase(e.target.value);
 >
    { Object, : .keys(PHASE_COLORS).map((p) => key = { p } > { p } < /option>) }
    < /select>
    < input;
value = { symbol };
onChange = {}(e);
setSymbol(e.target.value);
placeholder = "Symbol (e.g., Phoenix)";
className = "border rounded px-2"
    /  >
    onClick;
{
    handleAsk;
}
 > Ask;
Oracle < /Button>
    < /div>
    < input;
value = { search };
onChange = {}(e);
setSearch(e.target.value);
placeholder = "Search memory...";
className = "border px-2 py-1 rounded w-full"
    /  >
    className;
"whitespace-pre-line bg-muted p-4 rounded" >
    { response } || "Awaiting divine reply...";
/CardContent>;
{
    filteredHistory.length > 0 && className;
    "h-96 mt-6" >
        className;
    "font-semibold mb-2" > Constellation;
    Map < /h3>
        < ForceGraph2D;
    graphData = { constellation };
    nodeAutoColorBy = "phase";
    nodeCanvasObject = {}(node, ctx, globalScale);
    {
        const label = `${node.symbol}`;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.fillStyle = PHASE_COLORS[node.phase] || "#aaa";
        ctx.beginPath();
        ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = "#333";
        ctx.fillText(label, node.x + 8, node.y);
    }
}
nodePointerAreaPaint = {}(node, color, ctx);
{
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI);
    ctx.fill();
}
onNodeClick = {}(node);
{
    const exportData = {
        symbol: node.symbol,
        phase: node.phase,
        question: node.question,
        response: node.response,
        source: node.source,
        timestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `oracle_${node.symbol}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
/>
    < /div>;
/Card>;
;
