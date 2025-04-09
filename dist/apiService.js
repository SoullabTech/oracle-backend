"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePrompt = void 0;
const BACKEND_URL = "https://my-oracle-backend.onrender.com";
const generatePrompt = async (query, userId) => {
    const res = await fetch(`${BACKEND_URL}/api/generate-prompt`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, userId, config: {} })
    });
    if (!res.ok) {
        throw new Error("Failed to fetch Oracle response");
    }
    const data = await res.json();
    return data.prompt;
};
exports.generatePrompt = generatePrompt;
