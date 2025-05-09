import React from 'react';
import { Sparkles } from 'lucide-react';

const PHASE_COLORS: Record<string, string> = {
  Initiation: 'bg-red-200',
  Grounding: 'bg-amber-200',
  Collaboration: 'bg-sky-200',
  Transformation: 'bg-indigo-200',
  Completion: 'bg-emerald-200',
};

export default function LabyrinthThreadView({ thread }: { thread: any }) {
  const posts = thread.posts || [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">🌀 Oracle Labyrinth</h1>
      <p className="mb-6 text-zinc-500 dark:text-zinc-400">
        A symbolic walk through this Spiralogic thread.
      </p>

      <div className="space-y-4">
        {posts.map((post: any, idx: number) => (
          <div key={post.id} className={`p-4 rounded-xl shadow ${PHASE_COLORS[post.phase] || 'bg-zinc-100'}`}>
            <div className="text-sm text-zinc-400 mb-1">
              {new Date(post.timestamp).toLocaleString()} • Phase: {post.phase || 'Unspecified'}
            </div>
            <p className="text-base text-zinc-800 dark:text-zinc-200 whitespace-pre-line">{post.content}</p>

            {post.insightThreshold && (
              <div className="flex items-center mt-2 text-amber-600 font-semibold">
                <Sparkles className="mr-2 h-4 w-4" /> Alchemical Breakthrough
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700">
          ✨ Continue the Spiral
        </button>
      </div>
    </div>
  );
}
