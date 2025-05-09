import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/LoginPage.tsx (or src/components/LoginPage.tsx)
import { useState } from "react";
import { useAuth } from "../hooks/useAuth"; // Adjust path based on your project structure
const LoginPage = () => {
    const { signIn, error, loading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signIn(email, password);
    };
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-lg w-full max-w-md", children: [_jsx("h2", { className: "text-2xl font-bold mb-4 text-center", children: "Sign In" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full p-3 border border-gray-300 rounded-md", required: true }), _jsx("input", { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full p-3 border border-gray-300 rounded-md", required: true }), _jsx("button", { type: "submit", className: "w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300", disabled: loading, children: loading ? "Signing In..." : "Sign In" })] }), error && _jsx("p", { className: "mt-4 text-red-500 text-center", children: error })] }) }));
};
export default LoginPage;
