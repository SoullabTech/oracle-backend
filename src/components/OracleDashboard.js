import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { getPersonalityWeights } from '../services/monitoringService';
import { getAggregatedWisdom } from '../services/memoryService';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export function OracleDashboard() {
    // 📊 Query: Personality Weights
    const { data: weights = [], isLoading: weightsLoading } = useQuery({
        queryKey: ['personalityWeights'],
        queryFn: getPersonalityWeights,
    });
    // 🔮 Query: Collective Wisdom
    const { data: wisdom = [], isLoading: wisdomLoading } = useQuery({
        queryKey: ['aggregatedWisdom'],
        queryFn: () => getAggregatedWisdom(['fire', 'water', 'earth', 'air', 'aether'], ['all']),
    });
    if (weightsLoading || wisdomLoading) {
        return (_jsx("div", { className: "flex justify-center items-center h-64", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500" }) }));
    }
    const chartData = {
        labels: ['Fire', 'Water', 'Earth', 'Air', 'Aether'],
        datasets: [
            {
                label: 'Element Weights (%)',
                data: ['fire', 'water', 'earth', 'air', 'aether'].map(e => (weights.find(w => w.element === e)?.weight || 0) * 100),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.3)',
                fill: true,
            },
            {
                label: 'Confidence (%)',
                data: ['fire', 'water', 'earth', 'air', 'aether'].map(e => (weights.find(w => w.element === e)?.confidence || 0) * 100),
                borderColor: 'rgb(52, 211, 153)',
                backgroundColor: 'rgba(52, 211, 153, 0.3)',
                fill: true,
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Elemental Balance Overview' },
        },
        scales: {
            y: { beginAtZero: true, max: 100 },
        },
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Oracle Insights" }), _jsx("div", { className: "h-80", children: _jsx(Line, { data: chartData, options: chartOptions }) })] }), _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Collective Wisdom" }), _jsx("div", { className: "space-y-4", children: wisdom.map(item => (_jsxs("div", { className: "border-l-4 border-indigo-500 pl-4 py-2", children: [_jsx("p", { className: "text-gray-700", children: item.content }), _jsxs("div", { className: "mt-2 flex flex-wrap gap-2", children: [item.elements.map(element => (_jsx("span", { className: "px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm", children: element }, element))), item.facets.map(facet => (_jsx("span", { className: "px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm", children: facet }, facet)))] }), _jsxs("div", { className: "mt-1 text-sm text-gray-500", children: ["Confidence: ", Math.round(item.confidence * 100), "%"] })] }, item.id))) })] })] }));
}
