import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { WelcomeModal } from '@/components/WelcomeModal';
import { useAuth } from '@/hooks/useAuth';
import { OracleInput } from '@/components/OracleInput'; // your query form
import { MemoryList } from '@/components/MemoryList'; // your saved insights list
export function Dashboard() {
    const { user, loading } = useAuth();
    if (loading)
        return _jsx("div", { className: "p-6", children: "Loading your dashboard\u2026" });
    return (_jsxs(_Fragment, { children: [_jsx(WelcomeModal, {}), _jsxs("div", { className: "max-w-4xl mx-auto p-6 space-y-8", children: [_jsxs("h1", { className: "text-3xl font-bold", children: ["Welcome back", user?.email ? `, ${user.email}` : '', "!"] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl mb-2", children: "Ask your Oracle" }), _jsx(OracleInput, {})] }), _jsxs("section", { children: [_jsx("h2", { className: "text-2xl mb-2", children: "My Insights" }), _jsx(MemoryList, {})] })] })] }));
}
