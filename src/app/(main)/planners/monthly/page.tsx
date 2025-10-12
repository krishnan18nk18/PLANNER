
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Trash2, ChevronLeft, ChevronRight, Book, DollarSign, Heart, Edit } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, addMonths, subMonths, isToday } from 'date-fns';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const initialBills = [
  { id: 1, name: 'Rent', amount: 1500, dueDate: '2024-08-01', paid: true },
  { id: 2, name: 'Internet', amount: 60, dueDate: '2024-08-15', paid: false },
];
const initialGoals = [
    { id: 1, text: 'Save $500', progress: 50 },
    { id: 2, text: 'Read 4 books', progress: 75 },
    { id: 3, text: 'Finish side project', progress: 20 },
];
const initialHabits = [
    { id: 1, name: 'Workout', days: Array(31).fill(false) },
    { id: 2, name: 'Read', days: Array(31).fill(false) },
    { id: 3, name: 'Meditate', days: Array(31).fill(false) },
];
const initialEvents = {
    '2024-08-10': [{ id: 1, title: 'Team Meeting' }],
    '2024-08-25': [{ id: 2, title: 'Doctor\'s Appointment' }],
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function MonthlyPlannerPage() {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const [bills, setBills] = useLocalStorageState('monthlyPlanner_bills_v2', initialBills);
  const [goals, setGoals] = useLocalStorageState('monthlyPlanner_goals_v2', initialGoals);
  const [habits, setHabits] = useLocalStorageState('monthlyPlanner_habits_v2', initialHabits);
  const [events, setEvents] = useLocalStorageState('monthlyPlanner_events_v2', initialEvents);
  const [notes, setNotes] = useLocalStorageState('monthlyPlanner_notes_v2', '');

  const handleSave = () => {
    toast({
      title: 'Monthly Planner Saved!',
      description: 'Your monthly plan has been updated.',
    });
  };

  // Bill Functions
  const addBill = () => setBills([...bills, { id: Date.now(), name: '', amount: 0, dueDate: '', paid: false }]);
  const removeBill = (id: number) => setBills(bills.filter(bill => bill.id !== id));
  
  // Goal Functions
  const addGoal = () => setGoals([...goals, { id: Date.now(), text: 'New Goal', progress: 0 }]);
  const removeGoal = (id: number) => setGoals(goals.filter(g => g.id !== id));
  
  // Habit Functions
  const toggleHabitDay = (habitId: number, dayIndex: number) => {
    setHabits(habits.map(h => 
        h.id === habitId 
        ? {...h, days: h.days.map((d, i) => i === dayIndex ? !d : d)} 
        : h
    ));
  };


  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startOfWeek(firstDay), end: endOfWeek(lastDay) });

  const totalIncome = 5000; // Mock data
  const totalExpenses = bills.reduce((acc, bill) => acc + (bill.paid ? Number(bill.amount) : 0), 0);
  const budgetChartData = [
      { name: 'Expenses', value: totalExpenses },
      { name: 'Remaining', value: totalIncome - totalExpenses }
  ];

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Calendar className="h-8 w-8 text-primary" />
          Monthly Planner
        </h1>
      </div>
      
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline text-2xl">{format(currentMonth, 'MMMM yyyy')}</CardTitle>
            <div className="space-x-2">
                <Button variant="outline" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}><ChevronLeft className="h-4 w-4 mr-2"/>Prev</Button>
                <Button variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next<ChevronRight className="h-4 w-4 ml-2"/></Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-7 text-center font-bold text-muted-foreground">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 gap-1.5 mt-2">
                {daysInMonth.map(day => {
                    const dayEvents = events[format(day, 'yyyy-MM-dd')] || [];
                    return (
                        <div key={day.toString()} className={cn(
                            "h-24 p-2 rounded-xl border border-white/10 flex flex-col transition-colors duration-300", 
                            isSameMonth(day, currentMonth) ? "bg-white/10 hover:bg-white/20" : "bg-white/5 text-muted-foreground",
                            isToday(day) && "ring-2 ring-primary"
                        )}>
                            <span className="font-semibold">{format(day, 'd')}</span>
                            <div className="flex-grow text-xs space-y-1 mt-1 overflow-hidden">
                                {dayEvents.map(event => (
                                    <div key={event.id} className="bg-blue-500/80 text-white rounded px-1 truncate">{event.title}</div>
                                ))}
                                {bills.filter(b => b.dueDate === format(day, 'yyyy-MM-dd')).map(b => (
                                    <div key={b.id} className="bg-red-500/80 text-white rounded px-1 truncate" title={b.name}>${b.amount}</div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
            <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5 text-green-400"/>Bill & Payment Tracker</CardTitle></CardHeader>
            <CardContent className="overflow-x-auto">
                <div className="min-w-[600px] space-y-2">
                    <div className="grid grid-cols-5 gap-2 font-bold text-sm text-muted-foreground">
                        <div>Status</div><div>Bill Name</div><div>Amount</div><div>Due Date</div><div>Actions</div>
                    </div>
                    {bills.map(bill => (
                        <div key={bill.id} className="grid grid-cols-5 items-center gap-2 p-2 rounded-lg bg-white/10">
                            <Checkbox checked={bill.paid} onCheckedChange={checked => setBills(bills.map(b => b.id === bill.id ? {...b, paid: !!checked} : b))} />
                            <Input value={bill.name} onChange={e => setBills(bills.map(b => b.id === bill.id ? {...b, name: e.target.value} : b))} placeholder="Bill Name" className="bg-transparent" />
                            <Input type="number" value={bill.amount} onChange={e => setBills(bills.map(b => b.id === bill.id ? {...b, amount: +e.target.value} : b))} placeholder="Amount" className="w-24 bg-transparent" />
                            <Input type="date" value={bill.dueDate} onChange={e => setBills(bills.map(b => b.id === bill.id ? {...b, dueDate: e.target.value} : b))} className="w-32 bg-transparent" />
                            <Button variant="ghost" size="icon" onClick={() => removeBill(bill.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                    ))}
                </div>
                <Button onClick={addBill} className="w-full mt-4">Add Bill</Button>
            </CardContent>
        </Card>
        <Card className="glass-card">
            <CardHeader><CardTitle>Budget Summary</CardTitle></CardHeader>
            <CardContent>
                <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={budgetChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#8884d8" paddingAngle={5}>
                                {budgetChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                    <p>Total Income: <span className="text-green-400">${totalIncome.toFixed(2)}</span></p>
                    <p>Total Paid: <span className="text-red-400">${totalExpenses.toFixed(2)}</span></p>
                </div>
            </CardContent>
        </Card>
      </div>

       <Card className="glass-card">
            <CardHeader><CardTitle>Monthly Goals</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {goals.map((goal, index) => (
                    <div key={goal.id} className="p-4 bg-white/10 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                            <Input value={goal.text} onChange={e => setGoals(goals.map(g => g.id === goal.id ? {...g, text: e.target.value} : g))} className="bg-transparent border-none text-lg font-semibold" />
                            <Button variant="ghost" size="icon" onClick={() => removeGoal(goal.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </div>
                        <div className="flex items-center gap-4">
                            <Progress value={goal.progress} className="w-full h-3" />
                            <Input type="number" value={goal.progress} onChange={e => setGoals(goals.map(g => g.id === goal.id ? {...g, progress: +e.target.value} : g))} className="w-20 bg-transparent" />
                        </div>
                    </div>
                ))}
                <Button onClick={addGoal} className="w-full mt-2">Add Goal</Button>
            </CardContent>
        </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Habit Tracker</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="flex gap-1">
                <div className="w-32 flex-shrink-0 font-bold">Habit</div>
                {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className="w-7 text-center text-xs flex-shrink-0">{i + 1}</div>
                ))}
            </div>
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center gap-1 mt-2">
                <Input value={habit.name} onChange={(e) => setHabits(habits.map(h => h.id === habit.id ? {...h, name: e.target.value} : h))} className="w-32 flex-shrink-0 bg-transparent" />
                {habit.days.map((done, i) => (
                  <button key={i} onClick={() => toggleHabitDay(habit.id, i)} className={cn("w-7 h-7 rounded flex-shrink-0 transition-colors", done ? "bg-green-500" : "bg-white/10 hover:bg-white/20")}></button>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

       <Card className="glass-card">
          <CardHeader><CardTitle>Notes & Brainstorming</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Jot down your ideas for the month..." className="h-40 bg-white/5 border-white/20"/>
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
