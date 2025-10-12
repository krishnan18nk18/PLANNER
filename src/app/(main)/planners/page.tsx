'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import {
  ArrowRight,
  Book,
  CalendarDays,
  CheckCircle,
  PiggyBank,
  GraduationCap,
  Briefcase,
  Users,
  Feather,
  Heart,
  Plane,
  Utensils,
  Calendar as CalendarIcon,
  Target,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

const initialPlannerTypes = [
  { id: '1', title: 'Daily Planner', description: 'Organize your day with a detailed to-do list.', icon: CheckCircle, href: '/tasks', gradient: 'from-blue-400 to-blue-600', hasToggle: true },
  { id: '2', title: 'Weekly Planner', description: 'Get a bird\'s eye view of your week.', icon: CalendarDays, href: '/calendar', gradient: 'from-purple-400 to-purple-600', hasToggle: true },
  { id: '3', title: 'Monthly Planner', description: 'Plan your month and set goals.', icon: CalendarIcon, href: '/calendar', gradient: 'from-pink-400 to-pink-600', hasToggle: true },
  { id: '4', title: 'Annual/Yearly Planner', description: 'Set your vision for the entire year.', icon: Book, href: '/tasks', gradient: 'from-green-400 to-green-600', hasToggle: true },
  { id: '5', title: 'Goal Planner', description: 'Define and track your personal goals.', icon: Target, href: '/tasks', gradient: 'from-yellow-400 to-yellow-600', hasToggle: true },
  { id: '6', title: 'Productivity Planner', description: 'Boost your efficiency and focus.', icon: Briefcase, href: '/tasks', gradient: 'from-indigo-400 to-indigo-600', hasToggle: true },
  { id: '7', title: 'Health and Fitness Planner', description: 'Track workouts, meals, and wellness.', icon: Heart, href: '/tasks', gradient: 'from-red-400 to-red-600', hasToggle: true },
  { id: '8', title: 'Meal/Diet Planner', description: 'Plan your meals and track nutrition.', icon: Utensils, href: '/tasks', gradient: 'from-orange-400 to-orange-600', hasToggle: true },
  { id: '9', title: 'Budget/Financial Planner', description: 'Manage your finances and savings.', icon: PiggyBank, href: '/tasks', gradient: 'from-teal-400 to-teal-600', hasToggle: true },
  { id: '10', title: 'Academic/Study Planner', description: 'Organize studies and assignments.', icon: GraduationCap, href: '/tasks', gradient: 'from-cyan-400 to-cyan-600', hasToggle: true },
  { id: '11', title: 'Work Planner', description: 'Manage your work tasks and projects.', icon: Briefcase, href: '/tasks', gradient: 'from-gray-400 to-gray-600', hasToggle: true },
  { id: '12', title: 'Family Planner', description: 'Coordinate schedules for the family.', icon: Users, href: '/calendar', gradient: 'from-rose-400 to-rose-600', hasToggle: true },
  { id: '13', title: 'Bullet Journal', description: 'A flexible and creative organization.', icon: Feather, href: '/tasks', gradient: 'from-lime-400 to-lime-600', hasToggle: true },
  { id: '14', title: 'Wedding/Event Planner', description: 'Plan every detail of your special day.', icon: Heart, href: '/calendar', gradient: 'from-fuchsia-400 to-fuchsia-600', hasToggle: true },
  { id: '15', title: 'Travel/Trip Planner', description: 'Organize your itinerary and bookings.', icon: Plane, href: '/tasks', gradient: 'from-sky-400 to-sky-600', hasToggle: true },
];

type PlannerType = typeof initialPlannerTypes[0] & { enabled?: boolean };

function SortablePlannerCard({ planner, onToggle }: { planner: PlannerType; onToggle: (id: string, enabled: boolean) => void; }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: planner.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PlannerCard planner={planner} onToggle={onToggle} dragAttributes={attributes} dragListeners={listeners} />
    </div>
  );
}

