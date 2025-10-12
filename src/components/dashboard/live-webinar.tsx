import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '../ui/button';

export function LiveWebinar() {
  return (
    <Card className="glass-card dark:bg-gradient-to-br dark:from-indigo-500/30 dark:to-purple-500/30 border-border/20 overflow-hidden group">
      <CardContent className="p-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-2xl font-bold mt-1 text-white">
            Unlock Pro Insights
          </h3>
          <p className="text-sm font-semibold text-white/80 mt-2">Get a deeper understanding of your productivity.</p>
        </div>
        <div className="relative h-48 mt-4">
          <Image
            src="https://picsum.photos/seed/insights-boy/400/300"
            alt="Cartoon character looking at a laptop"
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-110"
            data-ai-hint="3d character boy"
          />
        </div>
        <Button className="mt-4 w-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm">
            View Earning
        </Button>
      </CardContent>
    </Card>
  );
}
