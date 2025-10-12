'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Smile, Droplet, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';

const initialTasks = [{ id: 1, text: 'Morning workout', completed: false }];
const initialPriorities = ['Finalize report', 'Client call', ''];

export default function DailyPlannerPage() {
  const { toast } = useToast();
  const [date, setDate] = useLocalStorageState('dailyPlanner_date', new Date().toISOString().split('T')[0]);
  const [priorities, setPriorities] = useLocalStorageState('dailyPlanner_priorities', initialPriorities);
  const [tasks, setTasks] = useLocalStorageState('dailyPlanner_tasks', initialTasks);
  const [notes, setNotes] = useLocalStorageState('dailyPlanner_notes', '');
  const [mood, setMood] = useLocalStorageState('dailyPlanner_mood', '');
  const [waterIntake, setWaterIntake] = useLocalStorageState('dailyPlanner_water', 0);

  const handleSave = () => {
    toast({
      title: 'Daily Planner Saved!',
      description: 'Your plan for the day has been saved.',
    });
  };

  const addTask = () => {
    setTasks([...tasks, { id: Date.now(), text: '', completed: false }]);
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const moods = ['😊', '😐', '😢', '🤩', '😴'];

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          Daily Planner
        </h1>
      </div>

      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full md:w-1/2 glass-card"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Top 3 Priorities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {priorities.map((p, i) => (
              <Input
                key={i}
                value={p}
                onChange={(e) => {
                  const newPriorities = [...priorities];
                  newPriorities[i] = e.target.value;
                  setPriorities(newPriorities);
                }}
                placeholder={`Priority ${i + 1}`}
                className="bg-white/10"
              />
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Tasks Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-2 mb-2">
                <Checkbox
                  id={`task-${task.id}`}
                  checked={task.completed}
                  onCheckedChange={(checked) =>
                    setTasks(
                      tasks.map((t) =>
                        t.id === task.id ? { ...t, completed: !!checked } : t
                      )
                    )
                  }
                />
                <Input
                  value={task.text}
                  onChange={(e) =>
                    setTasks(
                      tasks.map((t) =>
                        t.id === task.id ? { ...t, text: e.target.value } : t
                      )
                    )
                  }
                  className="flex-grow bg-transparent border-none focus-visible:ring-0"
                />
                 <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            <Button onClick={addTask} className="mt-2 w-full">Add Task</Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Quick Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Jot down your thoughts..."
              className="h-32 bg-white/5 border-white/20"
            />
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Mood Tracker</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around items-center">
            {moods.map((m) => (
              <Button
                key={m}
                variant={mood === m ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setMood(m)}
                className="text-2xl rounded-full h-12 w-12"
              >
                {m}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Water Intake</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around items-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <Droplet
                key={i}
                className={`h-8 w-8 cursor-pointer transition-colors ${
                  i < waterIntake ? 'text-blue-400 fill-current' : 'text-gray-500'
                }`}
                onClick={() => setWaterIntake(i + 1)}
              />
            ))}
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
