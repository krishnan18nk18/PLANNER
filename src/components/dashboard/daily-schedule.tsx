'use client';

import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  XCircle,
} from 'lucide-react';
import type { Task } from '@/lib/types';

type DailyScheduleProps = {
  tasks: Task[];
};

export function DailySchedule({ tasks }: DailyScheduleProps) {
  const today = new Date('2020-03-12T00:00:00');
  const week = eachDayOfInterval({
    start: startOfWeek(today),
    end: endOfWeek(today),
  });

  const taskTimeMap = new Map<string, Task[]>();

  tasks.forEach((task) => {
    const hour = format(new Date(task.dueDate), 'ha').toLowerCase();
    if (!taskTimeMap.has(hour)) {
      taskTimeMap.set(hour, []);
    }
    taskTimeMap.get(hour)?.push(task);
  });
  
  const hours = Array.from({ length: 5 }, (_, i) => format(new Date().setHours(7 + i), 'ha').toLowerCase());

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-lg">
            Today's Schedule
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {format(today, 'dd MMMM, yyyy')}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
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
                  {isSameDay(day, today) && (
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mt-0.5"></div>
                  )}
                </Button>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-4">
          <CardTitle className="text-md font-sans font-bold pt-4">Task</CardTitle>
          {hours.map((hour) => {
            const hourTasks = taskTimeMap.get(hour) || [];
            return (
              <div key={hour} className="flex items-start gap-4">
                <div className="w-16 text-right">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {hour.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 space-y-2">
                  {hourTasks.length > 0 ? (
                    hourTasks.map((task, index) => (
                      <Card
                        key={task.id}
                        className={cn(
                          'p-4',
                          index % 2 === 0
                            ? 'bg-blue-100 border-blue-200'
                            : 'bg-pink-100 border-pink-200'
                        )}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p
                              className={cn(
                                'font-semibold',
                                index % 2 === 0
                                  ? 'text-blue-900'
                                  : 'text-pink-900'
                              )}
                            >
                              {task.title}
                            </p>
                            {task.description && (
                              <p
                                className={cn(
                                  'text-sm',
                                  index % 2 === 0
                                    ? 'text-blue-700'
                                    : 'text-pink-700'
                                )}
                              >
                                {task.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {task.completed ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                            <MoreVertical className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="h-10"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
