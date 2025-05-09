import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/ProfileUpdateForm.tsx
import { useState, useEffect } from "react";
import axios from "axios"; // Use axios or fetch for API calls
import { useAuth } from "../hooks/useAuth"; // Assuming you have an authentication hook
const ProfileUpdateForm = () => {
    const { user } = useAuth(); // Assume you have an auth context
    const [profileData, setProfileData] = useState({
        fire: 0,
        water: 0,
        earth: 0,
        air: 0,
        aether: 0,
        crystal_focus: {
            type: "career",
            challenges: "",
            aspirations: "",
        },
    });
    useEffect(() => {
        if (user) {
            // Fetch the current profile data for the logged-in user
            axios
                .get(`/api/user-profile/${user.id}`)
                .then((response) => {
                setProfileData(response.data); // Assuming the data format matches ProfileFormData
            })
                .catch((error) => {
                console.error("Failed to fetch profile data:", error);
            });
        }
    }, [user]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send the updated profile data to the backend for saving
            const response = await axios.post("/api/update-profile", profileData);
            console.log("Profile updated successfully:", response.data);
        }
        catch (error) {
            console.error("Error updating profile:", error);
        }
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto p-6", children: [_jsx("h2", { className: "text-2xl font-semibold text-center mb-6", children: "Update Your Profile" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "fire", className: "block text-sm font-medium text-gray-700", children: "Fire" }), _jsx("input", { type: "number", id: "fire", name: "fire", value: profileData.fire, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", min: 0, max: 100 })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "water", className: "block text-sm font-medium text-gray-700", children: "Water" }), _jsx("input", { type: "number", id: "water", name: "water", value: profileData.water, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", min: 0, max: 100 })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "earth", className: "block text-sm font-medium text-gray-700", children: "Earth" }), _jsx("input", { type: "number", id: "earth", name: "earth", value: profileData.earth, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", min: 0, max: 100 })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "air", className: "block text-sm font-medium text-gray-700", children: "Air" }), _jsx("input", { type: "number", id: "air", name: "air", value: profileData.air, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", min: 0, max: 100 })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "aether", className: "block text-sm font-medium text-gray-700", children: "Aether" }), _jsx("input", { type: "number", id: "aether", name: "aether", value: profileData.aether, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", min: 0, max: 100 })] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "challenges", className: "block text-sm font-medium text-gray-700", children: "Challenges" }), _jsx("textarea", { id: "challenges", name: "challenges", value: profileData.crystal_focus.challenges, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", rows: 3 }), _jsx("label", { htmlFor: "aspirations", className: "block text-sm font-medium text-gray-700 mt-4", children: "Aspirations" }), _jsx("textarea", { id: "aspirations", name: "aspirations", value: profileData.crystal_focus.aspirations, onChange: handleInputChange, className: "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500", rows: 3 })] }), _jsx("div", { className: "flex justify-end mt-8", children: _jsx("button", { type: "submit", className: "px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600", children: "Update Profile" }) })] })] }));
};
export default ProfileUpdateForm;
