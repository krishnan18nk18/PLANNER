'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';

const initialWeeklyGoals = '1. Complete project proposal\n2. Go to the gym 3 times';
const initialHabits = [
    { name: 'Workout', days: [false, true, false, true, false, true, false] },
    { name: 'Read', days: [true, true, true, true, true, false, false] },
    { name: 'Meditate', days: Array(7).fill(false) },
];

export default function WeeklyPlannerPage() {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [goals, setGoals] = useLocalStorageState('weeklyPlanner_goals', initialWeeklyGoals);
  const [habits, setHabits] = useLocalStorageState('weeklyPlanner_habits', initialHabits);
  const [wins, setWins] = useLocalStorageState('weeklyPlanner_wins', '');
  const [challenges, setChallenges] = useLocalStorageState('weeklyPlanner_challenges', '');

  const handleSave = () => {
    toast({
      title: 'Weekly Planner Saved!',
      description: 'Your plan for the week has been saved.',
    });
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <CalendarDays className="h-8 w-8 text-primary" />
          Weekly Planner
        </h1>
      </div>

       <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</CardTitle>
                 <div className="space-x-2">
                    <Button variant="outline" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}>Prev Week</Button>
                    <Button variant="outline" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>Next Week</Button>
                </div>
            </CardHeader>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <Card key={day} className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-lg">{day}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Textarea placeholder="Tasks..." className="h-24 bg-white/5 border-white/20"/>
                    </CardContent>
                </Card>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Weekly Goals</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea value={goals} onChange={e => setGoals(e.target.value)} className="h-32 bg-white/5 border-white/20"/>
                </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Habit Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                    {habits.map((habit, habitIndex) => (
                        <div key={habitIndex} className="flex items-center justify-between mb-2">
                            <span className="w-24">{habit.name}</span>
                            <div className="flex gap-2">
                                {habit.days.map((done, dayIndex) => (
                                    <Checkbox key={dayIndex} checked={done} onCheckedChange={checked => {
                                        const newHabits = [...habits];
                                        newHabits[habitIndex].days[dayIndex] = !!checked;
                                        setHabits(newHabits);
                                    }}/>
                                ))}
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card className="glass-card">
                <CardHeader><CardTitle>Wins of the Week</CardTitle></CardHeader>
                <CardContent>
                    <Textarea value={wins} onChange={e => setWins(e.target.value)} placeholder="What went well?" className="h-24 bg-white/5 border-white/20" />
                </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader><CardTitle>Challenges Faced</CardTitle></CardHeader>
                <CardContent>
                    <Textarea value={challenges} onChange={e => setChallenges(e.target.value)} placeholder="What could be improved?" className="h-24 bg-white/5 border-white/20" />
                </CardContent>
            </Card>
        </div>


      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}
