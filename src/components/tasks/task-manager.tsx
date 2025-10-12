'use client';

import { useState } from 'react';
import type { Task } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Plus, Check, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { TaskForm } from './task-form';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '../ui/badge';
import { formatDate } from '@/lib/utils';

export function TaskManager({ initialTasks }: { initialTasks: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const handleAddTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    const newTasks = [
      ...tasks,
      { ...taskData, id: Date.now().toString(), completed: false },
    ].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    setTasks(newTasks);
    setIsSheetOpen(false);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    const newTasks = tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    setTasks(newTasks);
    setIsSheetOpen(false);
    setEditingTask(undefined);
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const openEditSheet = (task: Task) => {
    setEditingTask(task);
    setIsSheetOpen(true);
  };
  
  const openNewSheet = () => {
    setEditingTask(undefined);
    setIsSheetOpen(true);
  };

  const priorityGradients = {
    High: 'from-red-500 to-orange-400',
    Medium: 'from-yellow-400 to-orange-400',
    Low: 'from-blue-400 to-purple-400',
  };
  
  const priorityBadge = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'outline',
  } as const;

  return (
    <>
      <div className="relative w-full">
        {/* The timeline connector line */}
        <div className="absolute left-6 md:left-1/2 -ml-px h-full w-0.5 bg-gradient-to-b from-transparent via-border to-transparent" />

        <div className="space-y-12">
            {tasks.map((task, index) => (
                <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                >
                    {/* The dot on the timeline */}
                    <div className={cn(
                        "absolute left-6 md:left-1/2 top-1/2 -ml-[9px] -mt-[9px] w-5 h-5 rounded-full border-4",
                        task.completed ? "bg-green-500 border-background" : "bg-primary border-background"
                    )} />

                    <div className="w-full md:w-[calc(50%-2rem)]">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className={cn(
                                "glass-card text-white p-4 rounded-2xl cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300",
                                "bg-gradient-to-br",
                                task.completed ? "from-green-500/80 to-emerald-600/80" : priorityGradients[task.priority]
                            )}
                            onClick={() => openEditSheet(task)}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg">{task.title}</p>
                                    <p className="text-sm text-white/80">{formatDate(task.dueDate)}</p>
                                </div>
                                <Badge variant={task.completed ? 'default' : priorityBadge[task.priority]} className={cn(task.completed && 'bg-green-600')}>{task.priority}</Badge>
                            </div>
                            {task.description && (
                                <p className="text-sm mt-2 text-white/90">{task.description}</p>
                            )}
                             <div className="flex items-center justify-end gap-2 mt-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-full w-8 h-8 bg-white/20 hover:bg-white/30 text-white"
                                  onClick={(e) => {e.stopPropagation(); handleToggleComplete(task.id)}}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-full w-8 h-8 bg-white/20 hover:bg-white/30 text-white"
                                  onClick={(e) => {e.stopPropagation(); openEditSheet(task)}}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="rounded-full w-8 h-8 bg-red-500/50 hover:bg-red-500/70 text-white"
                                  onClick={(e) => {e.stopPropagation(); handleDeleteTask(task.id)}}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={openNewSheet}
          className="rounded-full w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 hover:scale-110 transition-transform shadow-lg text-white animate-float"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="glass-card text-card-foreground border-border/20">
          <SheetHeader>
            <SheetTitle className="font-headline text-2xl">{editingTask ? 'Edit Task' : 'Add New Task'}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleAddTask}
              task={editingTask}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
