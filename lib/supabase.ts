import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' 
      ? {
          getItem: (key) => {
            try {
              const item = window.localStorage.getItem(key);
              if (item === null) return null;
              return item;
            } catch (error) {
              console.error('Error reading from localStorage:', error);
              return null;
            }
          },
          setItem: (key, value) => {
            try {
              window.localStorage.setItem(key, value);
            } catch (error) {
              console.error('Error writing to localStorage:', error);
            }
          },
          removeItem: (key) => {
            try {
              window.localStorage.removeItem(key);
            } catch (error) {
              console.error('Error removing from localStorage:', error);
            }
          }
        }
      : undefined,
    storageKey: 'sb-auth-token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  }
}); 