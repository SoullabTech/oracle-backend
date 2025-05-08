import { supabase } from '../lib/supabase';
export async function isAdmin(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'No authorization header' });
        }
        const token = authHeader.replace(/^Bearer\s+/, '');
        const { data: { user }, error: getUserError } = await supabase.auth.getUser(token);
        if (getUserError || !user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        // Check the user's role in your `user_roles` / `role_types` tables
        const { data: userRole, error: roleErr } = await supabase
            .from('user_roles')
            .select('role_id')
            .eq('user_id', user.id)
            .single();
        if (roleErr || !userRole) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        const { data: roleType, error: typeErr } = await supabase
            .from('role_types')
            .select('name')
            .eq('id', userRole.role_id)
            .single();
        if (typeErr || !roleType || roleType.name !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }
        // Attach the full user object for downstream handlers
        req.user = user;
        next();
    }
    catch (err) {
        console.error('Auth middleware error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
