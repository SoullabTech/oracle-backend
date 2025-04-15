import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';
import type { ElementalProfile } from '../types/survey';

export async function getUserProfile(userId: string): Promise<ElementalProfile | null> {
  const { data, error } = await supabase
    .from('elemental_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

export async function updateUserProfile(
  userId: string,
  profileData: Partial<ElementalProfile>
): Promise<ElementalProfile | null> {
  const { data, error } = await supabase
    .from('elemental_profiles')
    .upsert({
      user_id: userId,
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Error updating user profile:', error);
    return null;
  }

  return data;
}

export async function getProfileStats(userId: string) {
  const { data, error } = await supabase
    .from('elemental_profiles')
    .select('fire, water, earth, air, aether')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile stats:', error);
    return null;
  }

  return data;
}