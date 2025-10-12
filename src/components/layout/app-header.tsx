import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-white/10 bg-black/20 px-4 backdrop-blur-md sm:px-6">
      <div className="md:hidden">
        <SidebarTrigger className="text-white" />
      </div>
      <div className="flex-1" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-white/50">
              <AvatarImage src="https://picsum.photos/seed/user/40/40" alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-gray-900/80 backdrop-blur-lg border-gray-700 text-white">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-700"/>
          <DropdownMenuItem className="focus:bg-gray-800">Settings</DropdownMenuItem>
          <DropdownMenuItem className="focus:bg-gray-800">Support</DropdownMenuItem>
          <DropdownMenuSeparator className="bg-gray-700"/>
          <DropdownMenuItem className="focus:bg-red-500/50">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
