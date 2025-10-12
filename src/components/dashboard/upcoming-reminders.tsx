import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Task, CalendarEvent } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { CheckSquare, Calendar } from 'lucide-react';

type UpcomingRemindersProps = {
  tasks: Task[];
  events: CalendarEvent[];
};

export function UpcomingReminders({ tasks, events }: UpcomingRemindersProps) {
  const upcomingTasks = tasks
    .filter((task) => !task.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);
  
  const upcomingEvents = events
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 2);

  const combined = [...upcomingTasks, ...upcomingEvents].sort((a, b) => 
    new Date('dueDate' in a ? a.dueDate : a.date).getTime() - new Date('dueDate' in b ? b.dueDate : b.date).getTime()
  );

  return (
    <ScrollArea className="h-72">
      <div className="space-y-4">
        {combined.length > 0 ? (
          combined.map((item) => (
            <div key={item.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                 <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    {'dueDate' in item ? <CheckSquare className="h-5 w-5 text-primary" /> : <Calendar className="h-5 w-5 text-accent" />}
                 </div>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDate('dueDate' in item ? item.dueDate : item.date, "MMM d")}
                </p>
              </div>
              {'priority' in item && (
                <div className="ml-auto font-medium">
                  <Badge variant={
                    item.priority === 'High' ? 'destructive' 
                    : item.priority === 'Medium' ? 'secondary' 
                    : 'outline'
                  } className="capitalize">{item.priority}</Badge>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center py-10">No upcoming tasks or events.</p>
        )}
      </div>
    </ScrollArea>
  );
}
