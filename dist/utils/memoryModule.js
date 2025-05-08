import { supabase } from '@/lib/supabaseClient';
const memoryModule = {
    async store(entry) {
        const { error } = await supabase.from('memories').insert([
            {
                ...entry,
                user_id: entry.userId ?? null,
                created_at: new Date().toISOString(),
            },
        ]);
        if (error) {
            console.error('Failed to store memory:', error);
        }
    },
    async getRecentMemories(userId, limit = 5) {
        const { data, error } = await supabase
            .from('memories')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);
        if (error) {
            console.error('Failed to fetch memories:', error);
            return [];
        }
        return data;
    },
    async getMemoriesBySymbol(userId, symbol) {
        const { data, error } = await supabase
            .from('memories')
            .select('*')
            .eq('user_id', userId)
            .eq('symbol', symbol)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('Failed to fetch symbol memories:', error);
            return [];
        }
        return data;
    },
};
export default memoryModule;
