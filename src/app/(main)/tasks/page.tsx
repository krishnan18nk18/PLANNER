'use client';

import type { Metadata } from 'next';
import { TaskManager } from '@/components/tasks/task-manager';
import { initialTasks } from '@/lib/data';
import { useState } from 'react';
import type { Task } from '@/lib/types';

const metadata: Metadata = {
  title: 'Tasks',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  return (
    <div className="animate-fade-in">
      <div className="space-y-1 mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">My Task Journey</h1>
        <p className="text-muted-foreground">
            Scroll through your tasks like a map, from start to finish.
        </p>
      </div>
      <TaskManager initialTasks={tasks} setTasks={setTasks} />
    </div>
  );
}

    