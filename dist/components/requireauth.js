import { jsx as _jsx } from "react/jsx-runtime";
// src/components/RequireAuth.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
export default function RequireAuth({ children }) {
    const { session, loading } = useSession();
    const location = useLocation();
    if (loading) {
        return _jsx("div", { className: "flex justify-center py-10 animate-pulse text-gray-500", children: "Loading Spiral Gate..." });
    }
    if (!session) {
        return _jsx(Navigate, { to: `/login?redirect=${encodeURIComponent(location.pathname)}`, replace: true });
    }
    return children;
}
