import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ArrowDownIcon, ArrowUpIcon, UsersIcon, ClockIcon, ServerIcon, BoltIcon, } from "@heroicons/react/24/outline";
import { getSystemMetrics } from "../../services/adminService";
import { AskOracle } from "./AskOracle";
import { useAuth } from "../../lib/auth";
function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
}
export function DashboardOverview() {
    const { currentUser } = useAuth();
    const { data: metrics, isLoading } = useQuery({
        queryKey: ["systemMetrics"],
        queryFn: getSystemMetrics,
        refetchInterval: 30000,
    });
    if (isLoading) {
        return (_jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded w-1/4" }), _jsx("div", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "h-32 bg-gray-200 rounded-lg" }, i))) }), _jsx("div", { className: "h-96 bg-gray-200 rounded-lg" })] }));
    }
    const stats = [
        {
            name: "Active Users",
            value: metrics?.currentActiveUsers || 0,
            change: "+4.75%",
            changeType: "positive",
            icon: UsersIcon,
        },
        {
            name: "Avg. Response Time",
            value: `${metrics?.avgResponseTime || 0}ms`,
            change: "-1.39%",
            changeType: "negative",
            icon: ClockIcon,
        },
        {
            name: "Memory Usage",
            value: `${metrics?.memoryUsage || 0}%`,
            change: "+2.45%",
            changeType: "positive",
            icon: ServerIcon,
        },
        {
            name: "System Load",
            value: metrics?.systemLoad || "0.45",
            change: "-3.02%",
            changeType: "negative",
            icon: BoltIcon,
        },
    ];
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Dashboard Overview" }), _jsxs("p", { className: "mt-2 text-sm text-gray-700", children: ["Last updated: ", format(new Date(), "PPpp")] })] }), _jsx("div", { children: _jsx("dl", { className: "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4", children: stats.map((item) => (_jsxs("div", { className: "relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6", children: [_jsxs("dt", { children: [_jsx("div", { className: "absolute rounded-md bg-indigo-500 p-3", children: _jsx(item.icon, { className: "h-6 w-6 text-white", "aria-hidden": "true" }) }), _jsx("p", { className: "ml-16 truncate text-sm font-medium text-gray-500", children: item.name })] }), _jsxs("dd", { className: "ml-16 flex items-baseline pb-6 sm:pb-7", children: [_jsx("p", { className: "text-2xl font-semibold text-gray-900", children: item.value }), _jsxs("p", { className: classNames(item.changeType === "positive"
                                            ? "text-green-600"
                                            : "text-red-600", "ml-2 flex items-baseline text-sm font-semibold"), children: [item.changeType === "positive" ? (_jsx(ArrowUpIcon, { className: "h-5 w-5 flex-shrink-0 self-center text-green-500" })) : (_jsx(ArrowDownIcon, { className: "h-5 w-5 flex-shrink-0 self-center text-red-500" })), _jsxs("span", { className: "sr-only", children: [item.changeType === "positive" ? "Increased" : "Decreased", " ", "by"] }), item.change] })] })] }, item.name))) }) }), _jsxs("div", { className: "grid grid-cols-1 gap-8 lg:grid-cols-2", children: [_jsx("div", { className: "bg-white shadow rounded-lg p-6", children: _jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: "Response Time Distribution" }) }), _jsx("div", { className: "bg-white shadow rounded-lg p-6", children: _jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: "Memory Usage Trend" }) })] }), _jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900 mb-4", children: "Ask the Oracle" }), _jsx(AskOracle, { userId: currentUser.id })] })] }));
}
