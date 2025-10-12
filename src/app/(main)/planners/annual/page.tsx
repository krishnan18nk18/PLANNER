'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Target, Trash2, Upload, Plus, Edit, Award, Heart, DollarSign, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { eachMonthOfInterval, format, startOfYear, endOfYear, getYear, setYear, getDaysInMonth } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useDoc, useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const initialPlannerState = {
    goals: [{ id: 1, text: 'Launch a new side project', quarter: 1, completed: false }],
    bucketList: [{ id: 1, text: 'Learn a new language', completed: false }],
    habits: [{ id: 1, name: 'Read 20 books', progress: 50 }],
    financials: { income: 80000, expenses: 50000, savings: 20000, investments: 10000 },
    wins: [{ id: 1, text: 'Completed a marathon', date: '2024-03-15' }],
    notes: '',
    q1Notes: '',
    q2Notes: '',
    q3Notes: '',
    q4Notes: '',
};

export default function AnnualPlannerPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const { db } = useFirestore();

  const [currentDate, setCurrentDate] = useState(new Date());
  const year = getYear(currentDate);

  const plannerPath = user ? `users/${user.uid}/planners/annual-${year}` : null;
  const { data: plannerData, loading } = useDoc<typeof initialPlannerState>(plannerPath);
  
  const plannerState = plannerData || initialPlannerState;

  const handleSave = () => {
    if (!db || !user) return;
    const docRef = doc(db, plannerPath!);
    setDoc(docRef, plannerState, { merge: true })
      .then(() => {
        toast({
          title: 'Annual Planner Saved!',
          description: `Your plans for ${year} have been saved.`,
        });
      })
      .catch((err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({path: docRef.path, operation: 'write', requestResourceData: plannerState}));
      });
  };
  
  const updatePlanner = (data: Partial<typeof initialPlannerState>) => {
     if (!db || !user) return;
    const docRef = doc(db, plannerPath!);
    setDoc(docRef, data, { merge: true })
      .catch((err) => {
         errorEmitter.emit('permission-error', new FirestorePermissionError({path: docRef.path, operation: 'write', requestResourceData: data}));
      });
  };

  const months = eachMonthOfInterval({
    start: startOfYear(currentDate),
    end: endOfYear(currentDate)
  });

  const addGoal = () => updatePlanner({ goals: [...plannerState.goals, { id: Date.now(), text: '', quarter: 1, completed: false }]});
  const removeGoal = (id: number) => updatePlanner({ goals: plannerState.goals.filter(item => item.id !== id) });
  
  const addBucketListItem = () => updatePlanner({ bucketList: [...plannerState.bucketList, { id: Date.now(), text: '', completed: false }] });
  const removeBucketListItem = (id: number) => updatePlanner({ bucketList: plannerState.bucketList.filter(item => item.id !== id) });
  
  const addHabit = () => updatePlanner({ habits: [...plannerState.habits, { id: Date.now(), name: 'New Habit', progress: 0 }] });

  const addWin = () => updatePlanner({ wins: [...plannerState.wins, { id: Date.now(), text: '', date: '' }] });
  const removeWin = (id: number) => updatePlanner({ wins: plannerState.wins.filter(w => w.id !== id) });

  const financialChartData = [
      { name: 'Expenses', value: plannerState.financials.expenses },
      { name: 'Savings', value: plannerState.financials.savings },
      { name: 'Investments', value: plannerState.financials.investments },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin" /></div>
  }

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="h-10 w-10">
                <Link href="/planners"><ArrowLeft /></Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
                <Calendar className="h-8 w-8 text-primary" />
                Annual Planner for {year}
            </h1>
        </div>

        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Year at a Glance</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                {months.map(month => (
                    <div key={month.toString()} className="p-4 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer">
                        {format(month, 'MMMM')}
                    </div>
                ))}
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Target /> Annual Goals & Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                    {plannerState.goals.map(goal => (
                        <div key={goal.id} className="p-2 bg-white/10 rounded-lg mb-2 flex items-center gap-2">
                            <Checkbox checked={goal.completed} onCheckedChange={checked => updatePlanner({ goals: plannerState.goals.map(g => g.id === goal.id ? {...g, completed: !!checked } : g)})} />
                            <Input value={goal.text} onChange={e => updatePlanner({ goals: plannerState.goals.map(g => g.id === goal.id ? {...g, text: e.target.value } : g)})} className="bg-transparent border-none flex-grow" />
                            <Button variant="ghost" size="icon" onClick={() => removeGoal(goal.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    ))}
                    <Button onClick={addGoal} className="w-full mt-2">Add Goal</Button>
                </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Heart /> Bucket List</CardTitle>
                </CardHeader>
                <CardContent>
                    {plannerState.bucketList.map(item => (
                        <div key={item.id} className="p-2 bg-white/10 rounded-lg mb-2 flex items-center gap-2">
                            <Checkbox checked={item.completed} onCheckedChange={checked => updatePlanner({ bucketList: plannerState.bucketList.map(b => b.id === item.id ? {...b, completed: !!checked } : b)})} />
                            <Input value={item.text} onChange={e => updatePlanner({ bucketList: plannerState.bucketList.map(b => b.id === item.id ? {...b, text: e.target.value} : b)})} className="bg-transparent border-none flex-grow" />
                            <Button variant="ghost" size="icon" onClick={() => removeBucketListItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    ))}
                    <Button onClick={addBucketListItem} className="w-full mt-2">Add Bucket List Item</Button>
                </CardContent>
            </Card>
        </div>

        <Card className="glass-card">
            <CardHeader><CardTitle>Vision Board</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                     <div key={i} className="aspect-square bg-white/10 rounded-xl flex items-center justify-center text-muted-foreground flex-col gap-2">
                        <Upload className="h-8 w-8" />
                        <span className="text-xs">Upload Image</span>
                    </div>
                ))}
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Habit Tracker</CardTitle>
                </CardHeader>
                <CardContent>
                    {plannerState.habits.map(habit => (
                        <div key={habit.id} className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                               <Input value={habit.name} onChange={e => updatePlanner({ habits: plannerState.habits.map(h => h.id === habit.id ? {...h, name: e.target.value} : h)})} className="bg-transparent border-none font-semibold" />
                                <span className="text-sm font-bold">{habit.progress}%</span>
                            </div>
                            <Progress value={habit.progress} />
                        </div>
                    ))}
                     <Button onClick={addHabit} className="w-full mt-2">Add Habit</Button>
                </CardContent>
            </Card>
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><DollarSign/> Financial Overview</CardTitle>
                </CardHeader>
                <CardContent className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={financialChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8" label>
                                {financialChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
        
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Award /> Achievements & Wins</CardTitle>
            </CardHeader>
            <CardContent>
                {plannerState.wins.map(win => (
                    <div key={win.id} className="grid grid-cols-3 items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                        <Input value={win.text} onChange={e => updatePlanner({ wins: plannerState.wins.map(w => w.id === win.id ? {...w, text: e.target.value} : w)})} placeholder="Achievement" className="bg-transparent col-span-2" />
                        <Input type="date" value={win.date} onChange={e => updatePlanner({ wins: plannerState.wins.map(w => w.id === win.id ? {...w, date: e.target.value} : w)})} className="bg-transparent"/>
                    </div>
                ))}
                <Button onClick={addWin} className="w-full mt-2">Add Achievement</Button>
            </CardContent>
        </Card>

        <Card className="glass-card">
            <CardHeader><CardTitle>Quarterly Reflection</CardTitle></CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="q1"><AccordionTrigger>Q1 Review</AccordionTrigger><AccordionContent><Textarea value={plannerState.q1Notes} onChange={e => updatePlanner({ q1Notes: e.target.value })} placeholder="What went well? What could be improved?" className="bg-white/5"/></AccordionContent></AccordionItem>
                    <AccordionItem value="q2"><AccordionTrigger>Q2 Review</AccordionTrigger><AccordionContent><Textarea value={plannerState.q2Notes} onChange={e => updatePlanner({ q2Notes: e.target.value })} placeholder="What went well? What could be improved?" className="bg-white/5"/></AccordionContent></AccordionItem>
                    <AccordionItem value="q3"><AccordionTrigger>Q3 Review</AccordionTrigger><AccordionContent><Textarea value={plannerState.q3Notes} onChange={e => updatePlanner({ q3Notes: e.target.value })} placeholder="What went well? What could be improved?" className="bg-white/5"/></AccordionContent></AccordionItem>
                    <AccordionItem value="q4"><AccordionTrigger>Q4 Review</AccordionTrigger><AccordionContent><Textarea value={plannerState.q4Notes} onChange={e => updatePlanner({ q4Notes: e.target.value })} placeholder="What went well? What could be improved?" className="bg-white/5"/></AccordionContent></AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

         <Card className="glass-card">
            <CardHeader><CardTitle>Notes & Future Plans</CardTitle></CardHeader>
            <CardContent>
                <Textarea value={plannerState.notes} onChange={(e) => updatePlanner({ notes: e.target.value })} placeholder="Ideas, dreams, and schemes for the year..." className="h-40 bg-white/5 border-white/20"/>
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
