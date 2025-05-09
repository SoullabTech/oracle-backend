import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserProfile } from "../services/profileService";
import { useAuth } from "../hooks/useAuth";
export function PreferenceAdjustment() {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const currentProfile = queryClient.getQueryData([
        "profileStats",
        user?.id,
    ]);
    const [adjustments, setAdjustments] = useState({
        fire: currentProfile?.fire || 50,
        water: currentProfile?.water || 50,
        earth: currentProfile?.earth || 50,
        air: currentProfile?.air || 50,
        aether: currentProfile?.aether || 50,
    });
    const updateMutation = useMutation({
        mutationFn: (newProfile) => updateUserProfile(user?.id || "", newProfile),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["profileStats"] });
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(adjustments);
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "Adjust Your Preferences" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [Object.entries(adjustments).map(([element, value]) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2 capitalize", children: element }), _jsx("input", { type: "range", min: "0", max: "100", value: value, onChange: (e) => setAdjustments((prev) => ({
                                    ...prev,
                                    [element]: parseInt(e.target.value),
                                })), className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" }), _jsxs("div", { className: "flex justify-between text-xs text-gray-500", children: [_jsx("span", { children: "0" }), _jsx("span", { children: value }), _jsx("span", { children: "100" })] })] }, element))), _jsx("button", { type: "submit", disabled: updateMutation.isPending, className: "w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors", children: updateMutation.isPending ? "Updating..." : "Save Preferences" })] })] }));
}
