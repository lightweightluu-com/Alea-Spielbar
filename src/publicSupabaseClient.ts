import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * The only Supabase touchpoint the public site bundle has: a client scoped to the anon key,
 * which — per supabase/schema.sql's RLS policies — can only INSERT into `reservations` and
 * nothing else (no read/write access to `games`, no read/update/delete on `reservations`).
 * Kept separate from src/admin/supabaseClient.ts so the public and admin bundles stay
 * independently tree-shakeable and this one never gains broader access by accident.
 *
 * Built lazily, on first actual use, rather than at module load: `createClient` throws
 * synchronously when VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are missing or malformed (e.g. no
 * .env file yet in a fresh local/Codespace checkout — those vars are never committed). Since this
 * file used to export a client built at import time, that throw happened before src/main.ts ran
 * any of its own code — including the app.innerHTML render — so the entire public site rendered
 * as a blank page. The reservation form is the only thing that actually needs Supabase; every
 * other part of the site must keep working even when it isn't configured.
 */
let client: SupabaseClient | null | undefined

export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    console.error('VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are not set — the reservation form cannot submit.')
    client = null
    return client
  }

  try {
    client = createClient(url, anonKey)
  } catch (err) {
    console.error('Failed to create the Supabase client:', err)
    client = null
  }
  return client
}
