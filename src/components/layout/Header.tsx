
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, MountainSnow } from 'lucide-react';
import type { NavItem } from '@/lib/types';

const navItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'Articles', href: '/articles' },
  { title: 'Destinations', href: '/destinations' },
  { title: 'Events', href: '/events' },
  { title: 'Travel Tips', href: '/travel-tips' },
  { title: 'Feedback', href: '/#feedback-section' },
  { title: 'Admin Panel', href: '/admin' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-headline text-xl font-semibold">
          <MountainSnow className="h-7 w-7 text-primary" />
          Tanzania Tourist Trails
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-4 border-b pb-4">
                <SheetTitle asChild>
                  <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                    <MountainSnow className="h-7 w-7 text-primary" />
                    Tanzania Trails
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="grid gap-6 text-lg font-medium">
                {navItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
