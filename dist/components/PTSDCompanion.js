import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/PTSDCompanion.tsx
import { useState } from 'react';
const PTSDCompanion = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/oracle/ptsd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ message })
            });
            const data = await res.json();
            setResponse(data.response);
        }
        catch (err) {
            setResponse('Error connecting to PTSD Agent.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "max-w-xl mx-auto p-4 bg-white shadow rounded", children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "\uD83D\uDEE1\uFE0F PTSD Companion" }), _jsx("textarea", { className: "w-full p-2 border rounded", rows: 4, placeholder: "What\u2019s on your mind?", value: message, onChange: (e) => setMessage(e.target.value) }), _jsx("button", { onClick: handleSubmit, disabled: loading, className: "mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700", children: loading ? 'Consulting...' : 'Speak to the PTSD Agent' }), response && (_jsxs("div", { className: "mt-4 p-3 border rounded bg-blue-50 text-blue-900", children: [_jsx("strong", { children: "Response:" }), _jsx("p", { children: response })] }))] }));
};
export default PTSDCompanion;
