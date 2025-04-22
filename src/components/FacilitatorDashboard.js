import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/FacilitatorDashboard.tsx
import { useState } from "react";
const FacilitatorDashboard = () => {
  const [data, setData] = useState("Welcome to the Facilitator Dashboard!");
  return _jsxs("div", {
    className: "bg-white shadow-md rounded-lg p-4",
    children: [
      _jsx("h2", {
        className: "text-xl font-semibold",
        children: "Facilitator Dashboard",
      }),
      _jsx("p", { children: data }),
      _jsx("button", {
        className: "mt-4 px-4 py-2 bg-indigo-500 text-white rounded",
        onClick: () => setData("Data updated!"),
        children: "Update Data",
      }),
    ],
  });
};
export default FacilitatorDashboard;