function PlannerCard({ planner, onToggle, dragAttributes, dragListeners }: { planner: PlannerType; onToggle?: (id: string, enabled: boolean) => void; dragAttributes?: any; dragListeners?: any; }) {
    const isEnabled = planner.enabled ?? true;

    return (
        <div
        className={cn(
          'relative rounded-2xl bg-gradient-to-br shadow-xl hover:shadow-2xl transition-all duration-300 transform animate-fade-in text-white h-full',
          isEnabled ? planner.gradient : 'from-gray-500 to-gray-700',
          !isEnabled && 'opacity-70 grayscale',
          'hover:scale-105'
        )}
      >
        {planner.hasToggle && onToggle && (
            <div className="absolute top-4 right-4 z-10">
                <Switch
                    checked={isEnabled}
                    onCheckedChange={(checked) => onToggle(planner.id, checked)}
                />
            </div>
        )}
        
          <Card className="bg-transparent border-none h-full flex flex-col cursor-grab" {...dragAttributes} {...dragListeners}>
            <CardHeader>
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-white/20 rounded-lg">
                  <planner.icon className="w-8 h-8" />
                </div>
                <CardTitle className="font-headline text-xl">{planner.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-200">{planner.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <div className="w-full flex justify-end">
                  {isEnabled && (
                     <Button asChild variant="ghost" className="bg-white/20 hover:bg-white/30 rounded-full w-12 h-12">
                        <Link href={planner.href} className="cursor-pointer">
                            <ArrowRight className="h-6 w-6 text-white" />
                        </Link>
                    </Button>
                  )}
              </div>
            </CardContent>
          </Card>
      </div>
    )
}

export default function PlannersPage() {
  const [planners, setPlanners] = useState<PlannerType[]>([]);
  const [activePlanner, setActivePlanner] = useState<PlannerType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem('plannerOrder');
      const savedStates = JSON.parse(localStorage.getItem('plannerStates') || '{}') as Record<string, boolean>;

      const plannersWithState = initialPlannerTypes.map(p => ({
        ...p,
        enabled: savedStates[p.id] !== undefined ? savedStates[p.id] : true
      }));

      if (savedOrder) {
        const orderedIds = JSON.parse(savedOrder) as string[];
        const orderedPlanners = orderedIds.map(id => plannersWithState.find(p => p.id === id)).filter(Boolean) as PlannerType[];
        const remainingPlanners = plannersWithState.filter(p => !orderedIds.includes(p.id));
        setPlanners([...orderedPlanners, ...remainingPlanners]);
      } else {
        setPlanners(plannersWithState);
      }
    } catch (e) {
        setPlanners(initialPlannerTypes.map(p => ({...p, enabled: true})));
    }
  }, []);

  const handleTogglePlanner = (id: string, enabled: boolean) => {
    const newPlanners = planners.map(p => p.id === id ? { ...p, enabled } : p);
    setPlanners(newPlanners);

    try {
        const plannerStates = newPlanners.reduce((acc, p) => {
            acc[p.id] = p.enabled ?? true;
            return acc;
        }, {} as Record<string, boolean>);
        localStorage.setItem('plannerStates', JSON.stringify(plannerStates));
        const planner = newPlanners.find(p => p.id === id);
        toast({
            title: `${planner?.title} ${enabled ? 'enabled' : 'disabled'}!`,
        });
    } catch (e) {
        toast({
            variant: 'destructive',
            title: 'Could not save planner state',
        });
    }
  }


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActivePlanner(planners.find(p => p.id === active.id) || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActivePlanner(null);

    if (over && active.id !== over.id) {
      setPlanners((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        try {
            localStorage.setItem('plannerOrder', JSON.stringify(newOrder.map(p => p.id)));
            toast({
                title: 'Planner arrangement saved!',
            });
        } catch (e) {
            toast({
                variant: 'destructive',
                title: 'Could not save arrangement',
            });
        }
        
        return newOrder;
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Planners</h1>
        <p className="text-muted-foreground">
          Choose a planner to get started with organizing your life. Drag and drop to rearrange.
        </p>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={planners.map(p => p.id)} strategy={rectSortingStrategy}>
          <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {planners.map((planner) => (
              <SortablePlannerCard key={planner.id} planner={planner} onToggle={handleTogglePlanner} />
            ))}
          </div>
        </SortableContext>
        {typeof document !== 'undefined' && createPortal(
            <DragOverlay>
                {activePlanner ? (
                    <div className="rounded-2xl bg-gradient-to-br shadow-2xl scale-110 transform text-white ring-4 ring-primary glow">
                        <PlannerCard planner={activePlanner} />
                    </div>
                ) : null}
            </DragOverlay>,
            document.body
        )}
      </DndContext>
    </div>
  );
}

    