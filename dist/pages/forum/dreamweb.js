import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import DreamWeb from '@/components/DreamWeb';
import { fetchThreads } from '../lib/forumService';
import { extractSymbols } from '../lib/symbolLinkService';
export default function DreamWebPage() {
    const [symbolicThreads, setSymbolicThreads] = useState([]);
    useEffect(() => {
        async function load() {
            const threads = await fetchThreads();
            const withSymbols = threads.map((t) => ({
                ...t,
                symbols: extractSymbols(t.content || t.title),
            }));
            setSymbolicThreads(withSymbols);
        }
        load();
    }, []);
    return (_jsxs("div", { className: "p-6", children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: "\uD83C\uDF19 Dream Web" }), _jsx("p", { className: "mb-4 text-zinc-500 dark:text-zinc-400", children: "Explore symbolic threads and their shared motifs across the Spiralogic field." }), _jsx(DreamWeb, { threads: symbolicThreads })] }));
}
