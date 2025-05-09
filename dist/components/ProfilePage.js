import { jsx as _jsx } from "react/jsx-runtime";
// src/components/ProfilePage.tsx
import { useEffect, useState } from "react";
import { getUserProfile, getProfileStats, } from "../services/profileService";
const ProfilePage = () => {
    const [profile, setProfile] = useState(null);
    const [profileStats, setProfileStats] = useState(null);
    useEffect(() => {
        const fetchProfileData = async () => {
            const userProfile = await getUserProfile("user-id");
            const stats = await getProfileStats("user-id");
            setProfile(userProfile);
            setProfileStats(stats);
        };
        fetchProfileData();
    }, []);
    return _jsx("div", {});
};
export default ProfilePage;
