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
  isToday,
  isWeekend,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CheckSquare, Calendar as CalendarIcon, X } from 'lucide-react';
import type { Task, CalendarEvent } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AnimatePresence, motion } from 'framer-motion';

type CalendarViewProps = {
  tasks: Task[];
  events: CalendarEvent[];
};

export function CalendarView({ tasks, events }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

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
    return [...dayTasks, ...dayEvents].sort((a,b) => ('dueDate' in a ? new Date(a.dueDate) : new Date(a.date)).getTime() - ('dueDate' in b ? new Date(b.dueDate) : new Date(b.date)).getTime());
  };

  const handleDateClick = (day: Date) => {
    if (isSameMonth(day, currentMonth)) {
      setSelectedDate(day);
    }
  };

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <TooltipProvider>
      <div className="w-full relative">
        <div className="glass-card text-card-foreground border-border/20 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold font-headline">
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <div className="space-x-2">
              <Button variant="outline" size="icon" onClick={prevMonth} className='rounded-full animate-bounce-hover'>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth} className='rounded-full animate-bounce-hover'>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-t border-l border-border/20 rounded-tl-xl rounded-tr-xl">
            {weekdays.map((day) => (
              <div key={day} className="p-2 border-b border-r border-border/20 text-center font-medium text-sm text-muted-foreground bg-muted/50 first:rounded-tl-xl last:rounded-tr-xl">
                {day}
              </div>
            ))}
            {daysInMonth.map((day, index) => {
              const items = getItemsForDay(day);
              const isCurrentDay = isToday(day);
              return (
                <motion.div
                  key={day.toString()}
                  className={cn(
                    'h-32 border-b border-r p-2 flex flex-col relative overflow-hidden transition-all duration-300 transform',
                    'border-border/20',
                    !isSameMonth(day, currentMonth) ? 'bg-muted/30 text-muted-foreground' : 'hover:scale-105 hover:shadow-xl hover:z-10',
                    isWeekend(day) && isSameMonth(day, currentMonth) && 'bg-purple-500/5 dark:bg-purple-500/10',
                    index % 7 === 0 && 'rounded-bl-xl', // first in row
                    index % 7 === 6 && 'rounded-br-xl', // last in row
                  )}
                  whileHover={{ scale: isSameMonth(day, currentMonth) ? 1.05 : 1, zIndex: 10 }}
                  onClick={() => handleDateClick(day)}
                >
                  {isCurrentDay && <div className="absolute inset-0 rounded-lg animate-pulse-border" />}
                  <span className={cn(
                      'font-semibold', 
                      isCurrentDay && 'text-primary font-bold bg-gradient-to-br from-blue-400 to-purple-500 text-transparent bg-clip-text'
                  )}>
                    {format(day, 'd')}
                  </span>
                  <div className="flex-grow overflow-y-auto mt-1 space-y-1">
                    {items.slice(0, 2).map((item) => (
                      <Tooltip key={item.id}>
                          <TooltipTrigger asChild>
                            <div className={cn(
                                "px-2 py-1 rounded-md text-xs flex items-center gap-1 truncate",
                                'dueDate' in item ? 'bg-blue-500/80 text-white' : 'bg-pink-500/80 text-white'
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
                </motion.div>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {selectedDate && (
             <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-0 right-0 h-full w-full max-w-sm"
              >
              <div className="glass-card h-full p-6 text-card-foreground border-l border-border/20 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-headline text-xl">{format(selectedDate, 'PPP')}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)} className="rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-grow space-y-4 overflow-y-auto">
                    {getItemsForDay(selectedDate).map((item, index) => (
                         <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={cn(
                                'p-3 rounded-lg text-sm',
                                'dueDate' in item ? 'bg-blue-500/20' : 'bg-pink-500/20'
                            )}
                         >
                            <p className="font-semibold">{item.title}</p>
                            {'description' in item && item.description && <p className="text-xs text-muted-foreground">{item.description}</p>}
                         </motion.div>
                    ))}
                    {getItemsForDay(selectedDate).length === 0 && (
                        <p className="text-muted-foreground text-center pt-8">No tasks or events for this day.</p>
                    )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
