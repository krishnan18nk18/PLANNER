import type { Metadata } from 'next';
import { TaskManager } from '@/components/tasks/task-manager';
import { initialTasks } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Tasks',
};

export default function TasksPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-6 font-headline">My Tasks</h1>
      <TaskManager initialTasks={initialTasks} />
    </div>
  );
}
