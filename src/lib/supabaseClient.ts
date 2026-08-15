import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for Supabase (Production Project: mzgumubheyycaposytkk)
const metaEnv = (import.meta as any).env || {};
const DEFAULT_SUPABASE_URL = 'https://mzgumubheyycaposytkk.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16Z3VtdWJoZXl5Y2Fwb3N5dGtrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MDI2ODQsImV4cCI6MjEwMjE3ODY4NH0.wV0d5qGVj0daon4o6yNoKmSYJrm5YYFG_9IwrQxRKsE';

const supabaseUrl = metaEnv.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder')
);

// Create single authoritative Supabase client instance
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'ffc_supabase_auth_token'
  }
});

// Helper for testing database connectivity
export async function testSupabaseConnection(): Promise<{ ok: boolean; message: string }> {
  try {
    if (!isSupabaseConfigured) {
      return { 
        ok: false, 
        message: 'Supabase credentials are not configured.' 
      };
    }
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    if (error) throw error;
    return { ok: true, message: 'Connected to Supabase PostgreSQL database successfully.' };
  } catch (err: any) {
    return { ok: false, message: err?.message || 'Failed to connect to Supabase.' };
  }
}
