
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// To make a user an admin, their 'role' in the 'public.users' table
// must be set to 'admin'. New users get 'user' by default via the
// on_auth_user_created trigger. You can update this manually in Supabase
// or via SQL, e.g.:
// UPDATE public.users SET role = 'admin' WHERE email = 'your-admin-email@example.com';
async function checkAdminRole(user_id: string | undefined): Promise<boolean> {
  if (!user_id) {
    console.log("AdminLayout: Admin check - No user_id provided, user is not admin.");
    return false;
  }
  
  console.log(`AdminLayout: Admin check - Checking role for user_id ${user_id}`);
  const { data, error } = await supabase
    .from('users') 
    .select('role')
    .eq('id', user_id)
    .single();

  if (error && error.code !== 'PGRST116') { 
    console.error(`AdminLayout: Admin check - Error fetching user role for user_id ${user_id}:`, error.message);
    return false;
  }

  if (!data) {
    console.warn(`AdminLayout: Admin check - No profile found in public.users for user_id ${user_id}. User is not admin. Ensure the user exists in public.users and their 'role' is set.`);
    return false;
  }

  const isAdmin = data.role === 'admin';
  console.log(`AdminLayout: Admin check - User ${user_id} role is '${data.role}'. Is admin: ${isAdmin}.`);
  if (!isAdmin && process.env.NODE_ENV === 'development') {
    console.warn(`AdminLayout: Admin check - User ${user_id} is NOT an admin. To grant access, update their role to 'admin' in the 'public.users' table.`);
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
  const [session, setSession] = useState<Session | null | undefined>(undefined); // undefined means initial loading state
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSessionAndRole = async () => {
      console.log("AdminLayout: Initial session and role check started.");
      setIsLoading(true); // Start loading
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("AdminLayout: Error getting session:", error.message);
        setSession(null);
        setIsAdmin(false);
        if (pathname.startsWith('/admin') && pathname !== '/login') {
          console.log("AdminLayout: Session error, redirecting to /login from", pathname);
          router.push('/login');
        }
      } else if (currentSession) {
        console.log("AdminLayout: Session found, user:", currentSession.user?.email);
        setSession(currentSession);
        const isAdminUser = await checkAdminRole(currentSession.user?.id);
        setIsAdmin(isAdminUser);
        if (isAdminUser) {
          if (pathname === '/login') {
            console.log("AdminLayout: Admin on /login, redirecting to /admin");
            router.push('/admin');
          }
        } else { // Has session, but not admin
          if (pathname.startsWith('/admin') && pathname !== '/login') {
            console.log("AdminLayout: Non-admin user on admin page, redirecting to /login from", pathname);
            router.push('/login'); 
          }
        }
      } else { // No session
        console.log("AdminLayout: No session found.");
        setSession(null);
        setIsAdmin(false);
        if (pathname.startsWith('/admin') && pathname !== '/login') {
          console.log("AdminLayout: No session, redirecting to /login from", pathname);
          router.push('/login');
        }
      }
      setIsLoading(false); // End loading
      console.log("AdminLayout: Initial session and role check finished. isLoading:", false, "isAdmin:", isAdmin, "session:", !!currentSession);
    };

    getSessionAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("AdminLayout: Auth state changed, event:", event, "newSession user:", newSession?.user?.email);
      setIsLoading(true); // Start loading
      setSession(newSession);
      if (newSession) {
        const isAdminUser = await checkAdminRole(newSession.user?.id);
        setIsAdmin(isAdminUser);
        if (isAdminUser) {
          if (pathname === '/login') {
            console.log("AdminLayout: AuthChange - Admin logged in on /login, redirecting to /admin");
            router.push('/admin');
          }
        } else {
          if (pathname.startsWith('/admin') && pathname !== '/login') {
            console.log("AdminLayout: AuthChange - Session changed to non-admin, on admin page, redirecting to /login from", pathname);
            router.push('/login');
          }
        }
      } else { // Logged out
        console.log("AdminLayout: AuthChange - Session ended (logged out).");
        setIsAdmin(false);
        if (pathname.startsWith('/admin') && pathname !== '/login') {
          console.log("AdminLayout: AuthChange - Logged out, on admin page, redirecting to /login from", pathname);
          router.push('/login');
        }
      }
      setIsLoading(false); // End loading
      console.log("AdminLayout: Auth state change processing finished. isLoading:", false, "isAdmin:", isAdmin, "session:", !!newSession);
    });

    return () => {
      authListener?.subscription.unsubscribe();
      console.log("AdminLayout: Auth listener unsubscribed.");
    };
  }, [router, pathname]); // Intentionally not including isAdmin and session to avoid re-triggering excessively. Pathname and router are the main drivers for re-evaluation.


  if (isLoading || session === undefined) { // Show loading skeleton if isLoading or session is 'undefined' (truly initial state)
    console.log("AdminLayout: Rendering loading skeleton. isLoading:", isLoading, "session:", session);
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

  // If on the login page, always render its content (children)
  // The useEffect above will handle redirecting an already logged-in admin away from /login
  if (pathname === '/login') {
    console.log("AdminLayout: Rendering /login page contents.");
    return <>{children}</>;
  }
  
  // If we have a session and the user is an admin, render the admin layout
  if (session && isAdmin) {
    console.log("AdminLayout: User is admin, rendering admin content for path:", pathname);
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
  
  // If none of the above conditions are met (e.g., not loading, not on /login, not admin with session),
  // it means a redirect should have happened or is in progress. Render null to avoid flashing content.
  // The useEffect should handle pushing to /login if necessary.
  console.log("AdminLayout: Conditions not met for rendering admin content or login page. Pathname:", pathname, "isLoading:", isLoading, "isAdmin:", isAdmin, "session:", !!session, "Redirect likely occurred or pending.");
  return null; 
}
