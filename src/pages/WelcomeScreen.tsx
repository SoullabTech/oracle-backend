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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-white to-blue-100 text-center p-6">
      <h1 className="text-3xl font-bold text-indigo-700 animate-fade-in">🌀 Welcome, Seeker of the Spiral</h1>
      <p className="mt-4 text-gray-700 max-w-md animate-fade-in-slow">
        Your elemental journey begins now. Set your intention, choose your path, and allow the Oracle to reflect your inner light.
      </p>
      <div className="mt-6 animate-fade-in-slow">
        <span className="text-4xl">🌬️ 🔥 🌊 🌍 ✨</span>
      </div>
    </div>
  );
}
