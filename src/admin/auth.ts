import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabaseClient'

export async function signInWithPassword(email: string, password: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  return error?.message ?? null
}

export async function signInWithOtp(email: string): Promise<string | null> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/admin.html#/games` },
  })
  return error?.message ?? null
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession()
  return data.session
}

export function onAuthStateChange(callback: (session: Session | null) => void): () => void {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => callback(session))
  return () => subscription.unsubscribe()
}

/** Redirects to #/login when there's no active session; returns true if access is allowed. */
export async function requireAuth(navigate: (hash: string) => void): Promise<boolean> {
  const session = await getSession()
  if (!session) {
    navigate('#/login')
    return false
  }
  return true
}
