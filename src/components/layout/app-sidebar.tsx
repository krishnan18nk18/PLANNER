'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Calendar,
  BookMarked,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Icons } from '../icons';
import { Button } from '../ui/button';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/planners', icon: BookMarked, label: 'Planners' },
  { href: '/suggestions', icon: Sparkles, label: 'Smart Suggestions' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <Icons.logo className="h-6 w-6 text-primary" />
          <span className="font-headline text-sidebar-foreground">PlanVerse</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-center p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="rounded-full text-sidebar-foreground hover:bg-sidebar-accent"
              aria-label="Toggle theme"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
