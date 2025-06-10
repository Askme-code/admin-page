import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // In a server component or API route, this could be a server-side error.
  // For client-side, it might mean environment variables are not exposed correctly.
  console.error('Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in your .env.local file.');
  // Depending on the context, you might throw an error or handle this differently.
  // For now, we'll allow the app to run but log the error.
}

// Ensure createClient is only called if credentials are valid, or handle the error appropriately.
// For this example, we'll proceed but in a real app, you'd want robust error handling.
export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
