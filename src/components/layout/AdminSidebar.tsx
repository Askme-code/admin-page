
"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { MountainSnow, LayoutDashboard, Newspaper, Map, CalendarClock, Lightbulb, LogOut, Home, MessageSquareText } from 'lucide-react';
import type { NavItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

const adminNavItems: NavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Articles', href: '/admin/articles', icon: Newspaper },
  { title: 'Destinations', href: '/admin/destinations', icon: Map },
  { title: 'Events', href: '/admin/events', icon: CalendarClock },
  { title: 'Travel Tips', href: '/admin/travel-tips', icon: Lightbulb },
  { title: 'User Feedback', href: '/admin/feedback', icon: MessageSquareText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: 'Logout Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
      router.push('/login'); 
    }
  };

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left">
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center gap-2 font-headline text-lg font-semibold text-sidebar-foreground">
          <MountainSnow className="h-7 w-7 text-primary" />
          <span className="group-data-[collapsible=icon]:hidden">Admin Panel</span>
        </Link>
        <div className="md:hidden ml-auto"> 
           <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {adminNavItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))}
                tooltip={item.title}
              >
                <Link href={item.href}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2 mt-auto">
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Back to Site">
                    <Link href="/">
                        <Home />
                        <span>Back to Site</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <SidebarMenuButton 
                    tooltip="Logout" 
                    className="hover:bg-destructive/20 hover:text-destructive data-[active=true]:bg-destructive/20 data-[active=true]:text-destructive"
                    onClick={handleLogout}
                >
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
