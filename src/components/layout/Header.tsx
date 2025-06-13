
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetClose,
  SheetTrigger,
  SheetTitle // Added SheetTitle import
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Menu, MountainSnow, LogOut, User, Search, ChevronDown, LogIn, UserPlus, Ticket, ListChecks, Newspaper, MapPin, Lightbulb, MessageSquare, Info, ChevronRight, HomeIcon, CalendarClock } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { Session } from '@supabase/supabase-js';
import { signOutUser, getCurrentUser } from '@/app/actions/userAuthActions';
import { useToast } from '@/hooks/use-toast';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { PublicUser } from '@/lib/types';
import { useIsMobile } from '@/hooks/use-mobile';


const mainNavLinks: NavItem[] = [
  { title: 'Home', href: '/', icon: HomeIcon, key: 'main-home' },
  {
    title: 'Update',
    href: '#',
    isDropdownTrigger: true,
    icon: Newspaper,
    key: 'main-update',
    children: [
      { title: 'Articles', href: '/articles', icon: Newspaper, key: 'update-articles' },
      { title: 'Destinations', href: '/destinations', icon: MapPin, key: 'update-destinations' },
      { title: 'Events', href: '/events', icon: CalendarClock, key: 'update-events'},
      { title: 'Travel Tips', href: '/travel-tips', icon: Lightbulb, key: 'update-travel-tips' },
    ],
  },
  { title: 'Feedback', href: '/#feedback-section', icon: MessageSquare, key: 'main-feedback' },
  { title: 'About', href: '/about', icon: Info, key: 'main-about' },
];


