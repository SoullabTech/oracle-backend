import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { getOracleResponse } from "../../services/oracleService";
import { logOracleInsight } from "../../services/oracleLogger";
const elements = ["fire", "water", "earth", "air", "aether"];
export function AskOracle({ userId }) {
  const [userInput, setUserInput] = useState("");
  const [oracleResponse, setOracleResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  // New state
  const [elementFocus, setElementFocus] = useState("aether");
  const [emotion, setEmotion] = useState(0.5);
  const handleAskOracle = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    try {
      const context = {
        elementalFocus: elementFocus,
        emotionTone: emotion,
      };
      const response = await getOracleResponse(userInput, { userId, context });
      setOracleResponse(response);
      setHistory((prev) => [...prev, { query: userInput, response }]);
      setUserInput("");
      await logOracleInsight({
        anon_id: userId,
        insight: {
          query: userInput,
          response: response.content,
        },
        element:
          response.metadata?.elementalAdjustments?.emphasis?.[0] ||
          elementFocus,
        emotion: emotion,
        archetype: response.metadata?.archetype || "",
        phase: response.metadata?.phase || "",
      });
    } catch (err) {
      setOracleResponse({ content: "⚠️ Failed to fetch oracle response." });
    } finally {
      setLoading(false);
    }
  };
  return _jsxs("div", {
    className: "bg-white rounded-lg shadow p-6 space-y-6",
    children: [
      _jsx("h2", {
        className: "text-lg font-semibold text-indigo-600",
        children: "Ask the Oracle",
      }),
      _jsxs("div", {
        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
        children: [
          _jsxs("div", {
            children: [
              _jsx("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: "Elemental Focus",
              }),
              _jsx("select", {
                value: elementFocus,
                onChange: (e) => setElementFocus(e.target.value),
                className:
                  "w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
                children: elements.map((el) =>
                  _jsx(
                    "option",
                    {
                      value: el,
                      children: el.charAt(0).toUpperCase() + el.slice(1),
                    },
                    el,
                  ),
                ),
              }),
            ],
          }),
          _jsxs("div", {
            children: [
              _jsxs("label", {
                className: "block text-sm font-medium text-gray-700 mb-1",
                children: ["Emotional Tone (", emotion, ")"],
              }),
              _jsx("input", {
                type: "range",
                min: "0",
                max: "1",
                step: "0.01",
                value: emotion,
                onChange: (e) => setEmotion(parseFloat(e.target.value)),
                className: "w-full",
              }),
              _jsx("p", {
                className: "text-xs text-gray-500 mt-1",
                children: "0 = calm \u00B7 1 = intense",
              }),
            ],
          }),
        ],
      }),
      _jsxs("div", {
        className: "flex gap-2",
        children: [
          _jsx("input", {
            type: "text",
            value: userInput,
            onChange: (e) => setUserInput(e.target.value),
            placeholder: "Type your question...",
            className:
              "flex-1 border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500",
          }),
          _jsx("button", {
            onClick: handleAskOracle,
            disabled: loading,
            className:
              "bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50",
            children: loading ? "Asking..." : "Ask",
          }),
        ],
      }),
      oracleResponse &&
        _jsxs("div", {
          className: "bg-gray-50 border-l-4 border-indigo-500 p-4 rounded",
          children: [
            _jsx("p", {
              className: "text-gray-800 whitespace-pre-line",
              children: oracleResponse.content,
            }),
            oracleResponse.metadata?.elementalAdjustments?.emphasis &&
              _jsx("div", {
                className: "mt-2 flex flex-wrap gap-2 text-sm",
                children:
                  oracleResponse.metadata.elementalAdjustments.emphasis.map(
                    (tag) =>
                      _jsx(
                        "span",
                        {
                          className:
                            "bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full",
                          children: tag,
                        },
                        tag,
                      ),
                  ),
              }),
          ],
        }),
      history.length > 0 &&
        _jsxs("div", {
          className: "mt-6 border-t pt-4",
          children: [
            _jsx("h3", {
              className: "text-sm text-gray-500 mb-2",
              children: "Previous Questions",
            }),
            _jsx("ul", {
              className: "space-y-3 text-sm text-gray-700",
              children: history
                .slice(-5)
                .reverse()
                .map((entry, index) =>
                  _jsxs(
                    "li",
                    {
                      className: "border-l-2 border-gray-200 pl-3",
                      children: [
                        _jsxs("p", {
                          children: [
                            _jsx("strong", {
                              className: "text-indigo-600",
                              children: "Q:",
                            }),
                            " ",
                            entry.query,
                          ],
                        }),
                        _jsxs("p", {
                          children: [
                            _jsx("strong", {
                              className: "text-green-700",
                              children: "A:",
                            }),
                            " ",
                            entry.response?.content,
                          ],
                        }),
                      ],
                    },
                    index,
                  ),
                ),
            }),
          ],
        }),
    ],
  });
}
