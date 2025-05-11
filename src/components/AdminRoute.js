import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { isAdmin } from '../services/adminService';
export function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();
    const { data: isUserAdmin, isLoading } = useQuery({
        queryKey: ['isAdmin', user?.id],
        queryFn: () => isAdmin(user?.id || ''),
        enabled: !!user,
    });
    if (loading || isLoading) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" }) }));
    }
    if (!user || !isUserAdmin) {
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    return _jsx(_Fragment, { children: children });
}
