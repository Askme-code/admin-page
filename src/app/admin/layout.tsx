
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null | undefined>(undefined); // undefined: loading, null: no session, Session: active session
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        setSession(null);
      } else {
        setSession(currentSession);
      }
      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === 'SIGNED_OUT' && pathname.startsWith('/admin')) {
        router.push('/login');
      }
      if (event === 'SIGNED_IN' && pathname === '/login') {
        router.push('/admin');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, pathname]);

  useEffect(() => {
    if (!isLoading && !session && pathname !== '/login') {
      router.push('/login');
    }
  }, [session, isLoading, pathname, router]);


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
    // If there's a session and user is on login, redirect to admin
    // Otherwise, show login page (handled by login page's own useEffect)
    if (session) {
         router.push('/admin'); // Should be caught by effect, but good to have defensive redirect
         return null; // Or loading while redirecting
    }
    return <>{children}</>;
  }
  
  if (session) {
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
  
  // This case should ideally be handled by the redirect in useEffect.
  // If user is not on /login, not loading, and no session, they should be redirected.
  // Returning null here prevents rendering admin content before redirect.
  return null; 
}
