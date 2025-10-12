import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

export function UserProfile() {
  return (
    <div className="flex justify-end items-center gap-4 p-4 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg">
      <div>
        <p className="font-semibold text-right text-white">John Nash</p>
        <p className="text-sm text-gray-300 text-right">My Settings</p>
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
