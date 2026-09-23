import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * The one Supabase client instance for the admin app, scoped to the anon key. All actual access
 * control happens via Row Level Security (supabase/schema.sql): once signed in, the owner's
 * session gets full access to `games` and `reservations`; signed out, this client can do nothing
 * but attempt auth. Kept separate from src/publicSupabaseClient.ts so the public bundle never
 * accidentally pulls in admin-only code paths.
 *
 * Built lazily, behind a Proxy, rather than at module load: `createClient` throws synchronously
 * when VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY are missing (e.g. a fresh checkout with no .env
 * yet). Every view module here does `import { supabase } from './supabaseClient'` and calls
 * methods on it — a Proxy lets all of them keep working unchanged while deferring the actual
 * client construction (and its potential throw) to the first real method call, which happens
 * inside src/admin/main.ts's router, not at import time. src/admin/main.ts also checks
 * isSupabaseConfigured() up front to show a clear message instead of ever reaching that throw.
 */
let client: SupabaseClient | null = null

export function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

function ensureClient(): SupabaseClient {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error('VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY sind nicht gesetzt.')
  }
  client = createClient(url, anonKey)
  return client
}

export const supabase: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(ensureClient(), prop, receiver)
  },
})
