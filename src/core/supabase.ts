// src/core/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.SUPABASE_URL
const serviceRoleKey  = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: SUPABASE_URL')
}
if (!serviceRoleKey) {
  throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY')
}

export const supabase: SupabaseClient = createClient(supabaseUrl, serviceRoleKey)

if (process.env.NODE_ENV !== 'production') {
  ;(async () => {
    try {
      const { error, count } = await supabase
        .from('constellation_entries')
        .select('id', { head: true, count: 'exact' })

      if (error) throw error
      console.info(`✔ Supabase ping succeeded, rows=${count}`)
    } catch (err: any) {
      console.error('✘ Supabase ping error:', err.message || err)
    }
  })()
}
