import { createClient } from '@supabase/supabase-js'

/**
 * The only Supabase touchpoint the public site bundle has: a client scoped to the anon key,
 * which — per supabase/schema.sql's RLS policies — can only INSERT into `reservations` and
 * nothing else (no read/write access to `games`, no read/update/delete on `reservations`).
 * Kept separate from src/admin/supabaseClient.ts so the public and admin bundles stay
 * independently tree-shakeable and this one never gains broader access by accident.
 */
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)
