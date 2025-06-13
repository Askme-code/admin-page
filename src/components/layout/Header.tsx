
"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  // SheetTitle, // Removed unused import
  SheetTrigger,
  SheetClose
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

const mainNavLinks: NavItem[] = [
  { title: 'Home', href: '/', icon: HomeIcon },
  {
    title: 'Update',
    href: '#',
    isDropdownTrigger: true,
    icon: Newspaper,
    children: [
      { title: 'Articles', href: '/articles', icon: Newspaper },
      { title: 'Destinations', href: '/destinations', icon: MapPin },
      { title: 'Events', href: '/events', icon: CalendarClock },
      { title: 'Travel Tips', href: '/travel-tips', icon: Lightbulb },
    ],
  },
  { title: 'Feedback', href: '/#feedback-section', icon: MessageSquare },
  { title: 'About', href: '/plan-your-visit', icon: Info },
];

const authenticatedUserNavLinks: NavItem[] = [
  { title: 'My Bookings', href: '/my-bookings', icon: ListChecks, auth: true },
  { title: 'Book a Tour', href: '/booking', icon: Ticket, auth: true, isButton: true },
];

const guestNavLinks: NavItem[] = [
  { title: 'Register', href: '/signup', icon: UserPlus, noAuth: true, isButton: true },
  { title: 'Login', href: '/login-user', icon: LogIn, noAuth: true, isButton: true },
];


