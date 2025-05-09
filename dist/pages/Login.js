import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signIn(email, password); // Ensure the signIn function handles the credentials properly
            navigate("/survey"); // Redirect to survey page after successful login
        }
        catch (err) {
            setError("Invalid email or password");
        }
    };
    return (_jsx("div", { className: "min-h-[calc(100vh-4rem)] flex items-center justify-center", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-md w-full max-w-md", children: [_jsx("h1", { className: "text-2xl font-bold mb-6 text-center", children: "Login" }), error && (_jsx("div", { className: "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4", children: error })), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email", className: "block text-sm font-medium text-gray-700", children: "Email" }), _jsx("input", { type: "email", id: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password", className: "block text-sm font-medium text-gray-700", children: "Password" }), _jsx("input", { type: "password", id: "password", value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", required: true })] }), _jsx("button", { type: "submit", className: "w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500", children: "Sign In" })] }), _jsxs("p", { className: "mt-4 text-center text-sm text-gray-600", children: ["Don't have an account?", " ", _jsx(Link, { to: "/signup", className: "text-blue-600 hover:text-blue-500", children: "Sign up" })] })] }) }));
}
