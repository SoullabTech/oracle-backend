// src/services/profileService.ts
import { supabase } from '../lib/supabaseClient.js';
import { elementalProfileSchema } from '../lib/schemas/elemental.js';

export interface Profile {
  user_id: string;
  fire: number;
  water: number;
  earth: number;
  air: number;
  aether: number;
  crystal_focus: {
    type: string;
    challenges: string;
    aspirations: string;
  };
  updated_at: string;
}

export interface ProfileStats {
  fire: number;
  water: number;
  earth: number;
  air: number;
  aether: number;
}

/**
 * Fetches a user's full profile.
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  const parsed = elementalProfileSchema.parse(data);
  return parsed;
}

/**
 * Inserts or updates a user's profile.
 */
export async function updateUserProfile(
  userId: string,
  profile: Profile
): Promise<Profile | null> {
  const toUpsert = { ...profile, user_id: userId };
  const { data, error } = await supabase
    .from('profiles')
    .upsert(toUpsert)
    .select('*')
    .single();

  if (error || !data) return null;
  const parsed = elementalProfileSchema.parse(data);
  return parsed;
}

/**
 * Retrieves only the elemental score fields for a user.
 */
export async function getProfileStats(userId: string): Promise<ProfileStats | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('fire, water, earth, air, aether')
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;
  return {
    fire: data.fire,
    water: data.water,
    earth: data.earth,
    air: data.air,
    aether: data.aether,
  };
}
