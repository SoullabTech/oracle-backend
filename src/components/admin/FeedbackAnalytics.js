import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, } from 'chart.js';
import { getFeedbackStats } from '../../services/feedbackService';
import { getMetricTrends } from '../../services/oracleMetricsService';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
export function FeedbackAnalytics() {
    const timeframe = {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        end: new Date(),
    };
    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['feedbackStats'],
        queryFn: () => getFeedbackStats('all'),
    });
    const { data: trends, isLoading: trendsLoading } = useQuery({
        queryKey: ['feedbackTrends', timeframe],
        queryFn: () => getMetricTrends('user_satisfaction', timeframe),
    });
    if (statsLoading || trendsLoading) {
        return (_jsx("div", { className: "animate-pulse space-y-4", children: _jsx("div", { className: "h-64 bg-gray-200 rounded" }) }));
    }
    const chartData = {
        labels: trends?.map(t => new Date(t.timestamp).toLocaleDateString()) || [],
        datasets: [
            {
                label: 'User Satisfaction',
                data: trends?.map(t => t.value * 100) || [],
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
                text: 'User Satisfaction Trend',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
            },
        },
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Feedback Analytics" }), _jsxs("div", { className: "grid grid-cols-2 gap-4 mb-8", children: [_jsxs("div", { className: "bg-indigo-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold text-indigo-900", children: "Total Feedback" }), _jsx("p", { className: "text-3xl font-bold text-indigo-600", children: stats?.totalFeedback || 0 })] }), _jsxs("div", { className: "bg-green-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold text-green-900", children: "Satisfaction Rate" }), _jsxs("p", { className: "text-3xl font-bold text-green-600", children: [Math.round((stats?.positiveFeedback || 0) / (stats?.totalFeedback || 1) * 100), "%"] })] })] }), _jsx("div", { className: "h-64", children: _jsx(Line, { data: chartData, options: chartOptions }) }), stats?.elementalDistribution && (_jsxs("div", { className: "mt-8", children: [_jsx("h3", { className: "text-xl font-semibold mb-4", children: "Elemental Distribution" }), _jsx("div", { className: "grid grid-cols-5 gap-4", children: Object.entries(stats.elementalDistribution).map(([element, count]) => (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg text-center", children: [_jsx("h4", { className: "font-medium capitalize", children: element }), _jsx("p", { className: "text-2xl font-bold text-gray-700", children: count })] }, element))) })] }))] }));
}
