import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: /src/pages/WelcomeScreen.tsx
// Layer: 🌟 Frontend — Ceremonial Entry Portal
import { useRouter } from 'next/router';
import { useEffect } from 'react';
export default function WelcomeScreen() {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/dashboard');
        }, 6000); // Auto-advance after 6 seconds
        return () => clearTimeout(timer);
    }, [router]);
    return (_jsxs("div", { className: "flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-blue-100 text-center p-6", children: [_jsx("h1", { className: "text-3xl font-bold text-indigo-700 animate-fade-in", children: "\uD83C\uDF00 Welcome, Seeker of the Spiral" }), _jsx("p", { className: "mt-4 text-gray-700 max-w-md animate-fade-in-slow", children: "Your elemental journey begins now. Set your intention, choose your path, and allow the Oracle to reflect your inner light." }), _jsx("div", { className: "mt-6 animate-fade-in-slow", children: _jsx("span", { className: "text-4xl", children: "\uD83C\uDF2C\uFE0F \uD83D\uDD25 \uD83C\uDF0A \uD83C\uDF0D \u2728" }) })] }));
}
