// src/components/RequireAuth.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { session, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center py-10 animate-pulse text-gray-500">Loading Spiral Gate...</div>;
  }

  if (!session) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}
