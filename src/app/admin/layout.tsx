
"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined); // undefined initially

  useEffect(() => {
    // This check runs only on the client-side after hydration
    const isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (isAdminLoggedIn === 'true') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      if (pathname !== '/login') { 
        router.push('/login');
      }
    }
  }, [router, pathname]);

  // Show loading skeleton until authentication status is determined
  if (isAuthenticated === undefined) {
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

  // If on login page, just render children (the login page itself)
  if (pathname === '/login') {
      return <>{children}</>;
  }
  
  // If authenticated and not on login page, render admin layout
  if (isAuthenticated) {
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
  
  // Fallback: If not authenticated and not on login page, this part should ideally not be reached
  // due to the redirect in useEffect. However, as a safeguard, return null or a minimal message.
  // This also handles the brief period before redirection.
  return null; 
}
