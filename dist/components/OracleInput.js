import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/OracleInput.tsx
import { useState } from 'react';
export default function OracleInput() {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('/api/oracle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: query, storeToMemory: true, accessLevel: 'public' }),
            });
            if (!res.ok)
                throw new Error(`Status ${res.status}`);
            const data = await res.json();
            setResponse(data.content);
            setQuery('');
        }
        catch (err) {
            console.error(err);
            setError('Failed to get oracle response');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("textarea", { value: query, onChange: e => setQuery(e.target.value), placeholder: "Ask the Oracle...", className: "w-full h-32 border rounded p-2 focus:outline-none focus:ring", required: true }), _jsx("button", { type: "submit", disabled: loading || !query.trim(), className: "px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50", children: loading ? 'Asking...' : 'Ask Oracle' }), error && _jsx("p", { className: "text-red-600", children: error }), response && (_jsxs("div", { className: "mt-4 p-4 bg-gray-100 rounded", children: [_jsx("h3", { className: "font-semibold mb-2", children: "Oracle Says:" }), _jsx("p", { children: response })] }))] }));
}
