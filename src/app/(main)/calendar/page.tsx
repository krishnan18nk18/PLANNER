import type { Metadata } from 'next';
import { CalendarView } from '@/components/calendar/calendar-view';
import { initialTasks, calendarEvents } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Calendar',
};

export default function CalendarPage() {
  return (
    <div className="animate-fade-in">
        <div className="space-y-1 mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">My Calendar</h1>
            <p className="text-muted-foreground">
                Organize your schedule with a modern, interactive calendar.
            </p>
        </div>
        <CalendarView tasks={initialTasks} events={calendarEvents} />
    </div>
  );
}
