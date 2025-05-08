import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Header from '@/components/Header';
import ConstellationHistory from '@/components/ConstellationHistory';
import { SacredFooter } from '@/components/SacredFooter';
import { PageTransition } from '@/components/PageTransition';
export default function ConstellationArchivePage() {
    return (_jsxs(PageTransition, { children: [_jsx(Header, {}), _jsxs("main", { className: "min-h-screen p-8 bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-50 space-y-8", children: [_jsxs("div", { className: "text-center space-y-2", children: [_jsx("h1", { className: "text-3xl font-bold text-indigo-700", children: "\uD83C\uDF00 Your Constellation Rituals" }), _jsx("p", { className: "text-purple-600 italic", children: "These are the echoes of your sacred work \u2014 ancestral healing, elemental insight, and field transformation." })] }), _jsx("div", { className: "max-w-4xl mx-auto", children: _jsx(ConstellationHistory, {}) })] }), _jsx(SacredFooter, {})] }));
}
