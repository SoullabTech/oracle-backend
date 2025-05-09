import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
export default function SharedJournal({ onSubmit }) {
    const [text, setText] = useState("");
    const [loading, setLoading] = useState(false);
    async function handleSubmit() {
        setLoading(true);
        await onSubmit(text);
        setText("");
        setLoading(false);
    }
    return (_jsxs("div", { className: "p-6 bg-zinc-100 rounded-xl shadow dark:bg-zinc-900", children: [_jsx("h2", { className: "text-xl font-bold mb-2", children: "\uD83D\uDCD3 Shared Spiral Journal" }), _jsx("p", { className: "text-zinc-600 dark:text-zinc-300 mb-4", children: "Write your reflection. The Oracle will respond with a co-reflection based on your current spiral phase." }), _jsx("textarea", { className: "w-full h-40 p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500", value: text, onChange: (e) => setText(e.target.value), placeholder: "Speak your truth..." }), _jsx("button", { onClick: handleSubmit, disabled: loading || !text.trim(), className: "mt-4 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded", children: loading ? "Reflecting..." : "Submit to Oracle" })] }));
}
