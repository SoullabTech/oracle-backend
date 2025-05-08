import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
export function Home() {
    const [count, setCount] = useState(0);
    return (_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "flex justify-center gap-8", children: [_jsx("a", { href: "https://vite.dev", target: "_blank", children: _jsx("img", { src: viteLogo, className: "h-24 hover:drop-shadow-lg transition-all", alt: "Vite logo" }) }), _jsx("a", { href: "https://react.dev", target: "_blank", children: _jsx("img", { src: reactLogo, className: "h-24 hover:drop-shadow-lg transition-all", alt: "React logo" }) })] }), _jsx("h1", { className: "text-4xl font-bold mt-8", children: "Vite + React" }), _jsxs("div", { className: "mt-8", children: [_jsxs("button", { onClick: () => setCount((count) => count + 1), className: "px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors", children: ["count is ", count] }), _jsxs("p", { className: "mt-4", children: ["Edit", " ", _jsx("code", { className: "bg-gray-100 px-2 py-1 rounded", children: "src/pages/Home.tsx" }), " ", "and save to test HMR"] })] })] }));
}
