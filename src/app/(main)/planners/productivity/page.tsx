'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Timer, Trash2, Plus, Target } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

const initialDailyGoals = [
    { id: 1, text: 'Finalize presentation slides', completed: false },
    { id: 2, text: 'Respond to urgent emails', completed: false },
    { id: 3, text: 'Plan tomorrow\'s schedule', completed: false },
];

const initialPomodoroLog = [
    { id: 1, task: 'Work on feature X', duration: 25, completed: true },
];

const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "The only way to do great work is to love what you do.",
    "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort.",
];

export default function ProductivityPlannerPage() {
  const { toast } = useToast();
  const [date, setDate] = useLocalStorageState('productivityPlanner_date', new Date().toISOString().split('T')[0]);
  const [dailyGoals, setDailyGoals] = useLocalStorageState('productivityPlanner_dailyGoals', initialDailyGoals);
  const [matrix, setMatrix] = useLocalStorageState('productivityPlanner_matrix', {
    urgentImportant: '',
    notUrgentImportant: '',
    urgentNotImportant: '',
    notUrgentNotImportant: '',
  });
  const [pomodoroLog, setPomodoroLog] = useLocalStorageState('productivityPlanner_pomodoroLog', initialPomodoroLog);
  const [quote, setQuote] = useState(motivationalQuotes[0]);
  const [notes, setNotes] = useLocalStorageState('productivityPlanner_notes', '');

  const handleSave = () => {
    toast({
      title: 'Productivity Planner Saved!',
      description: 'Your productivity data has been updated.',
    });
  };

  const addPomodoro = () => setPomodoroLog([...pomodoroLog, { id: Date.now(), task: '', duration: 25, completed: false }]);
  const removePomodoro = (id: number) => setPomodoroLog(pomodoroLog.filter(p => p.id !== id));
  
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
        <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto bg-transparent border-none text-2xl font-bold p-0 focus-visible:ring-0" />
              <p className="text-muted-foreground">{format(new Date(date), 'EEEE')}</p>
            </div>
             <Card className="glass-card text-center bg-gradient-to-r from-purple-500/30 to-blue-500/30 p-4">
                <CardTitle className="text-sm">Motivational Quote</CardTitle>
                <CardContent className="p-0 pt-2">
                    <p className="text-sm italic text-muted-foreground">"{quote}"</p>
                </CardContent>
            </Card>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Target/> Top 3 Daily Goals</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyGoals.map((goal, i) => (
            <div key={goal.id} className="glass-card bg-gradient-to-br from-blue-500/50 to-purple-600/50 p-4 rounded-xl flex items-center gap-2">
              <Checkbox id={`goal-${goal.id}`} checked={goal.completed} onCheckedChange={checked => setDailyGoals(dailyGoals.map(g => g.id === goal.id ? {...g, completed: !!checked} : g))} />
              <Input
                value={goal.text}
                onChange={(e) => setDailyGoals(dailyGoals.map(g => g.id === goal.id ? {...g, text: e.target.value} : g))}
                placeholder={`Goal ${i + 1}`}
                className="bg-transparent border-none text-white font-bold text-lg focus-visible:ring-0"
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Eisenhower Matrix</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-red-500/30">
            <h3 className="font-bold">Urgent & Important</h3>
            <Textarea value={matrix.urgentImportant} onChange={e => setMatrix({...matrix, urgentImportant: e.target.value})} placeholder="Do first..." className="mt-2 bg-transparent h-24"/>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/30">
            <h3 className="font-bold">Not Urgent & Important</h3>
            <Textarea value={matrix.notUrgentImportant} onChange={e => setMatrix({...matrix, notUrgentImportant: e.target.value})} placeholder="Schedule..." className="mt-2 bg-transparent h-24"/>
          </div>
          <div className="p-4 rounded-xl bg-yellow-500/30">
            <h3 className="font-bold">Urgent & Not Important</h3>
            <Textarea value={matrix.urgentNotImportant} onChange={e => setMatrix({...matrix, urgentNotImportant: e.target.value})} placeholder="Delegate..." className="mt-2 bg-transparent h-24"/>
          </div>
          <div className="p-4 rounded-xl bg-gray-500/30">
            <h3 className="font-bold">Not Urgent & Not Important</h3>
            <Textarea value={matrix.notUrgentNotImportant} onChange={e => setMatrix({...matrix, notUrgentNotImportant: e.target.value})} placeholder="Eliminate..." className="mt-2 bg-transparent h-24"/>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Pomodoro Log</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-4 gap-2 font-bold text-sm text-muted-foreground">
                <div>Task</div><div>Duration (min)</div><div>Completed</div><div>Actions</div>
            </div>
            {pomodoroLog.map(log => (
              <div key={log.id} className="grid grid-cols-4 items-center gap-2 p-2 rounded-lg bg-white/10">
                <Input value={log.task} onChange={e => setPomodoroLog(pomodoroLog.map(p => p.id === log.id ? {...p, task: e.target.value} : p))} className="bg-transparent" />
                <Input type="number" value={log.duration} onChange={e => setPomodoroLog(pomodoroLog.map(p => p.id === log.id ? {...p, duration: +e.target.value} : p))} className="bg-transparent" />
                <Checkbox checked={log.completed} onCheckedChange={checked => setPomodoroLog(pomodoroLog.map(p => p.id === log.id ? {...p, completed: !!checked} : p))} />
                <Button variant="ghost" size="icon" onClick={() => removePomodoro(log.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
          <Button onClick={addPomodoro} className="w-full mt-4"><Plus className="mr-2 h-4 w-4"/>Add Pomodoro Session</Button>
        </CardContent>
      </Card>
       
       <Card className="glass-card">
          <CardHeader><CardTitle>Notes & Brain Dump</CardTitle></CardHeader>
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
