import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitFeedback } from "../services/feedbackService";
import { useAuth } from "../hooks/useAuth";
export function FeedbackForm({ responseId, response, metadata, onComplete }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const feedbackMutation = useMutation({
    mutationFn: (feedback) => submitFeedback(user?.id || "", feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbackStats"] });
      setIsSubmitted(true);
      onComplete?.();
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating || !user) return;
    feedbackMutation.mutate({
      responseId,
      response,
      rating,
      comment: comment.trim() || undefined,
      metadata,
    });
  };
  if (isSubmitted) {
    return _jsx("div", {
      className: "text-center text-green-600 py-2",
      children: "Thank you for your feedback!",
    });
  }
  return _jsxs("form", {
    onSubmit: handleSubmit,
    className: "space-y-4 mt-4",
    children: [
      _jsxs("div", {
        children: [
          _jsx("p", {
            className: "text-sm text-gray-600 mb-2",
            children: "How helpful was this response?",
          }),
          _jsx("div", {
            className: "flex gap-2",
            children: [1, 2, 3, 4, 5].map((value) =>
              _jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setRating(value),
                  className: `w-10 h-10 rounded-full transition-colors ${
                    rating === value
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`,
                  children: value,
                },
                value,
              ),
            ),
          }),
        ],
      }),
      _jsx("div", {
        children: _jsx("textarea", {
          value: comment,
          onChange: (e) => setComment(e.target.value),
          placeholder: "Additional comments (optional)",
          className:
            "w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500",
          rows: 3,
        }),
      }),
      _jsx("button", {
        type: "submit",
        disabled: !rating || feedbackMutation.isPending,
        className:
          "px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors",
        children: feedbackMutation.isPending
          ? "Submitting..."
          : "Submit Feedback",
      }),
      feedbackMutation.isError &&
        _jsx("div", {
          className: "text-red-600 text-sm",
          children: "Failed to submit feedback. Please try again.",
        }),
    ],
  });
}
