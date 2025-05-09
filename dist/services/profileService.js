// ✅ File: src/services/profileService.ts
import { supabase } from '../lib/supabase';
// 🔹 Fetch full user profile
export async function getUserProfile(userId) {
    const { data, error } = await supabase
        .from('elemental_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error) {
        console.error('[getUserProfile Error]', error);
        return null;
    }
    return data;
}
// 🔹 Update or insert profile data
export async function updateUserProfile(userId, profile) {
    const { data, error } = await supabase
        .from('elemental_profiles')
        .upsert({ user_id: userId, ...profile })
        .select()
        .single();
    if (error) {
        console.error('[updateUserProfile Error]', error);
        return null;
    }
    return data;
}
// 🔹 Get elemental scores only
export async function getProfileStats(userId) {
    const { data, error } = await supabase
        .from('elemental_profiles')
        .select('fire, water, earth, air, aether')
        .eq('user_id', userId)
        .single();
    if (error) {
        console.error('[getProfileStats Error]', error);
        return null;
    }
    return data;
}
