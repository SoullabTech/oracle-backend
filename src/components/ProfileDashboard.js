import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";
import { getProfileStats } from "../services/profileService";
import { getPersonalityWeights } from "../services/monitoringService";
import { useAuth } from "../hooks/useAuth";
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
);
export function ProfileDashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profileStats", user?.id],
    queryFn: () => getProfileStats(user?.id || ""),
    enabled: !!user,
  });
  const { data: weights, isLoading: weightsLoading } = useQuery({
    queryKey: ["personalityWeights"],
    queryFn: getPersonalityWeights,
    enabled: !!user,
  });
  if (profileLoading || weightsLoading) {
    return _jsx("div", {
      className: "animate-pulse space-y-4",
      children: _jsx("div", { className: "h-64 bg-gray-200 rounded" }),
    });
  }
  if (!profile || !weights) {
    return _jsx("div", {
      className: "text-center py-8",
      children: _jsx("p", {
        className: "text-gray-600",
        children: "Complete the survey to see your elemental profile.",
      }),
    });
  }
  const chartData = {
    labels: ["Fire", "Water", "Earth", "Air", "Aether"],
    datasets: [
      {
        label: "Current Profile",
        data: [
          profile.fire,
          profile.water,
          profile.earth,
          profile.air,
          profile.aether,
        ],
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 2,
      },
      {
        label: "Personality Weights",
        data: weights.map((w) => w.weight * 100),
        backgroundColor: "rgba(52, 211, 153, 0.2)",
        borderColor: "rgba(52, 211, 153, 1)",
        borderWidth: 2,
      },
    ],
  };
  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || "";
            const value = context.raw || 0;
            return `${label}: ${value.toFixed(1)}%`;
          },
        },
      },
    },
  };
  return _jsxs("div", {
    className: "bg-white rounded-lg shadow-lg p-6",
    children: [
      _jsx("h2", {
        className: "text-2xl font-bold mb-6",
        children: "Your Elemental Profile",
      }),
      _jsx("div", {
        className: "aspect-square max-w-md mx-auto",
        children: _jsx(Radar, { data: chartData, options: chartOptions }),
      }),
      _jsx("div", {
        className: "mt-6 grid grid-cols-2 gap-4",
        children: weights.map((weight) =>
          _jsxs(
            "div",
            {
              className: "p-4 bg-gray-50 rounded-lg",
              children: [
                _jsx("h3", {
                  className: "font-semibold capitalize",
                  children: weight.element,
                }),
                _jsxs("div", {
                  className: "mt-2 space-y-1",
                  children: [
                    _jsxs("div", {
                      className: "flex justify-between text-sm",
                      children: [
                        _jsx("span", { children: "Weight:" }),
                        _jsxs("span", {
                          children: [(weight.weight * 100).toFixed(1), "%"],
                        }),
                      ],
                    }),
                    _jsxs("div", {
                      className: "flex justify-between text-sm",
                      children: [
                        _jsx("span", { children: "Confidence:" }),
                        _jsxs("span", {
                          children: [(weight.confidence * 100).toFixed(1), "%"],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            },
            weight.element,
          ),
        ),
      }),
    ],
  });
}
