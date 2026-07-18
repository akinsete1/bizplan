// lib/supabase.ts — Browser-side Supabase client (singleton)
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Guard: show a helpful error if env vars are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '⚠️  Supabase env vars missing. Copy .env.local.example to .env.local and fill in your keys from https://app.supabase.com → Settings → API'
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

// ─── Auth helpers ───────────────────────────────────────────────

export async function signUpWithEmail(email: string, password: string, fullName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });
  return { data, error };
}

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
    },
  });
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// ─── Profile helpers ─────────────────────────────────────────────

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
}

export async function updateProfile(userId: string, updates: object) {
  const { data, error } = await (supabase as any)
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
}

// ─── Document helpers ─────────────────────────────────────────────

export async function getUserDocuments(userId: string) {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
}

export async function saveDocument(document: {
  user_id: string;
  template_id: string;
  template_title: string;
  business_name?: string;
  status?: 'draft' | 'completed';
  content?: string;
  form_data?: object;
  is_paid?: boolean;
}) {
  const { data, error } = await (supabase as any)
    .from('documents')
    .insert(document)
    .select()
    .single();
  return { data, error };
}

export async function updateDocument(documentId: string, updates: object) {
  const { data, error } = await (supabase as any)
    .from('documents')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', documentId)
    .select()
    .single();
  return { data, error };
}

export async function deleteDocument(documentId: string) {
  const { error } = await supabase
    .from('documents')
    .delete()
    .eq('id', documentId);
  return { error };
}

// ─── Subscription helpers ─────────────────────────────────────────

export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  return { data, error };
}

// ─── Payment helpers ──────────────────────────────────────────────

export async function createPaymentRecord(payment: {
  user_id: string;
  paystack_reference: string;
  amount: number;
  plan?: string;
  document_id?: string;
}) {
  const { data, error } = await (supabase as any)
    .from('payments')
    .insert(payment)
    .select()
    .single();
  return { data, error };
}
