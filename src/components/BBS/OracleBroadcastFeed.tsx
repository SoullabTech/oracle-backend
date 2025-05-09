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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">📡 Oracle Broadcasts</h2>
      {posts.map((post, i) => (
        <Card key={i} className="p-4 border shadow-sm border-dashed border-gray-300">
          <div className="text-xs text-gray-400">{new Date(post.postedAt).toLocaleString()}</div>
          <div className="font-semibold text-indigo-700">🔁 {post.topic}</div>
          <div className="text-sm whitespace-pre-line">{post.summary}</div>
          <div className="text-sm italic text-muted-foreground pt-1">🕯️ Ritual: {post.ritual}</div>
        </Card>
      ))}
    </div>
  );
}
