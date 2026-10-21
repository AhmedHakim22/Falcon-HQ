import { createClient } from '@supabase/supabase-js';

// Fallback to production Supabase project credentials for seamless zero-config Vercel deployments
const supabaseUrl = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  'https://zfkvokggoivpmkkvmwvf.supabase.co';

const supabaseAnonKey = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  'sb_publishable_hS2H2N5qaShS5wX46Qz-sA_SpimCPAm';

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    }) 
  : null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

