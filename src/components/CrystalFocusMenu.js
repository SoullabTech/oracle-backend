import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { CRYSTAL_FOCUS_OPTIONS } from '../types/survey';
export function CrystalFocusMenu({ onComplete }) {
    const [selectedType, setSelectedType] = useState(null);
    const [customDescription, setCustomDescription] = useState('');
    const [challenges, setChallenges] = useState('');
    const [aspirations, setAspirations] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedType)
            return;
        const focus = {
            type: selectedType,
            challenges,
            aspirations,
        };
        if (selectedType === 'other') {
            focus.customDescription = customDescription;
        }
        onComplete(focus);
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-4", children: "Choose Your Crystal Focus" }), _jsx("p", { className: "text-gray-600", children: "Every aspect of life follows a unique spiral of growth. What is most important to you right now?" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: CRYSTAL_FOCUS_OPTIONS.map((option) => (_jsxs("button", { type: "button", onClick: () => setSelectedType(option.type), className: `p-4 rounded-lg border-2 text-left transition-all ${selectedType === option.type
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-200'}`, children: [_jsx("h3", { className: "font-semibold mb-2", children: option.title }), _jsx("p", { className: "text-sm text-gray-600", children: option.description }), option.elements.length > 0 && (_jsxs("div", { className: "mt-2 text-sm text-gray-500", children: ["Elements: ", option.elements.join(', ')] }))] }, option.type))) }), selectedType && (_jsxs("div", { className: "space-y-4 mt-8", children: [selectedType === 'other' && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Describe your focus area" }), _jsx("input", { type: "text", value: customDescription, onChange: (e) => setCustomDescription(e.target.value), className: "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", required: true })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "What challenges are you currently facing in this area?" }), _jsx("textarea", { value: challenges, onChange: (e) => setChallenges(e.target.value), className: "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", rows: 3, required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "What do you hope to achieve or experience?" }), _jsx("textarea", { value: aspirations, onChange: (e) => setAspirations(e.target.value), className: "w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", rows: 3, required: true })] }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { type: "submit", className: "px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors", children: "Continue to Survey" }) })] }))] })] }));
}
