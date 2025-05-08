import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: src/pages/Signup.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth"; // ← updated import
export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signUp(email, password);
            navigate("/survey");
        }
        catch {
            setError("Error creating account");
        }
    };
    return (_jsx("div", { className: "min-h-[calc(100vh-4rem)] flex items-center justify-center", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-md w-full max-w-md", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-center", children: "Create Account" }), error && (_jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email" }), _jsx("input", { id: "email", type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsx("input", { id: "password", type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" })] }), _jsx("button", { type: "submit", className: "w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700", children: "Sign Up" })] }), _jsxs("p", { className: "mt-4 text-center text-sm text-gray-600", children: ["Already have an account?", " ", _jsx(Link, { to: "/login", className: "text-blue-600 hover:text-blue-500", children: "Sign in" })] })] }) }));
}
