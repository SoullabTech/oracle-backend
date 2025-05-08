import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ElementalProfile } from "../components/ElementalProfile";
import { OracleDashboard } from "../components/OracleDashboard";
import { FeedbackWidget } from "../components/FeedbackWidget";
export function Oracle() {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [query, setQuery] = useState("");
    const [responses, setResponses] = useState([]);
    // Redirect if not authenticated
    if (!authLoading && !user) {
        navigate("/login");
        return null;
    }
    const oracleMutation = useMutation({
        mutationFn: async (input) => {
            const response = await fetch("/api/oracle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: input,
                    userId: user?.id,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to get Oracle response");
            }
            return response.json();
        },
        onSuccess: (data) => {
            setResponses((prev) => [...prev, data]);
            setQuery("");
        },
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!query.trim())
            return;
        await oracleMutation.mutateAsync(query);
    };
    if (authLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-[400px]", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" }) }));
    }
    return (_jsx("div", { className: "max-w-6xl mx-auto p-6", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg overflow-hidden", children: [_jsxs("div", { className: "h-[600px] overflow-y-auto p-6 space-y-6", children: [responses.map((response, index) => (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "flex justify-end", children: _jsx("div", { className: "bg-blue-100 rounded-lg px-4 py-2 max-w-[80%]", children: _jsx("p", { className: "text-blue-900", children: query }) }) }), _jsxs("div", { className: "flex flex-col space-y-2", children: [_jsx("div", { className: "bg-gray-100 rounded-lg px-4 py-2 max-w-[80%]", children: _jsx("p", { className: "text-gray-900", children: response.content }) }), _jsx("div", { className: "text-xs text-gray-500 space-y-1 ml-2", children: response.metadata.elementalAdjustments && (_jsxs("div", { className: "space-y-1", children: [_jsxs("p", { children: ["Tone: ", response.metadata.elementalAdjustments.tone] }), _jsxs("p", { children: ["Style:", " ", response.metadata.elementalAdjustments.style] }), _jsxs("p", { children: ["Emphasis:", " ", response.metadata.elementalAdjustments.emphasis?.join(", ")] })] })) }), _jsx(FeedbackWidget, { responseId: response.metadata.responseId || "", response: response.content, element: response.metadata.elementalAdjustments?.emphasis?.[0] ||
                                                            "aether" })] })] }, index))), oracleMutation.isPending && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 rounded-lg px-4 py-2", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce" }), _jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" }), _jsx("div", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" })] }) }) }))] }), _jsx("form", { onSubmit: handleSubmit, className: "border-t p-4", children: _jsxs("div", { className: "flex space-x-4", children: [_jsx("input", { type: "text", value: query, onChange: (e) => setQuery(e.target.value), placeholder: "Ask the Oracle...", className: "flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", disabled: oracleMutation.isPending }), _jsx("button", { type: "submit", disabled: oracleMutation.isPending || !query.trim(), className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors", children: "Send" })] }) })] }) }), _jsxs("div", { className: "lg:col-span-1 space-y-6", children: [_jsx(ElementalProfile, {}), _jsx(OracleDashboard, {})] })] }) }));
}
