
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// When connected to Supabase through Lovable, these environment variables are automatically injected
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In development, if the variables aren't available, we can provide a fallback message
if (!supabaseUrl || !supabaseAnonKey) {
  // During development, provide a helpful message
  console.error('Missing Supabase environment variables. Make sure you have connected your Supabase project in Lovable.');
  
  // For development only - replace with your actual Supabase URL and anon key if needed
  // DO NOT hardcode these values in production!
  // This is just to prevent the app from crashing during development
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