export default function Header() {
  const isMobile = useIsMobile();
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCurrentUser = useCallback(async () => {
    const { data: { session: currentSessionData } } = await supabase.auth.getSession();
    if (currentSessionData?.user) {
        const userProfile = await getCurrentUser();
        setCurrentUser(userProfile);
    } else {
        setCurrentUser(null);
    }
    setIsLoading(false);
  }, []);


  useEffect(() => {
    const getSessionAndUser = async () => {
      setIsLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      if (currentSession?.user) {
        await fetchCurrentUser();
      } else {
        setCurrentUser(null);
        setIsLoading(false);
      }
    };
    getSessionAndUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setIsLoading(true);
      setSession(newSession);
      if (newSession?.user) {
        await fetchCurrentUser();
      } else {
        setCurrentUser(null);
      }
       if (event === 'SIGNED_OUT' && (pathname.startsWith('/booking') || pathname.startsWith('/my-bookings') )) {
        router.push('/login-user');
      }
      if (event === 'SIGNED_IN' && (pathname === '/login-user' || pathname === '/signup')) {
        router.push('/');
      }
      setIsLoading(false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [router, pathname, fetchCurrentUser]);

  const handleLogout = async () => {
    setIsSheetOpen(false);
    const result = await signOutUser();
    if (result.success) {
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      setCurrentUser(null);
      router.push('/');
      router.refresh();
    } else {
      toast({ title: "Logout Failed", description: result.error || "Could not log out.", variant: "destructive" });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({ title: "Search Submitted (UI Only)", description: `You searched for: ${searchQuery}` });
      setSearchQuery("");
      if (isSheetOpen) setIsSheetOpen(false);
    }
  };

  const renderNavLink = (item: NavItem, isMobileContext = false) => {
    const commonClasses = "text-sm font-medium transition-colors hover:text-primary";
    const mobileLinkClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary";
    const desktopLinkClasses = `text-foreground/70 ${commonClasses}`;

    const LinkOrButtonComponent = item.isButton ? Button : Link;
    const buttonVariant = item.variant || (isMobileContext ? "ghost" : "default");

    if (item.isDropdownTrigger && item.children) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                isMobileContext ? "justify-start w-full " + mobileLinkClasses : desktopLinkClasses,
                "flex items-center"
              )}
            >
              {isMobileContext && item.icon && <item.icon className="h-5 w-5" />}
              {item.title}
              <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", {"group-data-[state=open]:rotate-180": !isMobileContext})} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isMobileContext ? "start" : "center"} className="w-56">
            {item.children.map((child) => (
              <DropdownMenuItem key={child.key || child.title} asChild onClick={() => isMobileContext && setIsSheetOpen(false)}>
                <Link href={child.href} className="flex items-center gap-2">
                  {child.icon && <child.icon className="h-4 w-4 text-muted-foreground" />}
                  {child.title}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (item.isButton) {
       return (
         <Button variant={buttonVariant} size="sm" asChild className={isMobileContext ? "w-full justify-start px-3 py-2 " + mobileLinkClasses : ""} onClick={() => isMobileContext && setIsSheetOpen(false)}>
            <Link href={item.href}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.title}
            </Link>
          </Button>
       );
    }

    if (item.action) {
       return (
        <Button variant={item.variant || "ghost"} size="sm" className={isMobileContext ? "justify-start w-full " + mobileLinkClasses : desktopLinkClasses} onClick={() => {item.action!(); if (isMobileContext) setIsSheetOpen(false);}}>
            {isMobileContext && item.icon && <item.icon className="h-5 w-5" />}
            {item.title}
        </Button>
       );
    }

    return (
      <Link
        href={item.href}
        className={isMobileContext ? mobileLinkClasses : desktopLinkClasses}
        onClick={() => isMobileContext && setIsSheetOpen(false)}
      >
        {isMobileContext && item.icon && <item.icon className="h-5 w-5" />}
        {item.title}
      </Link>
    );
  };

  const mobileNavItems: NavItem[] = [];
  mainNavLinks.forEach((item) => {
    if (item.isDropdownTrigger && item.children) {
      mobileNavItems.push({ ...item, key: item.key || `${item.title}-trigger`, isInteractive: false, href: '#' });
      item.children.forEach((child) => {
        mobileNavItems.push({ ...child, title: `  ${child.title}`, key: child.key || `${item.title}-child-${child.title}` });
      });
    } else {
      mobileNavItems.push({ ...item, key: item.key || item.title });
    }
  });

  if (session) {
    mobileNavItems.push(
      { title: 'Book a Tour', href: '/booking', icon: Ticket, auth: true, isButton: true, key: 'mob-book-tour', variant: 'ghost'},
      { title: 'My Bookings', href: '/my-bookings', icon: ListChecks, auth: true, key: 'mob-my-bookings', variant: 'ghost'},
      { title: 'Logout', href: '#', icon: LogOut, action: handleLogout, key: 'mob-logout', isButton: true, variant: 'ghost' }
    );
  } else {
    mobileNavItems.push(
      { title: 'Register', href: '/signup', icon: UserPlus, noAuth: true, isButton: true, key: 'mob-register', variant: 'ghost' },
      { title: 'Login', href: '/login-user', icon: LogIn, noAuth: true, isButton: true, key: 'mob-login', variant: 'ghost' }
    );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2 font-headline text-xl font-semibold" onClick={() => isSheetOpen && setIsSheetOpen(false)}>
          <MountainSnow className="h-7 w-7 text-primary" />
          <span className="hidden sm:inline">Tanzania Tourist Trails</span>
          <span className="sm:hidden">TTT</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-grow items-center gap-4 lg:gap-6">
          {mainNavLinks.map((item) => (
            <div key={item.key || item.title}>{renderNavLink(item, false)}</div>
          ))}
          <div className="flex-grow" /> {/* Spacer */}

          <form onSubmit={handleSearchSubmit} className="relative ml-auto flex-initial mr-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-[150px] lg:w-[200px] h-9 rounded-md"
            />
          </form>

          {/* Desktop Auth Section */}
          {isLoading ? (
            <div className="h-9 w-48 bg-muted rounded animate-pulse ml-2"></div>
          ) : session ? (
            <>
              <Button asChild size="sm" className="ml-2">
                <Link href="/booking"><Ticket className="mr-2 h-4 w-4" />Book a Tour</Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="ml-2 text-foreground/70 hover:text-primary">
                <Link href="/my-bookings"><ListChecks className="mr-1 h-4 w-4" />My Bookings</Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-1 flex items-center gap-1 px-2 py-2 h-9">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium hidden lg:inline">
                      {currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'Account'}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{currentUser?.full_name || currentUser?.email || 'My Account'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild size="sm">
                <Link href="/signup">Register</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="ml-2">
                <Link href="/login-user">Login</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Navigation Trigger */}
        <div className="md:hidden ml-auto">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm">
              <SheetHeader className="mb-4 border-b pb-4 text-left">
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setIsSheetOpen(false)}>
                    <MountainSnow className="h-7 w-7 text-primary" />
                    Tanzania Trails
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <form onSubmit={handleSearchSubmit} className="relative mb-4">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 w-full h-10 rounded-md"
                />
              </form>
              <nav className="grid gap-1 text-base font-medium">
                 {mobileNavItems.map((item) => {
                   const itemKey = item.key || item.title;
                   if (item.isDropdownTrigger && item.children && item.isInteractive === false) {
                     return (
                        <div key={itemKey} className="px-3 py-2 text-muted-foreground font-semibold flex items-center gap-3">
                          {item.icon && <item.icon className="h-5 w-5" />}
                          {item.title}
                        </div>
                     );
                   }
                   return (
                     <SheetClose asChild key={itemKey}>
                       {renderNavLink(item, true)}
                     </SheetClose>
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

