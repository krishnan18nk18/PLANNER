'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Target, Trash2, Plus, Users, Lightbulb, Check } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { differenceInDays, format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';


const motivationalQuotes = [
    "The secret of getting ahead is getting started.",
    "It does not matter how slowly you go as long as you do not stop.",
    "Believe you can and you're halfway there.",
    "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence."
];

const initialSteps = [
    { id: '1', text: 'Create landing page', completed: true },
    { id: '2', text: 'Develop core features', completed: false },
    { id: '3', text: 'Deploy to production', completed: false },
];

const SortableStep = ({ step, onToggle, onRemove, onUpdate } : any) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: step.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex items-center gap-2 p-2 rounded-lg bg-white/10 mb-2">
            <Checkbox checked={step.completed} onCheckedChange={() => onToggle(step.id)} />
            <Input value={step.text} onChange={(e) => onUpdate(step.id, e.target.value)} className="flex-grow bg-transparent" />
            <Button variant="ghost" size="icon" onClick={() => onRemove(step.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
        </div>
    );
};


export default function GoalPlannerPage() {
  const { toast } = useToast();
  const [goal, setGoal] = useLocalStorageState('goalPlanner_goal', 'Launch my side project');
  const [steps, setSteps] = useLocalStorageState('goalPlanner_steps', initialSteps);
  const [deadline, setDeadline] = useLocalStorageState('goalPlanner_deadline', new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0]);
  const [obstacles, setObstacles] = useLocalStorageState('goalPlanner_obstacles', '');
  const [solutions, setSolutions] = useLocalStorageState('goalPlanner_solutions', '');
  const [motivation, setMotivation] = useLocalStorageState('goalPlanner_motivation', 'To achieve financial freedom and build something of my own.');
  const [smart, setSmart] = useLocalStorageState('goalPlanner_smart', {s: true, m: false, a: true, r: true, t: false});
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

  const addStep = () => setSteps([...steps, { id: Date.now().toString(), text: '', completed: false }]);
  const removeStep = (id: string) => setSteps(steps.filter(s => s.id !== id));
  const toggleStep = (id: string) => setSteps(steps.map(s => s.id === id ? {...s, completed: !s.completed} : s));
  const updateStep = (id: string, text: string) => setSteps(steps.map(s => s.id === id ? {...s, text} : s));
  
  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event;
    if (over && active.id !== over.id) {
      setSteps((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const completedSteps = steps.filter(s => s.completed).length;
  const progress = steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0;
  const daysLeft = deadline ? differenceInDays(new Date(deadline), new Date()) : 0;

  const smartCriteria = [
      { key: 's', label: 'Specific: Is your goal clearly defined?'},
      { key: 'm', label: 'Measurable: Can you track your progress?'},
      { key: 'a', label: 'Achievable: Is this goal realistic?'},
      { key: 'r', label: 'Relevant: Does this align with your values?'},
      { key: 't', label: 'Time-bound: Does your goal have a deadline?'},
  ];

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

      <Card className="glass-card text-center bg-gradient-to-r from-purple-500/30 to-blue-500/30">
        <CardHeader>
            <CardTitle>Vision Statement</CardTitle>
        </CardHeader>
        <CardContent>
            <Input value={goal} onChange={(e) => setGoal(e.target.value)} className="text-2xl h-14 bg-transparent border-none text-center font-bold focus-visible:ring-0" />
        </CardContent>
      </Card>
      
       <Card className="glass-card">
          <CardHeader><CardTitle>My "Why"</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={motivation} onChange={(e) => setMotivation(e.target.value)} placeholder="What's the driving force behind this goal?" className="h-24 bg-white/5" />
          </CardContent>
        </Card>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card className="glass-card">
              <CardHeader><CardTitle>S.M.A.R.T. Checklist</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                  {smartCriteria.map(item => (
                      <div key={item.key} className="flex items-center gap-3">
                          <Checkbox id={item.key} checked={smart[item.key as keyof typeof smart]} onCheckedChange={checked => setSmart({...smart, [item.key]: !!checked})} />
                          <label htmlFor={item.key} className="text-sm">{item.label}</label>
                      </div>
                  ))}
              </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Deadline & Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                    <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="bg-white/10" />
                    <p className="text-2xl font-bold">{daysLeft >= 0 ? `${daysLeft} days left` : 'Deadline passed'}</p>
                    <div className="relative h-32 w-32 mx-auto">
                        <Progress value={progress} className="w-full h-full rounded-full" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">{progress}%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
        
        <Card className="glass-card">
          <CardHeader><CardTitle>Action Steps</CardTitle></CardHeader>
          <CardContent>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={steps}>
                    {steps.map(step => (
                        <SortableStep key={step.id} step={step} onToggle={toggleStep} onRemove={removeStep} onUpdate={updateStep} />
                    ))}
                </SortableContext>
            </DndContext>
            <Button onClick={addStep} className="w-full mt-4"><Plus className="h-4 w-4 mr-2"/>Add Step</Button>
          </CardContent>
        </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle>Potential Obstacles</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={obstacles} onChange={(e) => setObstacles(e.target.value)} placeholder="What might get in the way?" className="h-32 bg-white/5" />
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle>Solutions & Strategies</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={solutions} onChange={(e) => setSolutions(e.target.value)} placeholder="How will you overcome them?" className="h-32 bg-white/5" />
          </CardContent>
        </Card>
      </div>

       <Card className="glass-card text-center">
        <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2"><Lightbulb /> Motivational Quote</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-lg italic text-muted-foreground">"{quote}"</p>
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
