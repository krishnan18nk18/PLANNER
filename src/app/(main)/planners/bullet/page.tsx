'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Book, Circle, Check, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { cn } from '@/lib/utils';

const initialHabits = [
  { id: 1, name: 'Workout', days: Array(31).fill(false) },
  { id: 2, name: 'Read', days: Array(31).fill(false) },
];
const initialCollections = [
    { id: 1, title: 'Books to Read', items: ['Dune', 'Project Hail Mary'] },
];

export default function BulletJournalPage() {
  const { toast } = useToast();
  const [habits, setHabits] = useLocalStorageState('bulletJournal_habits', initialHabits);
  const [collections, setCollections] = useLocalStorageState('bulletJournal_collections', initialCollections);
  const [dailyLog, setDailyLog] = useLocalStorageState('bulletJournal_dailyLog', '');

  const handleSave = () => {
    toast({
      title: 'Bullet Journal Saved!',
      description: 'Your journal entries have been saved.',
    });
  };

  const addHabit = () => setHabits([...habits, { id: Date.now(), name: 'New Habit', days: Array(31).fill(false) }]);
  const removeHabit = (id: number) => setHabits(habits.filter(h => h.id !== id));
  
  const toggleHabitDay = (habitId: number, dayIndex: number) => {
    setHabits(habits.map(h => 
        h.id === habitId 
        ? {...h, days: h.days.map((d, i) => i === dayIndex ? !d : d)} 
        : h
    ));
  };
  
  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Book className="h-8 w-8 text-primary" />
          Bullet Journal
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
            <CardHeader><CardTitle>Key</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2"><Check className="h-4 w-4" /> Task</div>
                <div className="flex items-center gap-2"><Circle className="h-4 w-4" /> Event</div>
                <div className="flex items-center gap-2"><Minus className="h-4 w-4" /> Note</div>
            </CardContent>
        </Card>
        <Card className="glass-card">
            <CardHeader><CardTitle>Daily Log</CardTitle></CardHeader>
            <CardContent>
                <Textarea 
                    value={dailyLog}
                    onChange={(e) => setDailyLog(e.target.value)}
                    placeholder="- Start your log here..."
                    className="h-32 bg-white/5 border-white/20"
                />
            </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Habit Tracker</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="space-y-2">
            <div className="flex gap-1">
                <div className="w-28 flex-shrink-0"></div>
                {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className="w-6 text-center text-xs flex-shrink-0">{i + 1}</div>
                ))}
            </div>
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center gap-1">
                <Input value={habit.name} onChange={(e) => setHabits(habits.map(h => h.id === habit.id ? {...h, name: e.target.value} : h))} className="w-28 flex-shrink-0 bg-transparent" />
                {habit.days.map((done, i) => (
                  <button key={i} onClick={() => toggleHabitDay(habit.id, i)} className={cn("w-6 h-6 rounded flex-shrink-0", done ? "bg-green-500" : "bg-white/10")}></button>
                ))}
                 <Button variant="ghost" size="icon" onClick={() => removeHabit(habit.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
          <Button onClick={addHabit} className="mt-4">Add Habit</Button>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader><CardTitle>Collections</CardTitle></CardHeader>
        <CardContent>
            {/* Simplified version */}
            <Textarea
                placeholder="- Books to read..."
                className="h-48 bg-white/5 border-white/20"
            />
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
