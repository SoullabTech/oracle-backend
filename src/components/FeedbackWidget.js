import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitFeedback } from '../services/feedbackService';
import { useAuth } from '../hooks/useAuth';
export function FeedbackWidget({ responseId, response, element, facet, }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [rating, setRating] = useState(null);
    const [comment, setComment] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const feedbackMutation = useMutation({
        mutationFn: async () => {
            if (!rating || !user)
                return;
            await submitFeedback(user.id, {
                query: '',
                response,
                rating,
                comments: comment,
                metadata: {
                    responseId,
                    element,
                    facet,
                    timestamp: new Date().toISOString(),
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['personalityWeights'] });
            queryClient.invalidateQueries({ queryKey: ['aggregatedWisdom'] });
            setIsExpanded(false);
            setRating(null);
            setComment('');
        },
    });
    return (_jsxs("div", { className: "mt-4 border-t pt-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "flex gap-1", children: [1, 2, 3, 4, 5].map((value) => (_jsx("button", { onClick: () => {
                                setRating(value);
                                setIsExpanded(true);
                            }, className: `w-8 h-8 rounded-full transition-colors ${rating === value
                                ? 'bg-indigo-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`, children: value }, value))) }), _jsx("span", { className: "text-sm text-gray-500", children: "How helpful was this response?" })] }), isExpanded && (_jsxs("div", { className: "mt-4 space-y-4", children: [_jsx("textarea", { value: comment, onChange: (e) => setComment(e.target.value), placeholder: "Additional comments (optional)", className: "w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500", rows: 3 }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx("button", { onClick: () => setIsExpanded(false), className: "px-4 py-2 text-gray-700 hover:text-gray-900", children: "Cancel" }), _jsx("button", { onClick: () => feedbackMutation.mutate(), disabled: !rating || feedbackMutation.isPending, className: "px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors", children: feedbackMutation.isPending ? 'Submitting...' : 'Submit Feedback' })] })] })), feedbackMutation.isError && (_jsx("div", { className: "mt-2 text-red-600 text-sm", children: "Failed to submit feedback. Please try again." }))] }));
}
