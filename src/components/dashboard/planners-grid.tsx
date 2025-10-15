
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
import { useUser, useFirestore, useDoc } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
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
  Timer
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const allPlanners = [
  { id: 'daily', title: 'Daily Planner', description: 'Organize your day with a detailed to-do list.', icon: CheckCircle, href: '/planners/daily', gradient: 'from-blue-400 to-blue-600' },
  { id: 'weekly', title: 'Weekly Planner', description: 'Get a bird\'s eye view of your week.', icon: CalendarDays, href: '/planners/weekly', gradient: 'from-purple-400 to-purple-600' },
  { id: 'monthly', title: 'Monthly Planner', description: 'Plan your month and set goals.', icon: CalendarIcon, href: '/planners/monthly', gradient: 'from-pink-400 to-pink-600' },
  { id: 'annual', title: 'Annual/Yearly Planner', description: 'Set your vision for the entire year.', icon: Book, href: '/planners/annual', gradient: 'from-green-400 to-green-600' },
  { id: 'goal', title: 'Goal Planner', description: 'Define and track your personal goals.', icon: Target, href: '/planners/goal', gradient: 'from-yellow-400 to-yellow-600' },
  { id: 'productivity', title: 'Productivity Planner', description: 'Boost your efficiency and focus.', icon: Timer, href: '/planners/productivity', gradient: 'from-indigo-400 to-indigo-600' },
  { id: 'health', title: 'Health and Fitness Planner', description: 'Track workouts, meals, and wellness.', icon: Heart, href: '/planners/health', gradient: 'from-red-400 to-red-600' },
  { id: 'meal', title: 'Meal/Diet Planner', description: 'Plan your meals and track nutrition.', icon: Utensils, href: '/planners/meal', gradient: 'from-orange-400 to-orange-600' },
  { id: 'budget', title: 'Budget/Financial Planner', description: 'Manage your finances and savings.', icon: PiggyBank, href: '/planners/budget', gradient: 'from-teal-400 to-teal-600' },
  { id: 'academic', title: 'Academic/Study Planner', description: 'Organize studies and assignments.', icon: GraduationCap, href: '/planners/academic', gradient: 'from-cyan-400 to-cyan-600' },
  { id: 'work', title: 'Work Planner', description: 'Manage your work tasks and projects.', icon: Briefcase, href: '/planners/work', gradient: 'from-gray-400 to-gray-600' },
  { id: 'family', title: 'Family Planner', description: 'Coordinate schedules for the family.', icon: Users, href: '/planners/family', gradient: 'from-rose-400 to-rose-600' },
  { id: 'bullet', title: 'Bullet Journal', description: 'A flexible and creative organization.', icon: Feather, href: '/planners/bullet', gradient: 'from-lime-400 to-lime-600' },
  { id: 'wedding', title: 'Wedding/Event Planner', description: 'Plan every detail of your special day.', icon: Heart, href: '/planners/wedding', gradient: 'from-fuchsia-400 to-fuchsia-600' },
  { id: 'travel', title: 'Travel/Trip Planner', description: 'Organize your itinerary and bookings.', icon: Plane, href: '/planners/travel', gradient: 'from-sky-400 to-sky-600' },
];

type PlannerConfig = {
    order: string[];
};
type PlannerType = typeof allPlanners[0];

function SortablePlannerCard({ planner }: { planner: PlannerType; }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: planner.id });

  const style = {
    transform: transform ? CSS.Transform.toString(transform) : undefined,
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <PlannerCard planner={planner} dragAttributes={attributes} dragListeners={listeners} />
    </div>
  );
}

function PlannerCard({ planner, dragAttributes, dragListeners }: { planner: PlannerType; dragAttributes?: any; dragListeners?: any; }) {

    return (
        <div
        className={cn(
          'relative rounded-2xl bg-gradient-to-br shadow-xl hover:shadow-2xl transition-all duration-300 transform animate-fade-in text-white h-full',
          planner.gradient,
          'hover:scale-105'
        )}
      >
        
          <div className="bg-transparent border-none h-full flex flex-col" >
            <div {...dragAttributes} {...dragListeners} className="cursor-grab flex-grow p-6 pb-0">
              <div className="flex items-center gap-4 mb-2">
                <div className="p-3 bg-white/20 rounded-lg">
                  <planner.icon className="w-8 h-8" />
                </div>
                <CardTitle className="font-headline text-xl">{planner.title}</CardTitle>
              </div>
              <CardDescription className="text-gray-200">{planner.description}</CardDescription>
            </div>
            <CardContent className="flex items-end p-6 pt-0">
              <div className="w-full flex justify-end">
                     <Button asChild variant="ghost" className="bg-white/20 hover:bg-white/30 rounded-full w-12 h-12">
                        <Link href={planner.href} className="cursor-pointer">
                            <ArrowRight className="h-6 w-6 text-white" />
                        </Link>
                    </Button>
              </div>
            </CardContent>
          </div>
      </div>
    )
}

export function PlannersGrid() {
  const { user } = useUser();
  const { db } = useFirestore();
  const { data: plannerConfig, loading } = useDoc<PlannerConfig>(user ? `users/${user.uid}/planners/config` : null);
  
  const [planners, setPlanners] = useState<PlannerType[]>([]);
  const [activePlanner, setActivePlanner] = useState<PlannerType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (plannerConfig) {
      const orderedPlanners = plannerConfig.order.map(id => allPlanners.find(p => p.id === id)).filter(Boolean) as PlannerType[];
      const remainingPlanners = allPlanners.filter(p => !plannerConfig.order.includes(p.id));
      setPlanners([...orderedPlanners, ...remainingPlanners]);

    } else if (!loading) {
       setPlanners(allPlanners);
    }
  }, [plannerConfig, loading]);

  const savePlannerConfig = (config: PlannerConfig) => {
    if (!user || !db) return;
    const docRef = doc(db, 'users', user.uid, 'planners', 'config');
    setDoc(docRef, config)
        .catch(err => errorEmitter.emit('permission-error', new FirestorePermissionError({path: docRef.path, operation: 'write', requestResourceData: config})));
  };

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
        
        const newConfig = {
            order: newOrder.map(p => p.id),
        }
        savePlannerConfig(newConfig);
        
        toast({
            title: 'Planner arrangement saved!',
        });
        
        return newOrder;
      });
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight font-headline">Your Planners</h2>
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
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-3">
            {planners.map((planner) => (
              <SortablePlannerCard key={planner.id} planner={planner} />
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
