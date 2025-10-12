'use client';

import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  parseISO,
  differenceInMinutes,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Coffee,
  MoreVertical,
  Plus,
  ShoppingBasket,
  Smile,
  Users,
} from 'lucide-react';
import type { Task } from '@/lib/types';
import { Badge } from '../ui/badge';

type DailyScheduleProps = {
  tasks: Task[];
};

const taskIcons = {
  'Go to the Cult Fit Classes': <Smile className="h-5 w-5" />,
  'Conduct Project Review meeting': <Users className="h-5 w-5" />,
  'Coffee with Clients at Barista': <Coffee className="h-5 w-5" />,
  'Take the dog for a walk': <Clock className="h-5 w-5" />,
  default: <ShoppingBasket className="h-5 w-5" />,
};

const getTaskIcon = (title: string) => {
    return taskIcons[title as keyof typeof taskIcons] || taskIcons.default;
}

const getTaskColor = (title: string) => {
    switch (title) {
        case 'Take the dog for a walk':
            return 'bg-rose-500';
        case 'Go to the Cult Fit Classes':
            return 'bg-blue-500';
        case 'Conduct Project Review meeting':
            return 'bg-rose-500';
        case 'Coffee with Clients at Barista':
            return 'bg-gray-400';
        default:
            return 'bg-rose-500';
    }
}

export function DailySchedule({ tasks }: DailyScheduleProps) {
  const today = new Date('2024-03-12T00:00:00');
  const week = eachDayOfInterval({
    start: startOfWeek(today),
    end: endOfWeek(today),
  });

  const sortedTasks = tasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const getEndTime = (task: Task, index: number) => {
    if (index < sortedTasks.length - 1) {
        return parseISO(sortedTasks[index + 1].dueDate);
    }
    const taskDate = parseISO(task.dueDate);
    return new Date(taskDate.getTime() + 60 * 60 * 1000); // Assume 1 hour if it's the last task
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-lg flex items-center">
            September <span className="text-pink-500 ml-2">2021</span>
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {format(today, 'dd MMMM, yyyy')}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            {week.map((day) => (
              <div key={day.toString()} className="text-center">
                <span className="text-xs text-muted-foreground">
                  {format(day, 'EEE')}
                </span>
                <Button
                  variant={isSameDay(day, today) ? 'default' : 'ghost'}
                  className={cn(
                    'w-10 h-10 rounded-full flex flex-col p-0',
                    isSameDay(day, today) &&
                      'bg-primary text-primary-foreground'
                  )}
                >
                  <span className="text-md">{format(day, 'd')}</span>
                </Button>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative">
          {sortedTasks.map((task, index) => {
            const startTime = parseISO(task.dueDate);
            const endTime = getEndTime(task, index);
            const duration = differenceInMinutes(endTime, startTime);

            return (
              <div key={task.id} className="flex items-start gap-4 mb-4">
                {/* Timeline */}
                <div className="flex flex-col items-center w-16">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {format(startTime, 'h:mm a')}
                  </span>
                   <div className="flex-1 w-px bg-gray-300 my-2"></div>
                </div>

                {/* Task details */}
                <div className="flex-1 relative">
                    <div className="absolute -left-7 top-0">
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white", getTaskColor(task.title))}>
                            {getTaskIcon(task.title)}
                        </div>
                    </div>
                  <div className="pl-4">
                    <p className="text-sm text-muted-foreground">
                        {format(startTime, 'h:mm a')} - {format(endTime, 'h:mm a')} ({duration} min)
                    </p>
                    <p className="font-semibold text-lg">{task.title}</p>
                    <div className="flex items-center justify-between">
                        <Badge variant="outline">{task.completed ? '3/3' : '2/5'}</Badge>
                        {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-blue-500" />
                        ): (
                            <Circle className="h-5 w-5 text-rose-500" />
                        )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="absolute right-0 -bottom-4">
              <Button className="rounded-full w-12 h-12 bg-rose-500 hover:bg-rose-600 shadow-lg">
                <Plus className="h-6 w-6" />
              </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
