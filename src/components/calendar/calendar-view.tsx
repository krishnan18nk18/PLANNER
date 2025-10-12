'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckSquare, Calendar as CalendarIcon } from 'lucide-react';
import type { Task, CalendarEvent } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type CalendarViewProps = {
  tasks: Task[];
  events: CalendarEvent[];
};

export function CalendarView({ tasks, events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const firstDayOfMonth = startOfMonth(currentMonth);
  const lastDayOfMonth = endOfMonth(currentMonth);

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(firstDayOfMonth),
    end: endOfWeek(lastDayOfMonth),
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const getItemsForDay = (day: Date) => {
    const dayTasks = tasks.filter((task) => isSameDay(new Date(task.dueDate), day));
    const dayEvents = events.filter((event) => isSameDay(new Date(event.date), day));
    return [...dayTasks, ...dayEvents];
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <TooltipProvider>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold font-headline">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 border-t border-l">
          {weekdays.map((day) => (
            <div key={day} className="p-2 border-b border-r text-center font-medium text-sm text-muted-foreground bg-muted/50">
              {day}
            </div>
          ))}
          {daysInMonth.map((day) => {
            const items = getItemsForDay(day);
            return (
              <div
                key={day.toString()}
                className={cn(
                  'h-32 border-b border-r p-2 flex flex-col',
                  !isSameMonth(day, currentMonth) ? 'bg-muted/30 text-muted-foreground' : ''
                )}
              >
                <span className={cn('font-semibold', isSameDay(day, new Date()) && 'text-primary font-bold')}>
                  {format(day, 'd')}
                </span>
                <div className="flex-grow overflow-y-auto mt-1 space-y-1">
                  {items.slice(0, 2).map((item) => (
                     <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                           <div className={cn(
                               "px-2 py-1 rounded-md text-xs text-white flex items-center gap-1 truncate",
                               'dueDate' in item ? 'bg-primary' : 'bg-accent'
                           )}>
                               {'dueDate' in item ? <CheckSquare className="h-3 w-3 flex-shrink-0" /> : <CalendarIcon className="h-3 w-3 flex-shrink-0" />}
                               <span className="truncate">{item.title}</span>
                           </div>
                        </TooltipTrigger>
                        <TooltipContent>
                           <p>{item.title}</p>
                        </TooltipContent>
                     </Tooltip>
                  ))}
                  {items.length > 2 && (
                    <div className="text-xs text-muted-foreground mt-1">
                      + {items.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
