'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Smile, Droplet, Trash2, Sun, Cloud, CloudRain, Plus, Star, Dumbbell, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const initialTasks = [{ id: 1, text: 'Morning workout', completed: false, category: 'Health' }];
const initialPriorities = ['Finalize report', 'Client call', ''];
const initialHabits = [
    { id: 1, name: 'Read', completed: false },
    { id: 2, name: 'Meditate', completed: true },
    { id: 3, name: 'No Sugar', completed: false },
];

const categoryColors: Record<string, string> = {
    'Work': 'text-blue-400',
    'Health': 'text-green-400',
    'Personal': 'text-purple-400',
    'default': 'text-gray-400',
}

export default function DailyPlannerPage() {
  const { toast } = useToast();
  const [date, setDate] = useLocalStorageState('dailyPlanner_date', new Date().toISOString().split('T')[0]);
  const [priorities, setPriorities] = useLocalStorageState('dailyPlanner_priorities', initialPriorities);
  const [tasks, setTasks] = useLocalStorageState('dailyPlanner_tasks', initialTasks);
  const [habits, setHabits] = useLocalStorageState('dailyPlanner_habits', initialHabits);
  const [notes, setNotes] = useLocalStorageState('dailyPlanner_notes', '');
  const [gratitude, setGratitude] = useLocalStorageState('dailyPlanner_gratitude', '');
  const [mood, setMood] = useLocalStorageState('dailyPlanner_mood', '');
  const [waterIntake, setWaterIntake] = useLocalStorageState('dailyPlanner_water', 0);
  const [exercise, setExercise] = useLocalStorageState('dailyPlanner_exercise', { type: '', duration: '', notes: ''});

  const handleSave = () => {
    toast({
      title: 'Daily Planner Saved!',
      description: 'Your plan for the day has been saved.',
    });
  };

  const addTask = () => setTasks([...tasks, { id: Date.now(), text: '', completed: false, category: 'Personal' }]);
  const removeTask = (id: number) => setTasks(tasks.filter(task => task.id !== id));
  
  const moods = ['😊', '😐', '😢', '🤩', '😴'];
  const weather = { temp: 24, condition: 'Sunny', icon: <Sun className="h-10 w-10 text-yellow-400" /> };

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          Daily Planner
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto bg-transparent border-none text-2xl font-bold p-0 focus-visible:ring-0" />
              <p className="text-muted-foreground">{format(new Date(date), 'EEEE')}</p>
            </div>
            <div className="flex items-center gap-2 text-right">
                <div>
                    <p className="text-4xl font-bold">{weather.temp}°C</p>
                    <p className="text-muted-foreground">{weather.condition}</p>
                </div>
                {weather.icon}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card from-purple-500/30 to-blue-500/30">
            <CardHeader><CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-yellow-300"/> Daily Affirmation</CardTitle></CardHeader>
            <CardContent>
                <Textarea defaultValue="I am capable of achieving great things." className="bg-transparent border-none text-lg italic text-center focus-visible:ring-0"/>
            </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Top 3 Priorities</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {priorities.map((p, i) => (
            <div key={i} className="glass-card bg-gradient-to-br from-blue-500/50 to-purple-600/50 p-4 rounded-xl">
              <Input
                value={p}
                onChange={(e) => {
                  const newPriorities = [...priorities];
                  newPriorities[i] = e.target.value;
                  setPriorities(newPriorities);
                }}
                placeholder={`Priority ${i + 1}`}
                className="bg-transparent border-none text-white font-bold text-lg focus-visible:ring-0"
              />
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <Card className="glass-card">
              <CardHeader><CardTitle>Tasks Checklist</CardTitle></CardHeader>
              <CardContent>
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                     <div className={cn("w-1 h-8 rounded-full", categoryColors[task.category] || categoryColors.default)}></div>
                    <Checkbox id={`task-${task.id}`} checked={task.completed} onCheckedChange={(checked) => setTasks(tasks.map((t) => t.id === task.id ? { ...t, completed: !!checked } : t))}/>
                    <Input value={task.text} onChange={(e) => setTasks(tasks.map((t) => t.id === task.id ? { ...t, text: e.target.value } : t))} className="flex-grow bg-transparent border-none focus-visible:ring-0"/>
                    <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                ))}
                <Button onClick={addTask} className="mt-2 w-full"><Plus className="h-4 w-4 mr-2"/>Add Task</Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader><CardTitle>Gratitude</CardTitle></CardHeader>
              <CardContent>
                <Textarea value={gratitude} onChange={(e) => setGratitude(e.target.value)} placeholder="What are you grateful for today?" className="h-24 bg-white/5 border-white/20"/>
              </CardContent>
            </Card>
        </div>
        <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader><CardTitle>Mood Tracker</CardTitle></CardHeader>
              <CardContent className="flex justify-around items-center">
                {moods.map((m) => (
                  <Button key={m} variant={mood === m ? 'default' : 'ghost'} size="icon" onClick={() => setMood(m)} className="text-2xl rounded-full h-12 w-12 hover:scale-125 transition-transform">
                    {m}
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader><CardTitle>Water Intake</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Droplet
                    key={i}
                    className={`h-10 w-10 cursor-pointer transition-all duration-300 ${i < waterIntake ? 'text-blue-400 fill-current scale-110' : 'text-gray-500'}`}
                    onClick={() => setWaterIntake(i + 1)}
                  />
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader><CardTitle className="flex items-center gap-2"><Dumbbell className="h-5 w-5"/> Exercise Log</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                <Input value={exercise.type} onChange={e => setExercise({...exercise, type: e.target.value})} placeholder="Exercise type (e.g., Running)" className="bg-white/10"/>
                <Input value={exercise.duration} onChange={e => setExercise({...exercise, duration: e.target.value})} placeholder="Duration (e.g., 30 mins)" className="bg-white/10"/>
              </CardContent>
            </Card>
             <Card className="glass-card">
              <CardHeader><CardTitle className="flex items-center gap-2"><Star className="h-5 w-5"/> Habit Tracker</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {habits.map(habit => (
                    <div key={habit.id} className="flex items-center justify-between p-2 bg-white/10 rounded-lg">
                        <label htmlFor={`habit-${habit.id}`}>{habit.name}</label>
                        <Checkbox id={`habit-${habit.id}`} checked={habit.completed} onCheckedChange={checked => setHabits(habits.map(h => h.id === habit.id ? {...h, completed: !!checked} : h))}/>
                    </div>
                ))}
              </CardContent>
            </Card>
        </div>
      </div>
       <Card className="glass-card">
        <CardHeader><CardTitle>Notes & Journaling</CardTitle></CardHeader>
        <CardContent>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Jot down your thoughts, ideas, or reminders..." className="h-40 bg-white/5 border-white/20"/>
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
