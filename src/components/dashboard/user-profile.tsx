import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfile() {
  return (
    <div className="flex justify-end items-center gap-4 p-4 rounded-3xl dark:bg-white/10 bg-white/50 dark:backdrop-blur-xl border border-border/20 shadow-lg">
      <div>
        <p className="font-semibold text-right">John Nash</p>
        <p className="text-sm text-muted-foreground text-right">My Settings</p>
      </div>
      <Avatar className="h-12 w-12 border-2 border-white/50">
        <AvatarImage
          src="https://picsum.photos/seed/john/48/48"
          alt="John Nash"
          data-ai-hint="man portrait"
        />
        <AvatarFallback>JN</AvatarFallback>
      </Avatar>
    </div>
  );
}