export default function Header() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCurrentUser = useCallback(async () => {
    // Ensure session is not null before attempting to access session.user
    const currentSessionData = await supabase.auth.getSession(); // Get current session directly
    if (currentSessionData && currentSessionData.data.session?.user) {
        const userProfile = await getCurrentUser();
        setCurrentUser(userProfile);
    } else {
        setCurrentUser(null);
    }
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
      }
      setIsLoading(false);
    };
    getSessionAndUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        await fetchCurrentUser();
      } else {
        setCurrentUser(null);
      }
       if (_event === 'SIGNED_OUT' && (pathname.startsWith('/booking') || pathname.startsWith('/my-bookings') )) {
        router.push('/login-user');
      }
      if (_event === 'SIGNED_IN' && (pathname === '/login-user' || pathname === '/signup')) {
        router.push('/');
      }
      setIsLoading(false); // Ensure loading state is managed here too
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
      toast({ title: "Search Submitted", description: `You searched for: ${searchQuery}` });
      // Future: router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      if (isSheetOpen) setIsSheetOpen(false);
    }
  };

  const renderNavLink = (item: NavItem, isMobile = false) => {
    const commonClasses = "text-sm font-medium transition-colors hover:text-primary";
    const mobileLinkClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary";
    const desktopLinkClasses = `text-foreground/70 ${commonClasses}`;

    if (item.isDropdownTrigger && item.children) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                isMobile ? "justify-start w-full " + mobileLinkClasses : desktopLinkClasses,
                "flex items-center"
              )}
            >
              {isMobile && item.icon && <item.icon className="h-5 w-5" />}
              {item.title}
              <ChevronDown className={cn("ml-1 h-4 w-4 transition-transform duration-200", {"group-data-[state=open]:rotate-180": !isMobile})} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isMobile ? "start" : "center"} className="w-56">
            {item.children.map((child) => (
              <DropdownMenuItem key={child.title} asChild onClick={() => isMobile && setIsSheetOpen(false)}>
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
         <Button variant={isMobile ? "ghost" : "default"} size="sm" asChild className={isMobile ? "w-full justify-start px-3 py-2 " + mobileLinkClasses : ""} onClick={() => isMobile && setIsSheetOpen(false)}>
            <Link href={item.href}>
              {item.icon && <item.icon className="mr-2 h-4 w-4" />}
              {item.title}
            </Link>
          </Button>
       );
    }

    if (item.action) {
       return (
        <Button variant="ghost" className={isMobile ? "justify-start w-full " + mobileLinkClasses : desktopLinkClasses} onClick={() => {item.action!(); if (isMobile) setIsSheetOpen(false);}}>
            {isMobile && item.icon && <item.icon className="h-5 w-5" />}
            {item.title}
        </Button>
       );
    }

    return (
      <Link
        href={item.href}
        className={isMobile ? mobileLinkClasses : desktopLinkClasses}
        onClick={() => isMobile && setIsSheetOpen(false)}
      >
        {isMobile && item.icon && <item.icon className="h-5 w-5" />}
        {item.title}
      </Link>
    );
  };

 const mobileNavItems: NavItem[] = mainNavLinks.flatMap(item => {
    if (item.isDropdownTrigger && item.children) {
      // Ensure children is an array before mapping
      const childrenArray = Array.isArray(item.children) ? item.children : [];
      const mappedChildren = childrenArray.map(c => ({ ...c, title: `  ${c.title}` })); // Indent children
      return [item, ...mappedChildren];
    }
    return [item];
  }).concat(
    session ? authenticatedUserNavLinks : [],
    session ? [{ title: "Logout", href: "#", icon: LogOut, action: handleLogout }] : guestNavLinks
  );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center gap-2 font-headline text-xl font-semibold" onClick={() => setIsSheetOpen(false)}>
          <MountainSnow className="h-7 w-7 text-primary" />
          <span className="hidden sm:inline">Tanzania Tourist Trails</span>
          <span className="sm:hidden">TTT</span>
        </Link>

        <nav className="hidden md:flex flex-grow items-center gap-4 lg:gap-6">
          {mainNavLinks.map((item) => (
            <div key={item.title}>{renderNavLink(item)}</div>
          ))}
          <div className="flex-grow" /> {/* Spacer */}

          <form onSubmit={handleSearchSubmit} className="relative ml-auto flex-1 sm:flex-initial max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 sm:w-[200px] lg:w-[250px] h-9 rounded-md"
            />
          </form>

          {isLoading ? (
            <div className="h-8 w-24 bg-muted rounded animate-pulse ml-2"></div>
          ) : session ? (
            <>
              {authenticatedUserNavLinks.filter(item => item.isButton).map((item) => (
                 <div key={item.title} className="ml-2">{renderNavLink(item)}</div>
              ))}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-2 flex items-center gap-2 px-3 py-2 h-9">
                    <User className="h-5 w-5" />
                    <span className="text-sm font-medium hidden lg:inline">
                      {currentUser?.full_name ? currentUser.full_name.split(' ')[0] : 'Account'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{currentUser?.full_name || currentUser?.email || 'My Account'}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {authenticatedUserNavLinks.filter(item => !item.isButton).map((item) => (
                     <DropdownMenuItem key={item.title} asChild>
                      <Link href={item.href} className="flex items-center gap-2">
                        {item.icon && <item.icon className="h-4 w-4 text-muted-foreground" />}
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            guestNavLinks.map((item) => (
              <div key={item.title} className="ml-2">{renderNavLink(item)}</div>
            ))
          )}
        </nav>

        <div className="md:hidden ml-auto">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs sm:max-w-sm">
              <SheetHeader className="mb-4 border-b pb-4">
                <SheetClose asChild>
                   <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                      <MountainSnow className="h-7 w-7 text-primary" />
                      Tanzania Trails
                    </Link>
                </SheetClose>
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
                {mobileNavItems.map((item, index) => {
                   // Check if item is a dropdown trigger and has children for mobile rendering
                   if (item.isDropdownTrigger && item.children) {
                     const mainItem = (
                        <div key={`${item.title}-trigger-${index}`} className="px-3 py-2 text-muted-foreground font-semibold flex items-center gap-3">
                          {item.icon && <item.icon className="h-5 w-5" />}
                          {item.title}
                        </div>
                     );
                     // Ensure item.children is an array before mapping
                     const childrenArray = Array.isArray(item.children) ? item.children : [];
                     const childrenItems = childrenArray.map(child => (
                        <SheetClose asChild key={`${child.title}-child-${index}`}>
                          {renderNavLink({...child, title: `  ${child.title}`}, true)}
                        </SheetClose>
                     ));
                     return [mainItem, ...childrenItems];
                   }
                   // Render non-dropdown items or dropdown items without children directly
                   return (
                     <SheetClose asChild key={`${item.title}-item-${index}`}>
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

    