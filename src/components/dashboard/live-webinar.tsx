import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

export function LiveWebinar() {
  return (
    <Card className="glass-card bg-gradient-to-br from-pink-500/30 to-orange-500/30 border-white/20 overflow-hidden">
      <CardContent className="p-6">
        <p className="text-sm font-semibold text-white/80">Live Webinar</p>
        <h3 className="text-xl font-bold text-white mt-1">
          Productivity & Profit in Taskfly
        </h3>
        <div className="relative h-32 mt-4">
          <Image
            src="https://picsum.photos/seed/webinar/400/200"
            alt="Webinar illustration"
            fill
            className="object-contain"
            data-ai-hint="illustration work"
          />
        </div>
      </CardContent>
    </Card>
  );
}
