import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
export function ResponseFeedback({ responseId, onFeedback }) {
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === null)
            return; // Ensure rating is selected
        // Send feedback data
        onFeedback({
            rating,
            comment: comment.trim() || undefined, // Only include comment if it's not empty
        });
        setIsSubmitted(true); // Mark feedback as submitted
    };
    // Render submitted message after feedback is sent
    if (isSubmitted) {
        return (_jsx("div", { className: "text-center text-green-600 py-2", children: "Thank you for your feedback!" }));
    }
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4 mt-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600 mb-2", children: "How helpful was this response?" }), _jsx("div", { className: "flex gap-2", children: [1, 2, 3, 4, 5].map((value) => (_jsx("button", { type: "button", onClick: () => setRating(value), className: `w-10 h-10 rounded-full ${rating === value
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'}`, children: value }, value))) })] }), _jsx("div", { children: _jsx("textarea", { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Additional comments (optional)", className: "w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500", rows: 3 }) }), _jsx("button", { type: "submit", disabled: rating === null, className: "px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors", children: "Submit Feedback" })] }));
}
