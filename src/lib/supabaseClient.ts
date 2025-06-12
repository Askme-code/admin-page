
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  const errorMsg = "CRITICAL ERROR: Supabase URL is missing. Ensure NEXT_PUBLIC_SUPABASE_URL (or VITE_SUPABASE_URL for local Vite-based .env) is set and the Next.js development server has been restarted. For Vercel/production, NEXT_PUBLIC_SUPABASE_URL must be set in environment variables.";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

if (!supabaseAnonKey) {
  const errorMsg = "CRITICAL ERROR: Supabase Anon Key is missing. Ensure NEXT_PUBLIC_SUPABASE_ANON_KEY (or VITE_SUPABASE_ANON_KEY for local Vite-based .env) is set and the Next.js development server has been restarted. For Vercel/production, NEXT_PUBLIC_SUPABASE_ANON_KEY must be set in environment variables.";
  console.error(errorMsg);
  throw new Error(errorMsg);
}

let supabaseInstance: SupabaseClient;

try {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} catch (error) {
  const clientCreationError = `CRITICAL ERROR: Failed to create Supabase client. Please check the URL and Key. URL: ${supabaseUrl}, Key: ${supabaseAnonKey ? 'Provided (may be invalid)' : 'Missing'}. Original Error: ${(error as Error).message}`;
  console.error(clientCreationError);
  throw new Error(clientCreationError);
}

export const supabase = supabaseInstance;
