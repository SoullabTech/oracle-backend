// File: src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // ← make sure this matches your alias
export function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        // Load existing session
        supabase.auth.getSession()
            .then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        })
            .catch((err) => {
            console.error("Session fetch error:", err);
            setError("Failed to retrieve session");
        })
            .finally(() => {
            setLoading(false);
        });
        // Listen for changes (login / logout)
        const { subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);
    const signIn = async (email, password) => {
        setError(null);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            console.error("Sign-in error:", error);
            setError(error.message);
            throw error;
        }
    };
    const signUp = async (email, password) => {
        setError(null);
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
            console.error("Sign-up error:", error);
            setError(error.message);
            throw error;
        }
    };
    const signOut = async () => {
        setError(null);
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Sign-out error:", error);
            setError(error.message);
            throw error;
        }
    };
    return { user, loading, error, signIn, signUp, signOut };
}
