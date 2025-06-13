
'use server';

import { supabase } from '@/lib/supabaseClient';
import { z } from 'zod';
import { type SignUpFormValues } from '@/components/forms/SignupForm';
import { type UserLoginFormValues } from '@/components/forms/UserLoginForm';
import { revalidatePath } from 'next/cache';

export async function signUpUser(values: SignUpFormValues) {
  const { email, password, fullName, phone } = values;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName, // This will be available in new.raw_user_meta_data for the trigger
        phone: phone || null,
      },
    },
  });

  if (signUpError) {
    return { success: false, error: signUpError.message };
  }

  if (!signUpData.user) {
    return { success: false, error: "Signup completed but no user data returned. Please try logging in or contact support." };
  }
  
  // The trigger `on_auth_user_created` should handle copying to `public.users`.
  // If that `users` table has `password_hash` and other fields, they might need separate handling
  // or a review of the table's purpose if Supabase Auth is the primary auth mechanism.

  revalidatePath('/', 'layout'); // Revalidate layout to update header links potentially
  return { success: true, data: signUpData };
}

export async function signInUser(values: UserLoginFormValues) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: values.email,
    password: values.password,
  });

  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath('/', 'layout');
  return { success: true, data };
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    return { success: false, error: error.message };
  }
  revalidatePath('/', 'layout');
  return { success: true };
}

export async function getCurrentUser() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
        return null;
    }
    // Optionally, fetch from your public.users table if you need more profile data
    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('id, full_name, email, phone, role')
        .eq('id', session.user.id)
        .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116: 0 rows
        console.error("Error fetching user profile:", profileError);
        // Fallback to session user data if profile fetch fails but session exists
        return {
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || 'N/A',
            phone: session.user.user_metadata?.phone || undefined,
            role: 'user' // default or derive if possible
        };
    }
    return userProfile ? { ...userProfile, email: session.user.email } : { // ensure email from session is primary
        id: session.user.id,
        email: session.user.email,
        full_name: session.user.user_metadata?.full_name || 'N/A',
        phone: session.user.user_metadata?.phone || undefined,
        role: 'user'
    };
}
