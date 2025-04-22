import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { getElementalProfile } from "../services/surveyService";
import { CRYSTAL_FOCUS_OPTIONS } from "../types/survey";
function ElementalScore({ element, score }) {
  const getElementColor = (element) => {
    switch (element) {
      case "fire":
        return "from-red-500 to-red-600";
      case "water":
        return "from-blue-500 to-blue-600";
      case "earth":
        return "from-green-500 to-green-600";
      case "air":
        return "from-yellow-500 to-yellow-600";
      case "aether":
        return "from-purple-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };
  return _jsxs("div", {
    className: "relative pt-1",
    children: [
      _jsxs("div", {
        className: "flex items-center justify-between mb-2",
        children: [
          _jsx("div", {
            children: _jsx("span", {
              className: "text-xs font-semibold inline-block uppercase",
              children: element,
            }),
          }),
          _jsx("div", {
            className: "text-right",
            children: _jsxs("span", {
              className: "text-xs font-semibold inline-block",
              children: [score, "%"],
            }),
          }),
        ],
      }),
      _jsx("div", {
        className: "overflow-hidden h-2 text-xs flex rounded bg-gray-200",
        children: _jsx("div", {
          style: { width: `${score}%` },
          className: `shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r ${getElementColor(element)}`,
        }),
      }),
    ],
  });
}
export function ElementalProfile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["elementalProfile"],
    queryFn: () => getElementalProfile(),
  });
  if (isLoading) {
    return _jsxs("div", {
      className: "animate-pulse space-y-4",
      children: [
        _jsx("div", { className: "h-4 bg-gray-200 rounded w-3/4" }),
        _jsx("div", {
          className: "space-y-3",
          children: [...Array(5)].map((_, i) =>
            _jsx("div", { className: "h-2 bg-gray-200 rounded" }, i),
          ),
        }),
      ],
    });
  }
  if (!profile) {
    return _jsx("div", {
      className: "text-center py-4",
      children: _jsx("p", {
        className: "text-gray-600",
        children:
          "No profile data available. Complete the survey to see your elemental balance.",
      }),
    });
  }
  const crystalFocus = profile.crystal_focus;
  const focusOption = CRYSTAL_FOCUS_OPTIONS.find(
    (opt) => opt.type === crystalFocus?.type,
  );
  return _jsxs("div", {
    className: "bg-white rounded-lg shadow-md p-6",
    children: [
      _jsxs("div", {
        className: "mb-6",
        children: [
          _jsx("h2", {
            className: "text-2xl font-bold mb-2",
            children: "Your Elemental Profile",
          }),
          focusOption &&
            _jsxs("div", {
              className: "mb-4",
              children: [
                _jsx("h3", {
                  className: "text-lg font-semibold mb-2",
                  children: focusOption.title,
                }),
                _jsx("p", {
                  className: "text-gray-600",
                  children:
                    crystalFocus?.customDescription || focusOption.description,
                }),
              ],
            }),
        ],
      }),
      _jsxs("div", {
        className: "space-y-4",
        children: [
          _jsx(ElementalScore, { element: "fire", score: profile.fire }),
          _jsx(ElementalScore, { element: "water", score: profile.water }),
          _jsx(ElementalScore, { element: "earth", score: profile.earth }),
          _jsx(ElementalScore, { element: "air", score: profile.air }),
          _jsx(ElementalScore, { element: "aether", score: profile.aether }),
        ],
      }),
      crystalFocus &&
        _jsxs("div", {
          className: "mt-6 space-y-4",
          children: [
            _jsxs("div", {
              children: [
                _jsx("h4", {
                  className: "font-semibold mb-2",
                  children: "Current Challenges",
                }),
                _jsx("p", {
                  className: "text-gray-600",
                  children: crystalFocus.challenges,
                }),
              ],
            }),
            _jsxs("div", {
              children: [
                _jsx("h4", {
                  className: "font-semibold mb-2",
                  children: "Aspirations",
                }),
                _jsx("p", {
                  className: "text-gray-600",
                  children: crystalFocus.aspirations,
                }),
              ],
            }),
          ],
        }),
    ],
  });
}
