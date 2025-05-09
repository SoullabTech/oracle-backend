import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// File: /src/components/BBS/OracleBroadcastFeed.tsx
// Layer: 📡 Frontend — Living BBS Stream for Symbolic Thresholds + Phase Events
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
export default function OracleBroadcastFeed() {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        async function fetchBroadcasts() {
            const res = await fetch('/api/bbs/posts');
            const data = await res.json();
            setPosts(data);
        }
        fetchBroadcasts();
    }, []);
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-2xl font-bold", children: "\uD83D\uDCE1 Oracle Broadcasts" }), posts.map((post, i) => (_jsxs(Card, { className: "p-4 border shadow-sm border-dashed border-gray-300", children: [_jsx("div", { className: "text-xs text-gray-400", children: new Date(post.postedAt).toLocaleString() }), _jsxs("div", { className: "font-semibold text-indigo-700", children: ["\uD83D\uDD01 ", post.topic] }), _jsx("div", { className: "text-sm whitespace-pre-line", children: post.summary }), _jsxs("div", { className: "text-sm italic text-muted-foreground pt-1", children: ["\uD83D\uDD6F\uFE0F Ritual: ", post.ritual] })] }, i)))] }));
}
