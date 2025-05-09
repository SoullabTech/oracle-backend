import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from "chart.js";
import { getTopPatterns } from "../../services/oraclePatternService";
import { getAggregatedWisdom } from "../../services/memoryService";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export function OracleInsights() {
    const { data: patterns, isLoading: patternsLoading } = useQuery({
        queryKey: ["topPatterns"],
        queryFn: () => getTopPatterns(5),
    });
    const { data: wisdom, isLoading: wisdomLoading } = useQuery({
        queryKey: ["aggregatedWisdom"],
        queryFn: () => getAggregatedWisdom(["fire", "water", "earth", "air", "aether"], ["all"], 0.8),
    });
    if (patternsLoading || wisdomLoading) {
        return (_jsx("div", { className: "animate-pulse space-y-4", children: _jsx("div", { className: "h-64 bg-gray-200 rounded" }) }));
    }
    const chartData = {
        labels: patterns?.map((p) => p.patternType) || [],
        datasets: [
            {
                label: "Pattern Frequency",
                data: patterns?.map((p) => p.frequency) || [],
                borderColor: "rgb(99, 102, 241)",
                backgroundColor: "rgba(99, 102, 241, 0.5)",
            },
            {
                label: "Confidence",
                data: patterns?.map((p) => p.confidence * 100) || [],
                borderColor: "rgb(52, 211, 153)",
                backgroundColor: "rgba(52, 211, 153, 0.5)",
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Top Patterns Analysis",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("h1", { className: "text-2xl font-semibold text-gray-900", children: "Oracle Insights" }), _jsx("div", { className: "bg-white shadow rounded-lg p-6", children: _jsx("div", { className: "h-80", children: _jsx(Line, { data: chartData, options: chartOptions }) }) }), _jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Recent Wisdom" }), _jsx("div", { className: "space-y-4", children: wisdom?.slice(0, 5).map((item) => (_jsxs("div", { className: "border-l-4 border-indigo-500 pl-4 py-2", children: [_jsx("p", { className: "text-gray-700", children: item.content }), _jsxs("div", { className: "mt-2 flex gap-2", children: [item.elements.map((element) => (_jsx("span", { className: "px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm", children: element }, element))), item.facets.map((facet) => (_jsx("span", { className: "px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm", children: facet }, facet)))] }), _jsxs("div", { className: "mt-1 text-sm text-gray-500", children: ["Confidence: ", Math.round(item.confidence * 100), "%"] })] }, item.id))) })] }), _jsxs("div", { className: "bg-white shadow rounded-lg p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Pattern Details" }), _jsx("div", { className: "space-y-4", children: patterns?.map((pattern) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-4", children: [_jsx("h3", { className: "font-medium text-gray-900", children: pattern.patternType }), _jsx("p", { className: "mt-1 text-gray-600", children: pattern.patternData.description }), _jsxs("div", { className: "mt-2 flex justify-between items-center", children: [_jsxs("div", { className: "flex gap-2", children: [_jsxs("span", { className: "text-sm text-gray-500", children: ["Frequency: ", pattern.frequency] }), _jsxs("span", { className: "text-sm text-gray-500", children: ["Confidence: ", Math.round(pattern.confidence * 100), "%"] })] }), pattern.metadata?.lastMatched && (_jsxs("span", { className: "text-sm text-gray-500", children: ["Last matched:", " ", new Date(pattern.metadata.lastMatched).toLocaleDateString()] }))] })] }, pattern.id))) })] })] }));
}
