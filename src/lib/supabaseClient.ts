import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.');
  // In a real production app, you might want to throw an error or prevent client initialization.
  // For now, we allow it to proceed, which might lead to runtime errors if Supabase is used without proper config.
}

// Initialize the client, even if keys are missing, to avoid breaking imports.
// Operations will fail if keys are indeed missing.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
