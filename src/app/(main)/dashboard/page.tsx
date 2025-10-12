import type { Metadata } from 'next';
import { StatCards } from '@/components/dashboard/stat-cards';
import { ProgressChart } from '@/components/dashboard/progress-chart';
import { UpcomingReminders } from '@/components/dashboard/upcoming-reminders';
import { initialTasks, calendarEvents } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <StatCards tasks={initialTasks} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart tasks={initialTasks} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <UpcomingReminders tasks={initialTasks} events={calendarEvents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
