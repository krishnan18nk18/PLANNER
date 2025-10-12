'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Target, Trash2, Upload, Plus, Edit, Award, Heart, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { eachMonthOfInterval, format, startOfYear, endOfYear, getYear, setYear, getDaysInMonth } from 'date-fns';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const initialGoals = [{ id: 1, text: 'Launch a new side project', quarter: 1, completed: false }];
const initialBucketList = [{ id: 1, text: 'Learn a new language', completed: false }];
const initialHabits = [{ id: 1, name: 'Read 20 books', progress: 50 }];
const initialFinancials = { income: 80000, expenses: 50000, savings: 20000, investments: 10000 };
const initialWins = [{ id: 1, text: 'Completed a marathon', date: '2024-03-15' }];

export default function AnnualPlannerPage() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = getYear(currentDate);
  const [goals, setGoals] = useLocalStorageState(`annualPlanner_goals_${year}`, initialGoals);
  const [bucketList, setBucketList] = useLocalStorageState(`annualPlanner_bucketList_${year}`, initialBucketList);
  const [habits, setHabits] = useLocalStorageState(`annualPlanner_habits_${year}`, initialHabits);
  const [financials, setFinancials] = useLocalStorageState(`annualPlanner_financials_${year}`, initialFinancials);
  const [wins, setWins] = useLocalStorageState(`annualPlanner_wins_${year}`, initialWins);
  const [notes, setNotes] = useLocalStorageState(`annualPlanner_notes_${year}`, '');

  const months = eachMonthOfInterval({
    start: startOfYear(currentDate),
    end: endOfYear(currentDate)
  });

  const handleSave = () => {
    toast({
      title: 'Annual Planner Saved!',
      description: 'Your plans for the year have been saved.',
    });
  };

  const addGoal = () => setGoals([...goals, { id: Date.now(), text: '', quarter: 1, completed: false }]);
  const removeGoal = (id: number) => setGoals(goals.filter(item => item.id !== id));
  
  const addBucketListItem = () => setBucketList([...bucketList, { id: Date.now(), text: '', completed: false }]);
  const removeBucketListItem = (id: number) => setBucketList(bucketList.filter(item => item.id !== id));
  
  const addHabit = () => setHabits([...habits, { id: Date.now(), name: 'New Habit', progress: 0 }]);
  const removeHabit = (id: number) => setHabits(habits.filter(h => h.id !== id));

  const addWin = () => setWins([...wins, { id: Date.now(), text: '', date: '' }]);
  const removeWin = (id: number) => setWins(wins.filter(w => w.id !== id));

  const financialChartData = [
      { name: 'Expenses', value: financials.expenses },
      { name: 'Savings', value: financials.savings },
      { name: 'Investments', value: financials.investments },
  ]

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
                    {goals.map(goal => (
                        <div key={goal.id} className="p-2 bg-white/10 rounded-lg mb-2 flex items-center gap-2">
                            <Checkbox checked={goal.completed} onCheckedChange={checked => setGoals(goals.map(g => g.id === goal.id ? {...g, completed: !!checked } : g))} />
                            <Input value={goal.text} onChange={e => setGoals(goals.map(g => g.id === goal.id ? {...g, text: e.target.value } : g))} className="bg-transparent border-none flex-grow" />
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
                    {bucketList.map(item => (
                        <div key={item.id} className="p-2 bg-white/10 rounded-lg mb-2 flex items-center gap-2">
                            <Checkbox checked={item.completed} onCheckedChange={checked => setBucketList(bucketList.map(b => b.id === item.id ? {...b, completed: !!checked } : b))} />
                            <Input value={item.text} onChange={e => setBucketList(bucketList.map(b => b.id === item.id ? {...b, text: e.target.value} : b))} className="bg-transparent border-none flex-grow" />
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
                    {habits.map(habit => (
                        <div key={habit.id} className="mb-4">
                            <div className="flex justify-between items-center mb-1">
                               <Input value={habit.name} onChange={e => setHabits(habits.map(h => h.id === habit.id ? {...h, name: e.target.value} : h))} className="bg-transparent border-none font-semibold" />
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
                {wins.map(win => (
                    <div key={win.id} className="grid grid-cols-3 items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                        <Input value={win.text} onChange={e => setWins(wins.map(w => w.id === win.id ? {...w, text: e.target.value} : w))} placeholder="Achievement" className="bg-transparent col-span-2" />
                        <Input type="date" value={win.date} onChange={e => setWins(wins.map(w => w.id === win.id ? {...w, date: e.target.value} : w))} className="bg-transparent"/>
                    </div>
                ))}
                <Button onClick={addWin} className="w-full mt-2">Add Achievement</Button>
            </CardContent>
        </Card>

        <Card className="glass-card">
            <CardHeader><CardTitle>Quarterly Reflection</CardTitle></CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="q1"><AccordionTrigger>Q1 Review</AccordionTrigger><AccordionContent><Textarea placeholder="What went well? What could be improved?" className="bg-white/5"/></AccordionContent></AccordionItem>
                    <AccordionItem value="q2"><AccordionTrigger>Q2 Review</AccordionTrigger><AccordionContent><Textarea placeholder="What went well? What could be improved?" className="bg-white/5"/></AccordionContent></AccordionItem>
                    <AccordionItem value="q3"><AccordionTrigger>Q3 Review</AccordionTrigger><AccordionContent><Textarea placeholder="What went well? What could be improved?" className="bg-white/5"/></AccordionContent></AccordionItem>
                    <AccordionItem value="q4"><AccordionTrigger>Q4 Review</AccordionTrigger><AccordionContent><Textarea placeholder="What went well? What could be improved?" className="bg-white/5"/></AccordionContent></AccordionItem>
                </Accordion>
            </CardContent>
        </Card>

         <Card className="glass-card">
            <CardHeader><CardTitle>Notes & Future Plans</CardTitle></CardHeader>
            <CardContent>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Ideas, dreams, and schemes for the year..." className="h-40 bg-white/5 border-white/20"/>
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
