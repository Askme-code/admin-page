
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

async function checkAdminRole(user_id: string | undefined): Promise<boolean> {
  if (!user_id) {
    console.log("Admin check: No user_id provided, user is not admin.");
    return false;
  }
  
  const { data, error } = await supabase
    .from('users') 
    .select('role')
    .eq('id', user_id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116: 0 rows, not an error for this check
    console.error(`Admin check: Error fetching user role for user_id ${user_id}:`, error.message);
    return false;
  }

  if (!data) {
    console.warn(`Admin check: No profile found in public.users for user_id ${user_id}. User is not admin.`);
    return false;
  }

  const isAdmin = data.role === 'admin';
  if (process.env.NODE_ENV === 'development') {
    console.log(`Admin check: User ${user_id} role is '${data.role}'. Is admin: ${isAdmin}`);
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
        if (!isAdminUser && pathname !== '/login') { 
          router.push('/'); 
        }
      } else {
        setSession(null);
        setIsAdmin(false);
        if (pathname !== '/login') {
            router.push('/login'); 
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
            router.push('/'); 
        } else if (isAdminUser && pathname === '/login') {
            router.push('/admin');
        }
      } else {
        setIsAdmin(false);
        if (pathname.startsWith('/admin') && pathname !== '/login') { // Also ensure not to redirect if on login page
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

  if (pathname === '/login') {
    return <>{children}</>;
  }
  
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
  
  return null; 
}
