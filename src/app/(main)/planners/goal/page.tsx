'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Target, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { differenceInDays, format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Believe you can and you're halfway there.",
    "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence."
];

export default function GoalPlannerPage() {
  const { toast } = useToast();
  const [goal, setGoal] = useLocalStorageState('goalPlanner_goal', 'Launch my side project');
  const [steps, setSteps] = useLocalStorageState('goalPlanner_steps', [
      { id: 1, text: 'Create landing page', completed: true },
      { id: 2, text: 'Develop core features', completed: false },
      { id: 3, text: 'Deploy to production', completed: false },
  ]);
  const [deadline, setDeadline] = useLocalStorageState('goalPlanner_deadline', new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]);
  const [obstacles, setObstacles] = useLocalStorageState('goalPlanner_obstacles', '');
  const [solutions, setSolutions] = useLocalStorageState('goalPlanner_solutions', '');
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
  }, []);

  const handleSave = () => {
    toast({
      title: 'Goal Planner Saved!',
      description: 'Your goal progress has been updated.',
    });
  };

  const addStep = () => setSteps([...steps, { id: Date.now(), text: '', completed: false }]);
  const removeStep = (id: number) => setSteps(steps.filter(s => s.id !== id));

  const completedSteps = steps.filter(s => s.completed).length;
  const progress = steps.length > 0 ? (completedSteps / steps.length) * 100 : 0;
  const daysLeft = deadline ? differenceInDays(new Date(deadline), new Date()) : 0;

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Target className="h-8 w-8 text-primary" />
          Goal Planner
        </h1>
      </div>

      <Card className="glass-card text-center">
        <CardHeader>
            <CardTitle>Motivational Quote</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-lg italic text-muted-foreground">"{quote}"</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>My Goal</CardTitle>
        </CardHeader>
        <CardContent>
          <Input value={goal} onChange={(e) => setGoal(e.target.value)} className="text-xl h-12 bg-white/10" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Deadline & Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                <p>{daysLeft >= 0 ? `${daysLeft} days left` : 'Deadline passed'}</p>
                <Progress value={progress} className="w-full" />
                <p className="text-center">{Math.round(progress)}% Complete</p>
            </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader><CardTitle>Numbered Steps</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
                {steps.map(step => (
                    <div key={step.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/10">
                        <Input value={step.text} onChange={(e) => setSteps(steps.map(s => s.id === step.id ? {...s, text: e.target.value} : s))} className="flex-grow bg-transparent" />
                        <Button variant="ghost" size="icon" onClick={() => removeStep(step.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                ))}
            </div>
            <Button onClick={addStep} className="w-full mt-4">Add Step</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle>Potential Obstacles</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={obstacles} onChange={(e) => setObstacles(e.target.value)} className="h-32 bg-white/5" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle>Solutions</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={solutions} onChange={(e) => setSolutions(e.target.value)} className="h-32 bg-white/5" />
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
