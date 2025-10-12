'use client';

import { useState, useEffect } from 'react';
import type { Task } from '@/lib/types';
import { initialTasks } from '@/lib/data';
import { CommandCentreSearch } from '@/components/dashboard/command-centre-search';
import { FloatingNotes } from '@/components/dashboard/floating-notes';
import { TaskAnalytics } from '@/components/dashboard/task-analytics';
import { PriorityTaskColumns } from '@/components/dashboard/priority-task-columns';
import { LiveActivities } from '@/components/dashboard/live-activities';
import { DailySchedule } from '@/components/dashboard/daily-schedule';
import { Button } from '@/components/ui/button';
import { LayoutDashboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { TaskForm } from '@/components/tasks/task-form';


const componentMap = {
  FloatingNotes,
  TaskAnalytics,
  PriorityTaskColumns,
  DailySchedule,
  LiveActivities,
};

type ComponentKey = keyof typeof componentMap;

const initialComponentOrder: ComponentKey[] = [
  'FloatingNotes',
  'TaskAnalytics',
  'PriorityTaskColumns',
  'DailySchedule',
  'LiveActivities',
];

const dashboardComponents: Record<ComponentKey, {title: string, component: React.ComponentType<any>}> = {
    FloatingNotes: { title: 'Floating Notes', component: FloatingNotes },
    TaskAnalytics: { title: 'Task Analytics', component: TaskAnalytics },
    PriorityTaskColumns: { title: 'Priority Tasks', component: PriorityTaskColumns },
    DailySchedule: { title: 'Daily Schedule', component: DailySchedule },
    LiveActivities: { title: 'Live Activities', component: LiveActivities },
};


const SortableItem = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && "opacity-50", "relative group")}>
      <div {...attributes} {...listeners} className="absolute top-2 right-2 p-2 bg-black/20 rounded-full text-white cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <LayoutDashboard className="h-4 w-4" />
      </div>
      {children}
    </div>
  );
};


export default function DashboardPage() {
    const { toast } = useToast();
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [componentOrder, setComponentOrder] = useState<ComponentKey[]>([]);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

    useEffect(() => {
        try {
            const savedOrder = localStorage.getItem('dashboardLayout');
            if (savedOrder) {
                const parsedOrder = JSON.parse(savedOrder) as ComponentKey[];
                const validOrder = parsedOrder.filter(id => initialComponentOrder.includes(id));
                const missingComponents = initialComponentOrder.filter(id => !validOrder.includes(id));
                setComponentOrder([...validOrder, ...missingComponents]);
            } else {
                setComponentOrder(initialComponentOrder);
            }
        } catch (e) {
            setComponentOrder(initialComponentOrder);
        }
    }, []);

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

    const openNewSheet = () => {
      setEditingTask(undefined);
      setIsSheetOpen(true);
    };

    const dailyTasks = [
        { id: '1', title: 'Take the dog for a walk', description: 'Ensure you scoop the poop and take 4 rounds around the apartments. Then serve the food.', dueDate: '2024-03-12T07:00:00', completed: true, priority: 'Medium' },
        { id: '2', title: 'Go to the Cult Fit Classes', description: 'Do legs and triceps with the coach and group', dueDate: '2024-03-12T08:00:00', completed: false, priority: 'High' },
        { id: '3', title: 'Conduct Project Review meeting', description: 'Call on to check all developers, designers and business analysts.', dueDate: '2024-03-12T09:00:00', completed: false, priority: 'High' },
        { id: '4', title: 'Coffee with Clients at Barista', description: 'Greet new client with a coffee at nearby barista from 10:00 to 10:30', dueDate: '2024-03-12T10:00:00', completed: false, priority: 'Medium' },
      ];

  const highPriorityTasks = tasks.filter(t => t.priority === 'High');
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'Medium');
  const lowPriorityTasks = tasks.filter(t => t.priority === 'Low');

  const componentProps: Record<ComponentKey, any> = {
    FloatingNotes: {},
    TaskAnalytics: { tasks: tasks },
    PriorityTaskColumns: { 
        highPriorityTasks,
        mediumPriorityTasks,
        lowPriorityTasks,
    },
    DailySchedule: { tasks: dailyTasks },
    LiveActivities: { tasks: tasks },
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setComponentOrder((items) => {
        const oldIndex = items.findIndex((item) => item === active.id);
        const newIndex = items.findIndex((item) => item === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        try {
            localStorage.setItem('dashboardLayout', JSON.stringify(newOrder));
            toast({ title: 'Dashboard layout saved!' });
        } catch (e) {
            toast({ variant: 'destructive', title: 'Could not save layout' });
        }
        
        return newOrder;
      });
    }
  };
  
  const resetLayout = () => {
    setComponentOrder(initialComponentOrder);
    try {
        localStorage.removeItem('dashboardLayout');
        toast({ title: 'Dashboard layout reset!' });
    } catch (e) {
        toast({ variant: 'destructive', title: 'Could not reset layout' });
    }
  }

  const activeComponent = activeId ? dashboardComponents[activeId as ComponentKey] : null;

  return (
    <>
      <div className="space-y-8 animate-fade-in">
          <div className="flex justify-between items-center">
              <CommandCentreSearch onAddTask={openNewSheet} />
              <Button onClick={resetLayout} variant="outline">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Reset Layout
              </Button>
          </div>

          <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
          >
              <SortableContext items={componentOrder} strategy={verticalListSortingStrategy}>
                  <div className="space-y-8">
                      {componentOrder.map((id) => {
                          const Component = dashboardComponents[id].component;
                          return (
                              <SortableItem key={id} id={id}>
                                  <Component {...componentProps[id]} />
                              </SortableItem>
                          );
                      })}
                  </div>
              </SortableContext>

              {typeof document !== 'undefined' && createPortal(
                  <DragOverlay>
                      {activeComponent ? (
                          <div className="rounded-2xl shadow-2xl scale-105 transform ring-4 ring-primary glow">
                              <activeComponent.component {...componentProps[activeId as ComponentKey]} />
                          </div>
                      ) : null}
                  </DragOverlay>,
                  document.body
              )}
          </DndContext>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="glass-card text-card-foreground border-border/20">
          <SheetHeader>
            <SheetTitle className="font-headline text-2xl">{editingTask ? 'Edit Task' : 'Add New Task'}</SheetTitle>
            <SheetDescription>
              {editingTask ? 'Edit your existing task.' : 'Add a new task to your list.'}
            </SheetDescription>
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

    