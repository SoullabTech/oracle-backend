import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation } from 'react-router-dom';

export function OnboardingGuard({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  const [complete, setComplete] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      supabase
        .from('profiles')
        .select('onboarding_complete')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          setComplete(data?.onboarding_complete ?? false);
        });
    } else if (!loading) {
      setComplete(false);
    }
  }, [user, loading]);

  if (loading || complete === null) {
    return <div>Loading…</div>;
  }
  if (!user || !complete) {
    // don’t redirect if already on the onboarding page
    if (location.pathname !== '/onboarding') {
      return <Navigate to="/onboarding" replace />;
    }
  }
  return children;
}
