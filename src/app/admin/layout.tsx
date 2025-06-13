
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// Function to check if the user has an 'admin' role (conceptual)
// In a real app, this would involve checking a 'roles' table or custom claims in Supabase JWT
async function checkAdminRole(user_id: string | undefined): Promise<boolean> {
  if (!user_id) return false;
  // This is a placeholder. Replace with actual role checking logic.
  // Example: Fetch user role from your 'users' or 'profiles' table.
  const { data, error } = await supabase
    .from('users') // Assuming your 'users' table from the prompt has a 'role' column
    .select('role')
    .eq('id', user_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error("Error fetching user role:", error);
    return false;
  }
  return data?.role === 'admin';
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
      setIsLoading(true);
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error getting session:", error);
        setSession(null);
        setIsAdmin(false);
      } else if (currentSession) {
        setSession(currentSession);
        const isAdminUser = await checkAdminRole(currentSession.user?.id);
        setIsAdmin(isAdminUser);
        if (!isAdminUser && pathname !== '/login') { // If not admin and not on login page
          router.push('/'); // Redirect non-admins away from admin area
        }
      } else {
        setSession(null);
        setIsAdmin(false);
        if (pathname !== '/login') {
            router.push('/login'); // Redirect to admin login if no session
        }
      }
      setIsLoading(false);
    };

    getSessionAndRole();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setIsLoading(true);
      setSession(newSession);
      if (newSession) {
        const isAdminUser = await checkAdminRole(newSession.user?.id);
        setIsAdmin(isAdminUser);
        if (!isAdminUser && pathname.startsWith('/admin')) {
            router.push('/'); // Redirect non-admins
        } else if (isAdminUser && pathname === '/login') {
            router.push('/admin');
        }
      } else {
        setIsAdmin(false);
        if (pathname.startsWith('/admin')) {
            router.push('/login');
        }
      }
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, pathname]);


  if (isLoading || session === undefined) {
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

  // If on /login page, let it render (it has its own logic for logged-in admins)
  if (pathname === '/login') {
    return <>{children}</>;
  }
  
  // If there's a session AND the user is an admin, show admin layout
  if (session && isAdmin) {
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
  
  // If not loading, and not on /login, and no session or not admin, user should have been redirected by useEffect.
  // This return null is a fallback to prevent rendering admin content if redirection is slow or fails.
  return null; 
}
