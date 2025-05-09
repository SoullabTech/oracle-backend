// src/pages/Dashboard.tsx
import React from 'react';
import { WelcomeModal } from '@/components/WelcomeModal';
import { useAuth } from '@/hooks/useAuth';
import { OracleInput } from '@/components/OracleInput';     // your query form
import { MemoryList } from '@/components/MemoryList';       // your saved insights list

export function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading your dashboard…</div>;

  return (
    <>
      <WelcomeModal />

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold">
          Welcome back{user?.email ? `, ${user.email}` : ''}!
        </h1>

        {/* Oracle query input */}
        <section>
          <h2 className="text-2xl mb-2">Ask your Oracle</h2>
          <OracleInput />
        </section>

        {/* Memory / insight history */}
        <section>
          <h2 className="text-2xl mb-2">My Insights</h2>
          <MemoryList />
        </section>
      </div>
    </>
  );
}
