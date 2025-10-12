import type { Metadata } from 'next';
import { UserProfile } from '@/components/dashboard/user-profile';
import { GoalProgress } from '@/components/dashboard/goal-progress';
import { LiveWebinar } from '@/components/dashboard/live-webinar';
import { DailySchedule } from '@/components/dashboard/daily-schedule';
import { WeeklyPlanner } from '@/components/dashboard/weekly-planner';
import { initialTasks } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default function DashboardPage() {
  const dailyTasks = [
    { id: '1', title: 'Take the dog for a walk', description: 'Ensure you scoop the poop and take 4 rounds around the apartments. Then serve the food.', dueDate: '2024-03-12T07:00:00', completed: true, priority: 'Medium' },
    { id: '2', title: 'Go to the Cult Fit Classes', description: 'Do legs and triceps with the coach and group', dueDate: '2024-03-12T08:00:00', completed: false, priority: 'High' },
    { id: '3', title: 'Conduct Project Review meeting', description: 'Call on to check all developers, designers and business analysts.', dueDate: '2024-03-12T09:00:00', completed: false, priority: 'High' },
    { id: '4', title: 'Coffee with Clients at Barista', description: 'Greet new client with a coffee at nearby barista from 10:00 to 10:30', dueDate: '2024-03-12T10:00:00', completed: false, priority: 'Medium' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
      <div className="lg:col-span-4 space-y-6">
        <WeeklyPlanner />
      </div>
      <div className="lg:col-span-5 space-y-6">
        <DailySchedule tasks={dailyTasks} />
      </div>
      <div className="lg:col-span-3 space-y-6">
        <UserProfile />
        <LiveWebinar />
        <GoalProgress />
      </div>
    </div>
  );
}
