'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Calendar,
  Sun,
  Moon,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { useAuth, useUser } from '@/firebase';
import { Icons } from '../icons';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { href: '/suggestions', icon: Sparkles, label: 'Smart Suggestions' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
];

export function AppHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useUser();
  const { auth } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    if (auth) {
      await auth.signOut();
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-2 font-semibold text-lg"
      >
        <Icons.logo className="h-6 w-6 text-primary" />
        <span className="font-headline hidden sm:inline-block">PlanVerse</span>
      </Link>

      <nav className="flex-1 flex justify-center items-center gap-2 sm:gap-4">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className={cn(
                "h-auto px-2 sm:px-4 py-2 text-sm sm:text-base",
                pathname.startsWith(item.href)
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
          >
            <Link href={item.href} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <item.icon className="h-4 w-4" />
              <span className="hidden sm:inline-block">{item.label}</span>
            </Link>
          </Button>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="rounded-full w-10 h-10"
          aria-label="Toggle theme"
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border-2 border-border">
                <AvatarImage
                  src={user?.photoURL || ''}
                  alt={user?.displayName || 'User'}
                  data-ai-hint="user avatar"
                />
                <AvatarFallback>
                  {user?.displayName?.[0] || user?.email?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              {user?.displayName || user?.email}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive-foreground focus:bg-destructive"
              onClick={handleLogout}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
