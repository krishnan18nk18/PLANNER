import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Book, CalendarDays, CheckCircle } from 'lucide-react';
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
    title: 'Monthly Goals',
    description: 'Set and track your long-term goals for the month.',
    icon: Book,
    href: '/tasks', // Or a new goals page in the future
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
