import type { Metadata } from 'next';
import { initialTasks } from '@/lib/data';
import { CommandCentreSearch } from '@/components/dashboard/command-centre-search';
import { FloatingNotes } from '@/components/dashboard/floating-notes';
import { TaskAnalytics } from '@/components/dashboard/task-analytics';
import { PriorityTaskColumns } from '@/components/dashboard/priority-task-columns';
import { LiveActivities } from '@/components/dashboard/live-activities';
import { DailySchedule } from '@/components/dashboard/daily-schedule';


export const metadata: Metadata = {
  title: 'Command Center',
};

export default function DashboardPage() {
    const dailyTasks = [
        { id: '1', title: 'Take the dog for a walk', description: 'Ensure you scoop the poop and take 4 rounds around the apartments. Then serve the food.', dueDate: '2024-03-12T07:00:00', completed: true, priority: 'Medium' },
        { id: '2', title: 'Go to the Cult Fit Classes', description: 'Do legs and triceps with the coach and group', dueDate: '2024-03-12T08:00:00', completed: false, priority: 'High' },
        { id: '3', title: 'Conduct Project Review meeting', description: 'Call on to check all developers, designers and business analysts.', dueDate: '2024-03-12T09:00:00', completed: false, priority: 'High' },
        { id: '4', title: 'Coffee with Clients at Barista', description: 'Greet new client with a coffee at nearby barista from 10:00 to 10:30', dueDate: '2024-03-12T10:00:00', completed: false, priority: 'Medium' },
      ];

  const highPriorityTasks = initialTasks.filter(t => t.priority === 'High');
  const mediumPriorityTasks = initialTasks.filter(t => t.priority === 'Medium');
  const lowPriorityTasks = initialTasks.filter(t => t.priority === 'Low');

  return (
    <div className="space-y-8 animate-fade-in">
        <CommandCentreSearch />

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 space-y-8">
                <FloatingNotes />
                <TaskAnalytics tasks={initialTasks} />
                <PriorityTaskColumns 
                    highPriorityTasks={highPriorityTasks}
                    mediumPriorityTasks={mediumPriorityTasks}
                    lowPriorityTasks={lowPriorityTasks}
                />
            </div>
            <div className="xl:col-span-4 space-y-8">
                <DailySchedule tasks={dailyTasks} />
                <LiveActivities tasks={initialTasks} />
            </div>
        </div>
    </div>
  );
}
