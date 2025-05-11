import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { getFeedbackStats } from '../services/feedbackService';
import { useAuth } from '../hooks/useAuth';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export function FeedbackStats() {
    const { user } = useAuth();
    const { data: stats, isLoading } = useQuery({
        queryKey: ['feedbackStats', user?.id],
        queryFn: () => getFeedbackStats(user?.id || ''),
        enabled: !!user,
    });
    if (isLoading) {
        return (_jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" }), _jsx("div", { className: "space-y-2", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "h-2 bg-gray-200 rounded" }, i))) })] }));
    }
    if (!stats) {
        return (_jsx("div", { className: "text-center py-4", children: _jsx("p", { className: "text-gray-600", children: "No feedback data available yet." }) }));
    }
    const chartData = {
        labels: Object.keys(stats.elementalDistribution),
        datasets: [
            {
                label: 'Elemental Distribution',
                data: Object.values(stats.elementalDistribution),
                borderColor: 'rgb(99, 102, 241)',
                backgroundColor: 'rgba(99, 102, 241, 0.5)',
            },
        ],
    };
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Feedback Distribution by Element',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Feedback Overview" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-6", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Feedback" }), _jsx("p", { className: "text-2xl font-bold", children: stats.totalFeedback })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Average Rating" }), _jsx("p", { className: "text-2xl font-bold", children: stats.averageRating.toFixed(1) })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Positive Feedback" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: stats.positiveFeedback })] }), _jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-sm text-gray-600", children: "Needs Improvement" }), _jsx("p", { className: "text-2xl font-bold text-red-600", children: stats.negativeFeedback })] })] }), _jsx("div", { className: "h-64", children: _jsx(Line, { data: chartData, options: chartOptions }) })] }));
}
