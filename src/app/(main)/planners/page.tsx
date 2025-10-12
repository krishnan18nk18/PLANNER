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
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Planners',
};

const plannerTypes = [
  { title: 'Daily Planner', description: 'Organize your day with a detailed to-do list.', icon: CheckCircle, href: '/tasks', gradient: 'from-blue-400 to-blue-600' },
  { title: 'Weekly Planner', description: 'Get a bird\'s eye view of your week.', icon: CalendarDays, href: '/calendar', gradient: 'from-purple-400 to-purple-600' },
  { title: 'Monthly Planner', description: 'Plan your month and set goals.', icon: CalendarIcon, href: '/calendar', gradient: 'from-pink-400 to-pink-600' },
  { title: 'Annual/Yearly Planner', description: 'Set your vision for the entire year.', icon: Book, href: '/tasks', gradient: 'from-green-400 to-green-600' },
  { title: 'Goal Planner', description: 'Define and track your personal goals.', icon: Target, href: '/tasks', gradient: 'from-yellow-400 to-yellow-600' },
  { title: 'Productivity Planner', description: 'Boost your efficiency and focus.', icon: Briefcase, href: '/tasks', gradient: 'from-indigo-400 to-indigo-600' },
  { title: 'Health and Fitness Planner', description: 'Track workouts, meals, and wellness.', icon: Heart, href: '/tasks', gradient: 'from-red-400 to-red-600' },
  { title: 'Meal/Diet Planner', description: 'Plan your meals and track nutrition.', icon: Utensils, href: '/tasks', gradient: 'from-orange-400 to-orange-600' },
  { title: 'Budget/Financial Planner', description: 'Manage your finances and savings.', icon: PiggyBank, href: '/tasks', gradient: 'from-teal-400 to-teal-600' },
  { title: 'Academic/Study Planner', description: 'Organize studies and assignments.', icon: GraduationCap, href: '/tasks', gradient: 'from-cyan-400 to-cyan-600' },
  { title: 'Work Planner', description: 'Manage your work tasks and projects.', icon: Briefcase, href: '/tasks', gradient: 'from-gray-400 to-gray-600' },
  { title: 'Family Planner', description: 'Coordinate schedules for the family.', icon: Users, href: '/calendar', gradient: 'from-rose-400 to-rose-600' },
  { title: 'Bullet Journal', description: 'A flexible and creative organization.', icon: Feather, href: '/tasks', gradient: 'from-lime-400 to-lime-600' },
  { title: 'Wedding/Event Planner', description: 'Plan every detail of your special day.', icon: Heart, href: '/calendar', gradient: 'from-fuchsia-400 to-fuchsia-600' },
  { title: 'Travel/Trip Planner', description: 'Organize your itinerary and bookings.', icon: Plane, href: '/tasks', gradient: 'from-sky-400 to-sky-600' },
];


export default function PlannersPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight font-headline text-white">Planners</h1>
        <p className="text-gray-300">
          Choose a planner to get started with organizing your life.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        {plannerTypes.map((planner, i) => (
          <div
            key={planner.title}
            className={cn(
              'rounded-2xl bg-gradient-to-br shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 transform animate-fade-in',
              planner.gradient
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <Link href={planner.href} className="block h-full">
              <Card className="bg-transparent border-none text-white h-full flex flex-col">
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
                      <ArrowRight className="h-6 w-6" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}