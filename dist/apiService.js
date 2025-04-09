const BACKEND_URL = "https://my-oracle-backend.onrender.com";
export const generatePrompt = async (query, userId) => {
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
