import { createContext, useContext, useState, useEffect } from 'react';
const UserProfileContext = createContext(null);
export const UserProfileProvider = ({ children }) => {
    // Replace with Supabase or backend call
    const [profile, setProfile] = useState({
        currentPhase: 'Fire1',
        elementalAffinity: 'Fire',
        personaType: 'leader',
    });
    useEffect(() => {
        // TODO: fetch real user data from Supabase
        // setProfile(...)
    }, []);
    return value = { profile } >
        { children }
        < /UserProfileContext.Provider>;
};
;
;
export const useUserProfile = () => {
    const context = useContext(UserProfileContext);
    if (!context) {
        throw new Error('useUserProfile must be used within a UserProfileProvider');
    }
    return context;
};
