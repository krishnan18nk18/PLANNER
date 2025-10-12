import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function UserProfile() {
  return (
    <div className="flex justify-end items-center gap-4 p-4 rounded-lg bg-card">
      <div>
        <p className="font-semibold text-right">John Nash</p>
        <p className="text-sm text-muted-foreground text-right">My Settings</p>
      </div>
      <Avatar className="h-10 w-10">
        <AvatarImage
          src="https://picsum.photos/seed/john/40/40"
          alt="John Nash"
          data-ai-hint="man portrait"
        />
        <AvatarFallback>JN</AvatarFallback>
      </Avatar>
    </div>
  );
}
