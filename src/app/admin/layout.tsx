
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// ============================================================================
// IMPORTANT: Admin Access Control
// ============================================================================
// To make a user an administrator for this application, their 'role'
// in the 'public.users' table MUST be set to 'admin'.
//
// How it works:
// 1. Users sign up/log in via Supabase Auth (auth.users table).
// 2. A Supabase trigger ('on_auth_user_created') should copy the new user
//    from 'auth.users' to 'public.users' and assign a default role (e.g., 'user').
// 3. To grant admin privileges:
//    - Manually update the 'role' column in the 'public.users' table for the
//      desired user to 'admin'. You can do this via the Supabase dashboard table editor
//      or using SQL like:
//      UPDATE public.users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
//    - Ensure the email matches the one in auth.users.
//
// This `checkAdminRole` function is called by the AdminLayout to verify if the
// currently logged-in user has the 'admin' role in the 'public.users' table.
//
// For database-level security (e.g., only admins can write to certain tables),
// you should use Row Level Security (RLS) policies in Supabase.
// These RLS policies can use a SQL helper function like `public.is_admin()`
// which checks `auth.uid()` against the `public.users` table.
// ============================================================================
async function checkAdminRole(user_id: string | undefined): Promise<boolean> {
  if (!user_id) {
    console.log("AdminLayout: Admin check - No user_id provided. User is not admin.");
    return false;
  }
  
  console.log(`AdminLayout: Admin check - Verifying role for user_id: ${user_id} in 'public.users' table.`);
  const { data, error } = await supabase
    .from('users') // This refers to 'public.users'
    .select('role')
    .eq('id', user_id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 means 0 rows found, which is a valid case (user not in public.users or no profile yet)
    console.error(`AdminLayout: Admin check - Error fetching user role for user_id ${user_id}:`, error.message);
    return false;
  }

  if (!data) {
    console.warn(`AdminLayout: Admin check - No profile found in 'public.users' table for user_id ${user_id}. User cannot be admin. Ensure the user exists in 'public.users' and their 'role' is set.`);
    return false;
  }

  const isAdmin = data.role === 'admin';
  console.log(`AdminLayout: Admin check - User ${user_id} role from 'public.users' is '${data.role}'. Is admin: ${isAdmin}.`);
  
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

  useEffect(() => {
    const getSessionAndRole = async () => {
      console.log("AdminLayout: Initializing session and role check...");
      setIsLoading(true);
      
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
      setIsLoading(true);
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
  }, [isAdmin]); // Re-run if isAdmin changes to ensure redirection logic is evaluated correctly

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
          console.log("AdminLayout: User has session but is NOT admin, on admin page (not /login). Redirecting to /login (or consider a 'forbidden' page).");
          // router.push('/forbidden'); // Or show a forbidden page
          router.push('/login'); // For now, redirect to login to allow re-attempt with admin creds
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
  
  if (session && isAdmin) {
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
  
  console.log(`AdminLayout: Conditions for rendering admin content or login page not fully met, or redirect is pending. Path: ${pathname}, isLoading: ${isLoading}, isAdmin: ${isAdmin}, session: ${!!session}. Rendering null or redirecting.`);
  return null; 
}
