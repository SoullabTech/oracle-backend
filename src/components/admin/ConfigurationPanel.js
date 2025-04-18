import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateSystemConfig } from '../../services/adminService';
export function ConfigurationPanel() {
    const queryClient = useQueryClient();
    const [config, setConfig] = useState({
        elementalWeights: {
            fire: 0.5,
            water: 0.5,
            earth: 0.5,
            air: 0.5,
            aether: 0.5,
        },
        confidenceThresholds: {
            memory: 0.7,
            pattern: 0.8,
            wisdom: 0.9,
        },
        systemParameters: {
            maxTokens: 2000,
            temperature: 0.7,
            responseTimeout: 30000,
        },
    });
    const updateMutation = useMutation({
        mutationFn: updateSystemConfig,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systemConfig'] });
        },
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        updateMutation.mutate(config);
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow-lg p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-6", children: "System Configuration" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Elemental Weights" }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4", children: Object.entries(config.elementalWeights).map(([element, weight]) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1 capitalize", children: element }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.1", value: weight, onChange: (e) => setConfig(prev => ({
                                                ...prev,
                                                elementalWeights: {
                                                    ...prev.elementalWeights,
                                                    [element]: parseFloat(e.target.value),
                                                },
                                            })), className: "w-full" }), _jsxs("div", { className: "text-center text-sm text-gray-600", children: [(weight * 100).toFixed(0), "%"] })] }, element))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Confidence Thresholds" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: Object.entries(config.confidenceThresholds).map(([key, value]) => (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1 capitalize", children: key }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.1", value: value, onChange: (e) => setConfig(prev => ({
                                                ...prev,
                                                confidenceThresholds: {
                                                    ...prev.confidenceThresholds,
                                                    [key]: parseFloat(e.target.value),
                                                },
                                            })), className: "w-full" }), _jsxs("div", { className: "text-center text-sm text-gray-600", children: [(value * 100).toFixed(0), "%"] })] }, key))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "System Parameters" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Max Tokens" }), _jsx("input", { type: "number", value: config.systemParameters.maxTokens, onChange: (e) => setConfig(prev => ({
                                                    ...prev,
                                                    systemParameters: {
                                                        ...prev.systemParameters,
                                                        maxTokens: parseInt(e.target.value),
                                                    },
                                                })), className: "w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Temperature" }), _jsx("input", { type: "number", min: "0", max: "1", step: "0.1", value: config.systemParameters.temperature, onChange: (e) => setConfig(prev => ({
                                                    ...prev,
                                                    systemParameters: {
                                                        ...prev.systemParameters,
                                                        temperature: parseFloat(e.target.value),
                                                    },
                                                })), className: "w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Response Timeout (ms)" }), _jsx("input", { type: "number", step: "1000", value: config.systemParameters.responseTimeout, onChange: (e) => setConfig(prev => ({
                                                    ...prev,
                                                    systemParameters: {
                                                        ...prev.systemParameters,
                                                        responseTimeout: parseInt(e.target.value),
                                                    },
                                                })), className: "w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", disabled: updateMutation.isPending, className: "px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors", children: updateMutation.isPending ? 'Saving...' : 'Save Configuration' }) })] })] }));
}
