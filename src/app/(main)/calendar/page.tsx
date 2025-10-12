import type { Metadata } from 'next';
import { CalendarView } from '@/components/calendar/calendar-view';
import { initialTasks, calendarEvents } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Calendar',
};

export default function CalendarPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">My Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <CalendarView tasks={initialTasks} events={calendarEvents} />
      </CardContent>
    </Card>
  );
}
