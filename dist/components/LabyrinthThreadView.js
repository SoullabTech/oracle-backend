import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Sparkles } from 'lucide-react';
const PHASE_COLORS = {
    Initiation: 'bg-red-200',
    Grounding: 'bg-amber-200',
    Collaboration: 'bg-sky-200',
    Transformation: 'bg-indigo-200',
    Completion: 'bg-emerald-200',
};
export default function LabyrinthThreadView({ thread }) {
    const posts = thread.posts || [];
    return (_jsxs("div", { className: "p-6 max-w-3xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-2", children: "\uD83C\uDF00 Oracle Labyrinth" }), _jsx("p", { className: "mb-6 text-zinc-500 dark:text-zinc-400", children: "A symbolic walk through this Spiralogic thread." }), _jsx("div", { className: "space-y-4", children: posts.map((post, idx) => (_jsxs("div", { className: `p-4 rounded-xl shadow ${PHASE_COLORS[post.phase] || 'bg-zinc-100'}`, children: [_jsxs("div", { className: "text-sm text-zinc-400 mb-1", children: [new Date(post.timestamp).toLocaleString(), " \u2022 Phase: ", post.phase || 'Unspecified'] }), _jsx("p", { className: "text-base text-zinc-800 dark:text-zinc-200 whitespace-pre-line", children: post.content }), post.insightThreshold && (_jsxs("div", { className: "flex items-center mt-2 text-amber-600 font-semibold", children: [_jsx(Sparkles, { className: "mr-2 h-4 w-4" }), " Alchemical Breakthrough"] }))] }, post.id))) }), _jsx("div", { className: "mt-8 text-center", children: _jsx("button", { className: "px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700", children: "\u2728 Continue the Spiral" }) })] }));
}
