import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "../services/profileService";
import { computePersonalityAdjustment } from "../utils/personalityMapping";
import { useAuth } from "../hooks/useAuth";
export function ElementalProfileDisplay() {
    const { user } = useAuth();
    const { data: profile, isLoading } = useQuery({
        queryKey: ["userProfile", user?.id],
        queryFn: () => getUserProfile(user?.id || ""),
        enabled: !!user,
    });
    if (isLoading) {
        return (_jsxs("div", { className: "animate-pulse space-y-4", children: [_jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" }), _jsx("div", { className: "space-y-3", children: [...Array(5)].map((_, i) => (_jsx("div", { className: "h-2 bg-gray-200 rounded" }, i))) })] }));
    }
    if (!profile) {
        return (_jsx("div", { className: "text-center py-4", children: _jsx("p", { className: "text-gray-600", children: "No profile data available. Complete the survey to see your elemental balance." }) }));
    }
    const personalityAdjustment = computePersonalityAdjustment(profile);
    const crystalFocus = profile.crystal_focus;
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-md p-6", children: [_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-2", children: "Your Elemental Profile" }), crystalFocus && (_jsxs("div", { className: "mb-4", children: [_jsxs("h3", { className: "text-lg font-semibold mb-2", children: ["Crystal Focus: ", crystalFocus.type] }), crystalFocus.type === "other" &&
                                crystalFocus.customDescription && (_jsx("p", { className: "text-gray-600 mb-2", children: crystalFocus.customDescription }))] }))] }), _jsx("div", { className: "space-y-4", children: Object.entries(profile)
                    .filter(([key]) => ["fire", "water", "earth", "air", "aether"].includes(key))
                    .map(([element, score]) => (_jsxs("div", { className: "relative pt-1", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("div", { children: _jsx("span", { className: "text-xs font-semibold inline-block uppercase", children: element }) }), _jsx("div", { className: "text-right", children: _jsxs("span", { className: "text-xs font-semibold inline-block", children: [score, "%"] }) })] }), _jsx("div", { className: "overflow-hidden h-2 text-xs flex rounded bg-gray-200", children: _jsx("div", { style: { width: `${score}%` }, className: `shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${{
                                    fire: "from-red-500 to-red-600",
                                    water: "from-blue-500 to-blue-600",
                                    earth: "from-green-500 to-green-600",
                                    air: "from-yellow-500 to-yellow-600",
                                    aether: "from-purple-500 to-purple-600",
                                }[element]}` }) })] }, element))) }), crystalFocus && (_jsxs("div", { className: "mt-6 space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-2", children: "Current Challenges" }), _jsx("p", { className: "text-gray-600", children: crystalFocus.challenges })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-2", children: "Aspirations" }), _jsx("p", { className: "text-gray-600", children: crystalFocus.aspirations })] })] })), _jsxs("div", { className: "mt-6 border-t pt-4", children: [_jsx("h4", { className: "font-semibold mb-2", children: "Personality Adjustment" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-gray-600", children: [_jsx("span", { className: "font-medium", children: "Tone:" }), " ", personalityAdjustment.tone] }), _jsxs("p", { className: "text-gray-600", children: [_jsx("span", { className: "font-medium", children: "Style:" }), " ", personalityAdjustment.style] }), _jsxs("p", { className: "text-gray-600", children: [_jsx("span", { className: "font-medium", children: "Emphasis:" }), " ", personalityAdjustment.emphasis.join(", ")] })] })] })] }));
}
