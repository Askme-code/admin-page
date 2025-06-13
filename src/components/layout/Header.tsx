
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MountainSnow, LogOut, LogIn, UserPlus, Ticket, ListChecks } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { signOutUser } from '@/app/actions/userAuthActions';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';

const baseNavItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Articles', href: '/articles' },
  { title: 'Destinations', href: '/destinations' },
  { title: 'Events', href: '/events' },
  { title: 'Travel Tips', href: '/travel-tips' },
  { title: 'Plan Your Visit', href: '/plan-your-visit' },
];

const authNavItems: NavItem[] = [
  { title: 'Book a Tour', href: '/booking', auth: true },
  { title: 'My Bookings', href: '/my-bookings', auth: true },
  { title: 'Feedback', href: '/#feedback-section' },
];

const noAuthNavItems: NavItem[] = [
  { title: 'Log In', href: '/login-user', noAuth: true, icon: LogIn },
  { title: 'Sign Up', href: '/signup', noAuth: true, icon: UserPlus },
];

const adminNavItem: NavItem = { title: 'Admin Panel', href: '/admin' };


export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  useEffect(() => {
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setIsLoading(false);
    };
    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setIsLoading(false);
      if (event === 'SIGNED_OUT' && (pathname.startsWith('/booking') || pathname.startsWith('/my-bookings') )) {
        router.push('/login-user');
      }
      if (event === 'SIGNED_IN' && (pathname === '/login-user' || pathname === '/signup')) {
        router.push('/');
      }
      router.refresh(); // Refresh to re-evaluate server components potentially depending on auth
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, pathname]);

  const handleLogout = async () => {
    setIsSheetOpen(false); // Close sheet first
    const result = await signOutUser();
    if (result.success) {
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/'); // Redirect to home after logout
      router.refresh();
    } else {
      toast({ title: "Logout Failed", description: result.error || "Could not log out.", variant: "destructive" });
    }
  };

  const allNavItems = [
    ...baseNavItems,
    ...(session ? authNavItems : []),
    ...(session ? [] : noAuthNavItems),
    adminNavItem // Always show admin link for simplicity, access control is on admin pages
  ];
  
  const mobileNavItems = [...allNavItems];
  if (session) {
    mobileNavItems.push({ title: "Logout", href: "#", icon: LogOut });
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline text-xl font-semibold">
          <MountainSnow className="h-7 w-7 text-primary" />
          Tanzania Tourist Trails
        </Link>
        
        <nav className="hidden md:flex gap-4 items-center">
          {baseNavItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
           {session && authNavItems.map((item) => (
             <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
          {isLoading ? (
            <div className="h-6 w-20 bg-muted rounded animate-pulse"></div>
          ) : !session ? (
            <>
              {noAuthNavItems.map(item => (
                <Button key={item.title} variant="ghost" size="sm" asChild>
                  <Link href={item.href}>
                    {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                    {item.title}
                  </Link>
                </Button>
              ))}
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          )}
        </nav>

        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <SheetHeader className="mb-4 border-b pb-4">
                <SheetTitle asChild>
                  <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setIsSheetOpen(false)}>
                    <MountainSnow className="h-7 w-7 text-primary" />
                    Tanzania Trails
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="grid gap-2 text-base font-medium">
                {mobileNavItems.map((item) => {
                  if (item.auth && !session && !isLoading) return null;
                  if (item.noAuth && session && !isLoading) return null;
                  
                  if (item.title === "Logout") {
                    return (
                      <Button
                        key={item.title}
                        variant="ghost"
                        className="w-full justify-start px-3 py-2 text-base"
                        onClick={handleLogout}
                      >
                        {item.icon && <item.icon className="mr-2 h-5 w-5" />}
                        {item.title}
                      </Button>
                    );
                  }
                  return (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      {item.icon && <item.icon className="h-5 w-5" />}
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
