import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export function SurveyQuestion({ id, text, element, onAnswer, currentAnswer }) {
    const [hoveredRating, setHoveredRating] = useState(null);
    const getElementColor = (element) => {
        switch (element) {
            case 'fire':
                return 'bg-red-500';
            case 'water':
                return 'bg-blue-500';
            case 'earth':
                return 'bg-green-500';
            case 'air':
                return 'bg-yellow-500';
            case 'aether':
                return 'bg-purple-500';
            default:
                return 'bg-gray-500';
        }
    };
    return (_jsxs("div", { className: "mb-8 p-6 bg-white rounded-lg shadow-md", children: [_jsx("h3", { className: "text-lg font-medium mb-4", children: text }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsx("span", { className: "text-sm text-gray-500", children: "Strongly Disagree" }), _jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((rating) => (_jsx("button", { onClick: () => onAnswer(id, rating), onMouseEnter: () => setHoveredRating(rating), onMouseLeave: () => setHoveredRating(null), className: `w-12 h-12 rounded-full transition-all ${currentAnswer === rating
                                ? `${getElementColor(element)} text-white`
                                : hoveredRating && hoveredRating >= rating
                                    ? `${getElementColor(element)} bg-opacity-50 text-white`
                                    : 'bg-gray-100 hover:bg-gray-200'}`, children: rating }, rating))) }), _jsx("span", { className: "text-sm text-gray-500", children: "Strongly Agree" })] })] }));
}
