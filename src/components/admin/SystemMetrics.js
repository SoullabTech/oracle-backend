import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getSystemMetrics } from "../../services/adminService";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);
export function SystemMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ["systemMetrics"],
    queryFn: getSystemMetrics,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  if (isLoading) {
    return _jsx("div", {
      className: "animate-pulse space-y-4",
      children: _jsx("div", { className: "h-64 bg-gray-200 rounded" }),
    });
  }
  if (!metrics) {
    return _jsx("div", {
      className: "text-center py-8",
      children: _jsx("p", {
        className: "text-gray-600",
        children: "No metrics available",
      }),
    });
  }
  const chartData = {
    labels: metrics.timestamps,
    datasets: [
      {
        label: "Active Users",
        data: metrics.activeUsers,
        borderColor: "rgb(99, 102, 241)",
        backgroundColor: "rgba(99, 102, 241, 0.5)",
      },
      {
        label: "Response Time (ms)",
        data: metrics.responseTimes,
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
        text: "System Performance",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  return _jsxs("div", {
    className: "bg-white rounded-lg shadow-lg p-6",
    children: [
      _jsxs("div", {
        className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
        children: [
          _jsxs("div", {
            className: "bg-indigo-50 p-4 rounded-lg",
            children: [
              _jsx("h3", {
                className: "text-lg font-semibold text-indigo-900",
                children: "Active Users",
              }),
              _jsx("p", {
                className: "text-3xl font-bold text-indigo-600",
                children: metrics.currentActiveUsers,
              }),
            ],
          }),
          _jsxs("div", {
            className: "bg-green-50 p-4 rounded-lg",
            children: [
              _jsx("h3", {
                className: "text-lg font-semibold text-green-900",
                children: "Avg Response Time",
              }),
              _jsxs("p", {
                className: "text-3xl font-bold text-green-600",
                children: [metrics.avgResponseTime, "ms"],
              }),
            ],
          }),
          _jsxs("div", {
            className: "bg-blue-50 p-4 rounded-lg",
            children: [
              _jsx("h3", {
                className: "text-lg font-semibold text-blue-900",
                children: "Memory Usage",
              }),
              _jsxs("p", {
                className: "text-3xl font-bold text-blue-600",
                children: [metrics.memoryUsage, "%"],
              }),
            ],
          }),
        ],
      }),
      _jsx("div", {
        className: "h-80",
        children: _jsx(Line, { data: chartData, options: chartOptions }),
      }),
    ],
  });
}
