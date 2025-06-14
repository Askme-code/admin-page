
"use client";

import { useEffect, useState, type ReactNode, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
// Removed: import { getCurrentUser } from '@/app/actions/userAuthActions'; 

// ============================================================================
// IMPORTANT: Admin Access Control
// ============================================================================
// To make a user an administrator for this application, their 'role'
// in the 'public.users' table MUST be set to 'admin'.
//
// How it works:
// 1. Users sign up/log in via Supabase Auth (auth.users table).
// 2. A Supabase trigger ('on_auth_user_created') should copy the new user
//    from 'auth.users' to 'public.users'. This trigger should populate fields like
//    id (from auth.users), full_name (from NEW.raw_user_meta_data->>'full_name'),
//    email (from NEW.email), phone (from NEW.raw_user_meta_data->>'phone'),
//    and set a default role (e.g., 'user').
//
//    Example SQL for `handle_new_user` trigger function:
//    ```sql
//    CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS TRIGGER AS $$
//    BEGIN
//      INSERT INTO public.users (id, full_name, email, phone, role, created_at, updated_at)
//      VALUES (
//        NEW.id,
//        NEW.raw_user_meta_data->>'full_name',
//        NEW.email,
//        NEW.raw_user_meta_data->>'phone',
//        'user', -- Default role
//        timezone('utc'::TEXT, now()),
//        timezone('utc'::TEXT, now())
//      );
//      RETURN NEW;
//    END;
//    $$ LANGUAGE plpgsql SECURITY DEFINER;
//
//    CREATE TRIGGER on_auth_user_created
//    AFTER INSERT ON auth.users
//    FOR EACH ROW
//    EXECUTE PROCEDURE public.handle_new_user();
//    ```
//
// 3. To grant admin privileges:
//    - Manually update the 'role' column in the 'public.users' table for the
//      desired user to 'admin'. You can do this via the Supabase dashboard table editor
//      or using SQL like:
//      `UPDATE public.users SET role = 'admin' WHERE id = 'user-uuid-here';`
//      (Replace 'user-uuid-here' with the actual user's ID from auth.users).
//    - Ensure the user actually exists in 'public.users'. If they signed up before the
//      trigger was active, you may need to manually INSERT their record first using SQL.
//
// This `checkAdminRole` function (below) is called by the AdminLayout to verify if the
// currently logged-in user (identified by `user_id` from the session) has the 'admin' role
// in the 'public.users' table.
//
// For database-level security (e.g., only admins can write to certain tables),
// you should use Row Level Security (RLS) policies in Supabase.
// These RLS policies can use a SQL helper function like `public.is_admin()`
// which checks `auth.uid()` against the `public.users` table for the 'admin' role.
// ============================================================================
async function checkAdminRole(user_id: string | undefined): Promise<boolean> {
  if (!user_id) {
    console.log("AdminLayout: Admin check - No user_id provided. User is not admin.");
    return false;
  }
  
  console.log(`AdminLayout: Admin check - Verifying role for user_id: ${user_id} in 'public.users' table.`);
  
  // Directly query the 'public.users' table for the role.
  const { data: userProfile, error } = await supabase
    .from('users') // Assuming your table is named 'users' in the public schema
    .select('role') // We only need the 'role' for this check
    .eq('id', user_id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means "0 rows", which is a valid "not found"
    console.error(`AdminLayout: Admin check - Error fetching user profile from 'public.users' for user_id ${user_id}. Message: ${error.message}. Code: ${error.code}. Details: ${error.details}. Hint: ${error.hint}. This could be due to RLS policies or network issues.`);
    return false;
  }

  if (!userProfile) {
     // This case means the user_id was not found in the public.users table.
    console.warn(`AdminLayout: Admin check - No profile found in 'public.users' for user_id ${user_id}. User cannot be admin. Ensure the user exists in 'public.users' and their 'role' is set.`);
    return false;
  }

  const isAdmin = userProfile.role === 'admin';
  console.log(`AdminLayout: Admin check - User ${user_id} role from 'public.users' is '${userProfile.role}'. Is admin: ${isAdmin}.`);
  
  if (!isAdmin && process.env.NODE_ENV === 'development') {
    console.warn(`AdminLayout: Admin check - User ${user_id} is NOT an admin. To grant access, update their 'role' to 'admin' in the 'public.users' table in your Supabase database.`);
  }
  return isAdmin;
}


export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | undefined>(undefined); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Effect for initializing session, role, and setting up auth listener
  useEffect(() => {
    const getSessionAndRole = async () => {
      console.log("AdminLayout: Initializing session and role check...");
      // setIsLoading(true); // isLoading is already true by default
      
      const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("AdminLayout: Error fetching session:", sessionError.message);
        setSession(null);
        setIsAdmin(false);
      } else if (currentSession) {
        console.log("AdminLayout: Session found for user:", currentSession.user?.email);
        setSession(currentSession);
        const isAdminUser = await checkAdminRole(currentSession.user?.id);
        setIsAdmin(isAdminUser);
      } else {
        console.log("AdminLayout: No active session found.");
        setSession(null);
        setIsAdmin(false);
      }
      setIsLoading(false);
      console.log(`AdminLayout: Initial check complete. isLoading: ${false}, isAdmin: ${isAdmin}, session: ${!!currentSession}`);
    };

    getSessionAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log("AdminLayout: Auth state changed. Event:", _event, "New session user:", newSession?.user?.email);
      setIsLoading(true); // Set loading true while re-checking role for new session
      setSession(newSession);
      if (newSession?.user) {
        const isAdminUser = await checkAdminRole(newSession.user.id);
        setIsAdmin(isAdminUser);
      } else {
        console.log("AdminLayout: AuthChange - Session ended (user logged out or token expired).");
        setIsAdmin(false);
      }
      setIsLoading(false);
      console.log(`AdminLayout: Auth state change processing finished. isLoading: ${false}, isAdmin: ${isAdmin}, session: ${!!newSession}`);
    });

    return () => {
      authListener?.subscription.unsubscribe();
      console.log("AdminLayout: Auth listener unsubscribed.");
    };
  }, []); // Run once on mount to set up listeners and initial state.

  // This effect handles redirection based on the derived isAdmin and session states
  useEffect(() => {
    if (isLoading) return; // Don't redirect while initial checks are pending

    console.log(`AdminLayout: Evaluating redirection. Path: ${pathname}, isLoading: ${isLoading}, isAdmin: ${isAdmin}, session: ${!!session}`);

    if (!session) { // No session at all
      if (pathname.startsWith('/admin') && pathname !== '/login') {
        console.log("AdminLayout: No session, on admin page (not /login). Redirecting to /login.");
        router.push('/login');
      }
    } else { // Has session
      if (isAdmin) {
        if (pathname === '/login') {
          console.log("AdminLayout: Admin is on /login page. Redirecting to /admin.");
          router.push('/admin');
        }
        // If admin and on an /admin/* path, they are allowed.
      } else { // Has session but NOT admin
        if (pathname.startsWith('/admin') && pathname !== '/login') {
          // User is on an admin page but isn't an admin.
          // Log them out or redirect them to login.
          // Forcing logout might be too aggressive if they just don't have rights.
          console.log("AdminLayout: User has session but is NOT admin, on admin page (not /login). Redirecting to /login.");
          // Consider if we need to sign them out first if a session exists but they are not admin
          // await supabase.auth.signOut(); // This might be too disruptive.
          router.push('/login'); // Redirect to login for re-authentication or to show "access denied".
        }
      }
    }
  }, [isLoading, session, isAdmin, pathname, router]);


  if (isLoading || session === undefined) { 
    console.log("AdminLayout: Rendering loading skeleton. isLoading:", isLoading, "session state:", session === undefined ? "initial" : (session ? "exists" : "null"));
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="space-y-4 p-8">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  if (pathname === '/login') {
    console.log("AdminLayout: Rendering /login page contents directly.");
    return <>{children}</>;
  }
  
  // This condition must be met to show admin content
  if (session && isAdmin && pathname.startsWith('/admin')) {
    console.log("AdminLayout: User is admin and has session. Rendering admin content for path:", pathname);
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen bg-background">
          <AdminSidebar />
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    );
  }
  
  // If here, it means:
  // - isLoading is false.
  // - session is not undefined.
  // - Not on /login page.
  // - EITHER:
  //   - No session (but then redirection to /login should have happened).
  //   - Has session but NOT admin and NOT on an /admin/* path (so this layout shouldn't render).
  //   - Has session but NOT admin and on an /admin/* path (but redirection to /login should have happened).
  // This path should ideally only be briefly hit during transitions before a redirect fully kicks in,
  // or if the page is not an admin page and not /login (e.g., if this layout was mistakenly applied elsewhere).
  // If redirection to /login has been triggered, rendering null allows that to complete.
  console.log(`AdminLayout: Fallthrough - conditions for rendering admin content or login not met. Path: ${pathname}, isLoading: ${isLoading}, isAdmin: ${isAdmin}, session: ${!!session}. Likely redirecting or page is outside admin scope.`);
  return null; // Render null if not showing skeleton, not on /login, and not authorized for admin content
}

