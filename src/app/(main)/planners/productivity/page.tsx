'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Timer, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';

const initialMatrix = {
    urgentImportant: [],
    notUrgentImportant: [],
    urgentNotImportant: [],
    notUrgentNotImportant: [],
};
const initialPomodoroLog = [
    { id: 1, task: 'Work on feature X', duration: 25, completed: true },
];

export default function ProductivityPlannerPage() {
  const { toast } = useToast();
  const [matrix, setMatrix] = useLocalStorageState('productivityPlanner_matrix', initialMatrix);
  const [pomodoroLog, setPomodoroLog] = useLocalStorageState('productivityPlanner_pomodoroLog', initialPomodoroLog);

  const handleSave = () => {
    toast({
      title: 'Productivity Planner Saved!',
      description: 'Your productivity data has been updated.',
    });
  };

  const addPomodoro = () => setPomodoroLog([...pomodoroLog, { id: Date.now(), task: '', duration: 25, completed: false }]);
  const removePomodoro = (id: number) => setPomodoroLog(pomodoroLog.filter(p => p.id !== id));
  
  // Simplified matrix handling for this example
  const [urgentImportant, setUrgentImportant] = useState('');

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Timer className="h-8 w-8 text-primary" />
          Productivity Planner
        </h1>
      </div>
      
      <Card className="glass-card">
        <CardHeader><CardTitle>Task Priority Matrix</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-2">
          <div className="p-4 rounded-lg bg-red-500/20">
            <h3 className="font-bold">Urgent & Important</h3>
            <Textarea placeholder="Do first..." className="mt-2 bg-transparent"/>
          </div>
          <div className="p-4 rounded-lg bg-blue-500/20">
            <h3 className="font-bold">Not Urgent & Important</h3>
            <Textarea placeholder="Schedule..." className="mt-2 bg-transparent"/>
          </div>
          <div className="p-4 rounded-lg bg-yellow-500/20">
            <h3 className="font-bold">Urgent & Not Important</h3>
            <Textarea placeholder="Delegate..." className="mt-2 bg-transparent"/>
          </div>
          <div className="p-4 rounded-lg bg-gray-500/20">
            <h3 className="font-bold">Not Urgent & Not Important</h3>
            <Textarea placeholder="Eliminate..." className="mt-2 bg-transparent"/>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Pomodoro Timer Log</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 font-bold text-sm">
                <div>Task</div><div>Duration (min)</div><div>Completed</div><div>Actions</div>
            </div>
            {pomodoroLog.map(log => (
              <div key={log.id} className="grid grid-cols-4 items-center gap-2">
                <Input value={log.task} onChange={e => setPomodoroLog(pomodoroLog.map(p => p.id === log.id ? {...p, task: e.target.value} : p))} />
                <Input type="number" value={log.duration} onChange={e => setPomodoroLog(pomodoroLog.map(p => p.id === log.id ? {...p, duration: +e.target.value} : p))} />
                <Checkbox checked={log.completed} onCheckedChange={checked => setPomodoroLog(pomodoroLog.map(p => p.id === log.id ? {...p, completed: !!checked} : p))} />
                <Button variant="ghost" size="icon" onClick={() => removePomodoro(log.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
          <Button onClick={addPomodoro} className="w-full mt-4">Add Pomodoro Session</Button>
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
