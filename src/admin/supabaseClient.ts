import { createClient } from '@supabase/supabase-js'

/**
 * The one Supabase client instance for the admin app, scoped to the anon key. All actual access
 * control happens via Row Level Security (supabase/schema.sql): once signed in, the owner's
 * session gets full access to `games` and `reservations`; signed out, this client can do nothing
 * but attempt auth. Kept separate from src/publicSupabaseClient.ts so the public bundle never
 * accidentally pulls in admin-only code paths.
 */
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
