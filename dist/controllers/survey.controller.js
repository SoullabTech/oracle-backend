import { supabase } from '../lib/supabase';
import { elementalProfileSchema } from '../lib/schemas/elemental';
import { crystalFocusSchema } from '../types/survey';
export async function handleSurveySubmission(req, res) {
    try {
        // Use authenticated user ID instead of trusting client payload
        const userId = req.user.id;
        const { responses, crystalFocus } = req.body;
        // 1️⃣ Validate crystalFocus
        const focusParsed = crystalFocusSchema.safeParse(crystalFocus);
        if (!focusParsed.success) {
            return res
                .status(400)
                .json({ error: 'Invalid crystal focus', details: focusParsed.error.format() });
        }
        // 2️⃣ Load survey questions
        const { data: questions, error: qError } = await supabase
            .from('survey_questions')
            .select('*');
        if (qError || !questions) {
            return res.status(500).json({ error: 'Failed to load questions' });
        }
        // 3️⃣ Aggregate weighted responses
        const totals = {
            fire: { total: 0, count: 0 },
            water: { total: 0, count: 0 },
            earth: { total: 0, count: 0 },
            air: { total: 0, count: 0 },
            aether: { total: 0, count: 0 },
        };
        for (const r of responses) {
            const q = questions.find((q) => q.id === r.questionId);
            if (q && totals[q.element]) {
                totals[q.element].total += r.answer * q.weight;
                totals[q.element].count += q.weight;
            }
        }
        // 4️⃣ Build normalized profile payload
        const profile = {
            user_id: userId,
            fire: Math.round((totals.fire.total / Math.max(totals.fire.count, 1)) * 20),
            water: Math.round((totals.water.total / Math.max(totals.water.count, 1)) * 20),
            earth: Math.round((totals.earth.total / Math.max(totals.earth.count, 1)) * 20),
            air: Math.round((totals.air.total / Math.max(totals.air.count, 1)) * 20),
            aether: Math.round((totals.aether.total / Math.max(totals.aether.count, 1)) * 20),
            updated_at: new Date().toISOString(),
            crystal_focus: focusParsed.data,
        };
        // 5️⃣ Validate full elemental profile
        const parsed = elementalProfileSchema.safeParse(profile);
        if (!parsed.success) {
            return res
                .status(400)
                .json({ error: 'Profile validation failed', details: parsed.error.format() });
        }
        // 6️⃣ Upsert into Supabase
        const { data, error } = await supabase
            .from('elemental_profiles')
            .upsert(parsed.data)
            .select()
            .single();
        if (error || !data) {
            return res.status(500).json({ error: 'Failed to save elemental profile' });
        }
        // 7️⃣ Respond with the computed stats
        return res.status(200).json({
            message: 'Survey processed successfully',
            stats: {
                fire: profile.fire,
                water: profile.water,
                earth: profile.earth,
                air: profile.air,
                aether: profile.aether,
            },
        });
    }
    catch (err) {
        console.error('❌ Survey submission error:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
