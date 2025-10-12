
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, Droplet, Dumbbell, BookOpen, Star, Trash2, Plus, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval } from 'date-fns';
import { cn } from '@/lib/utils';

const iconMap = {
    Droplet,
    Dumbbell,
    BookOpen,
    Sparkles
};

type HabitIcon = keyof typeof iconMap;

const initialGoals = ['Complete project proposal', 'Go to the gym 3 times', 'Read 50 pages of a book'];
const initialHabits: { name: string, icon: HabitIcon, days: boolean[] }[] = [
    { name: 'Water', icon: 'Droplet', days: Array(7).fill(false) },
    { name: 'Workout', icon: 'Dumbbell', days: Array(7).fill(false) },
    { name: 'Read', icon: 'BookOpen', days: Array(7).fill(false) },
    { name: 'Meditate', icon: 'Sparkles', days: Array(7).fill(false) },
];
const initialWeeklySchedule = Array.from({ length: 7 }, () => ({ tasks: [{id: 1, text: '', completed: false}] }));

export default function WeeklyPlannerPage() {
  const { toast } = useToast();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  
  const [goals, setGoals] = useLocalStorageState('weeklyPlanner_goals_v2', initialGoals);
  const [weeklySchedule, setWeeklySchedule] = useLocalStorageState('weeklyPlanner_schedule_v2', initialWeeklySchedule);
  const [habits, setHabits] = useLocalStorageState('weeklyPlanner_habits_v2', initialHabits);
  const [wins, setWins] = useLocalStorageState('weeklyPlanner_wins_v2', '');
  const [challenges, setChallenges] = useLocalStorageState('weeklyPlanner_challenges_v2', '');
  const [nextWeekPrep, setNextWeekPrep] = useLocalStorageState('weeklyPlanner_nextWeekPrep', '');

  const handleSave = () => {
    toast({
      title: 'Weekly Planner Saved!',
      description: 'Your plan for the week has been saved.',
    });
  };

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const addGoal = () => setGoals([...goals, '']);
  const removeGoal = (index: number) => setGoals(goals.filter((_, i) => i !== index));
  const updateGoal = (index: number, value: string) => {
    const newGoals = [...goals];
    newGoals[index] = value;
    setGoals(newGoals);
  }

  const addTask = (dayIndex: number) => {
    const newSchedule = [...weeklySchedule];
    newSchedule[dayIndex].tasks.push({ id: Date.now(), text: '', completed: false });
    setWeeklySchedule(newSchedule);
  }

  const removeTask = (dayIndex: number, taskId: number) => {
    const newSchedule = [...weeklySchedule];
    newSchedule[dayIndex].tasks = newSchedule[dayIndex].tasks.filter(t => t.id !== taskId);
    setWeeklySchedule(newSchedule);
  }

  const updateTask = (dayIndex: number, taskId: number, text: string) => {
    const newSchedule = [...weeklySchedule];
    const task = newSchedule[dayIndex].tasks.find(t => t.id === taskId);
    if(task) task.text = text;
    setWeeklySchedule(newSchedule);
  }

  const toggleTask = (dayIndex: number, taskId: number) => {
    const newSchedule = [...weeklySchedule];
    const task = newSchedule[dayIndex].tasks.find(t => t.id === taskId);
    if(task) task.completed = !task.completed;
    setWeeklySchedule(newSchedule);
  }


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
                <CardTitle className="font-headline text-xl">Week of {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</CardTitle>
                 <div className="space-x-2">
                    <Button variant="outline" onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}><ChevronLeft className="h-4 w-4 mr-2"/>Prev Week</Button>
                    <Button variant="outline" onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}>Next Week <ChevronRight className="h-4 w-4 ml-2"/></Button>
                </div>
            </CardHeader>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Star className="text-yellow-400"/> Top Weekly Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {goals.map((goal, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-white/10 rounded-lg">
                           <span className="font-bold text-primary">{index + 1}.</span>
                           <Input value={goal} onChange={(e) => updateGoal(index, e.target.value)} className="bg-transparent border-none focus-visible:ring-0" placeholder="New goal..."/>
                           <Button variant="ghost" size="icon" onClick={() => removeGoal(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    ))}
                    <Button onClick={addGoal} className="w-full mt-2"><Plus className="mr-2 h-4 w-4"/> Add Goal</Button>
                </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Habit Tracker</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-end gap-2 text-xs text-muted-foreground">
                        {weekDays.map(day => <div key={day.toString()} className="w-6 text-center">{format(day, 'E')}</div>)}
                    </div>
                    {habits.map((habit, habitIndex) => {
                        const Icon = iconMap[habit.icon];
                        return (
                        <div key={habitIndex} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {Icon && <Icon className="h-5 w-5 text-primary" />}
                                <span>{habit.name}</span>
                            </div>
                            <div className="flex gap-2">
                                {habit.days.map((done, dayIndex) => (
                                    <Checkbox key={dayIndex} checked={done} onCheckedChange={checked => {
                                        const newHabits = [...habits];
                                        newHabits[habitIndex].days[dayIndex] = !!checked;
                                        setHabits(newHabits);
                                    }} className="w-6 h-6"/>
                                ))}
                            </div>
                        </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            {weekDays.map((day, dayIndex) => (
                <Card key={day.toString()} className="glass-card">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold">{format(day, 'EEEE')}</CardTitle>
                        <p className="text-sm text-muted-foreground">{format(day, 'MMM d')}</p>
                    </CardHeader>
                    <CardContent>
                        {weeklySchedule[dayIndex].tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-2 mb-2 group">
                                <Checkbox checked={task.completed} onCheckedChange={() => toggleTask(dayIndex, task.id)} />
                                <Input value={task.text} onChange={(e) => updateTask(dayIndex, task.id, e.target.value)} placeholder="New task..." className="bg-transparent text-sm h-8 border-0 focus-visible:ring-0" />
                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeTask(dayIndex, task.id)}><Trash2 className="h-3 w-3 text-destructive"/></Button>
                            </div>
                        ))}
                        <Button variant="outline" size="sm" onClick={() => addTask(dayIndex)} className="w-full mt-2 h-8 text-xs"><Plus className="mr-1 h-3 w-3"/> Add Task</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
             <Card className="glass-card">
                <CardHeader><CardTitle>Wins of the Week</CardTitle></CardHeader>
                <CardContent>
                    <Textarea value={wins} onChange={e => setWins(e.target.value)} placeholder="What went well? Celebrate your achievements!" className="h-24 bg-white/5 border-white/20"/>
                </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader><CardTitle>Challenges & Improvements</CardTitle></CardHeader>
                <CardContent>
                    <Textarea value={challenges} onChange={e => setChallenges(e.target.value)} placeholder="What could be improved? How can you make next week even better?" className="h-24 bg-white/5 border-white/20" />
                </CardContent>
            </Card>
        </div>
        
        <Card className="glass-card">
            <CardHeader><CardTitle>Prepare for Next Week</CardTitle></CardHeader>
            <CardContent>
                <Textarea value={nextWeekPrep} onChange={(e) => setNextWeekPrep(e.target.value)} placeholder="What are your top priorities for next week? Any upcoming deadlines?" className="h-32 bg-white/5 border-white/20"/>
            </CardContent>
        </Card>


      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}
