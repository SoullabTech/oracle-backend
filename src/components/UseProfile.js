import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/UserProfile.tsx
import { useEffect, useState } from 'react';
import { fetchUserProfile } from '../services/profileService';
const UserProfile = ({ userId }) => {
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        const getProfile = async () => {
            try {
                const data = await fetchUserProfile(userId);
                setProfile(data);
            }
            catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        getProfile();
    }, [userId]);
    return (_jsx("div", { children: profile ? (_jsxs("div", { children: [_jsx("h1", { children: profile.name }), _jsx("p", { children: profile.email })] })) : (_jsx("p", { children: "Loading..." })) }));
};
export default UserProfile;
