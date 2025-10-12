import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  Scale,
  Utensils,
  Calendar as CalendarIcon,
  Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Planners',
};

const plannerTypes = [
  {
    title: 'Daily Planner',
    description: 'Organize your day with a detailed to-do list and schedule.',
    icon: CheckCircle,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
  {
    title: 'Weekly Planner',
    description: 'Get a bird\'s eye view of your week and plan ahead.',
    icon: CalendarDays,
    href: '/calendar',
    cta: 'Go to Calendar',
  },
  {
    title: 'Monthly Planner',
    description: 'Plan your month, set goals, and track important dates.',
    icon: CalendarIcon,
    href: '/calendar',
    cta: 'Go to Calendar',
  },
  {
    title: 'Annual/Yearly Planner',
    description: 'Set your vision and goals for the entire year.',
    icon: Book,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
  {
    title: 'Goal Planner',
    description: 'Define and track your personal and professional goals.',
    icon: Target,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
  {
    title: 'Productivity Planner',
    description: 'Boost your efficiency and focus on what matters most.',
    icon: Briefcase,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
  {
    title: 'Health and Fitness Planner',
    description: 'Track workouts, meals, and wellness goals.',
    icon: Heart,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
  {
    title: 'Meal/Diet Planner',
    description: 'Plan your meals and track your nutrition.',
    icon: Utensils,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
  {
    title: 'Budget/Financial Planner',
    description: 'Manage your finances, savings, and expenses.',
    icon: PiggyBank,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
  {
    title: 'Academic/Study Planner',
    description: 'Organize your studies, assignments, and exams.',
    icon: GraduationCap,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
  {
    title: 'Work Planner',
    description: 'Manage your work tasks, projects, and deadlines.',
    icon: Briefcase,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
  {
    title: 'Family Planner',
    description: 'Coordinate schedules and activities for the whole family.',
    icon: Users,
    href: '/calendar',
    cta: 'Go to Calendar',
  },
  {
    title: 'Bullet Journal',
    description: 'A flexible and creative way to organize your life.',
    icon: Feather,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
  {
    title: 'Wedding/Event Planner',
    description: 'Plan every detail of your special occasion.',
    icon: Heart,
    href: '/calendar',
    cta: 'Go to Calendar',
  },
  {
    title: 'Travel/Trip Planner',
    description: 'Organize your itinerary, bookings, and packing lists.',
    icon: Plane,
    href: '/tasks',
    cta: 'Go to Tasks',
  },
];


export default function PlannersPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Planners</h1>
        <p className="text-muted-foreground">
          Choose a planner to get started with organizing your life.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {plannerTypes.map((planner) => (
          <Card key={planner.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <planner.icon className="w-8 h-8 text-primary" />
                <CardTitle className="font-headline text-xl">{planner.title}</CardTitle>
              </div>
              <CardDescription>{planner.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Button asChild className="w-full">
                <Link href={planner.href}>
                  {planner.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
