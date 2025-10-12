'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, addMonths, subMonths } from 'date-fns';
import { cn } from '@/lib/utils';


const initialBills = [
  { id: 1, name: 'Rent', amount: 1500, dueDate: '2024-08-01', paid: true },
  { id: 2, name: 'Internet', amount: 60, dueDate: '2024-08-15', paid: false },
];
const initialGoals = [
    { id: 1, text: 'Save $500', progress: 50 },
    { id: 2, text: 'Read 4 books', progress: 75 },
];

export default function MonthlyPlannerPage() {
  const { toast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [bills, setBills] = useLocalStorageState('monthlyPlanner_bills', initialBills);
  const [goals, setGoals] = useLocalStorageState('monthlyPlanner_goals', initialGoals);

  const handleSave = () => {
    toast({
      title: 'Monthly Planner Saved!',
      description: 'Your monthly plan has been updated.',
    });
  };

  const addBill = () => setBills([...bills, { id: Date.now(), name: '', amount: 0, dueDate: '', paid: false }]);
  const removeBill = (id: number) => setBills(bills.filter(bill => bill.id !== id));

  const firstDay = startOfMonth(currentMonth);
  const lastDay = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: startOfWeek(firstDay), end: endOfWeek(lastDay) });
  
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
            <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
            <div className="space-x-2">
                <Button variant="outline" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>Prev</Button>
                <Button variant="outline" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>Next</Button>
            </div>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-7 text-center font-bold">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 gap-1">
                {daysInMonth.map(day => (
                    <div key={day.toString()} className={cn("h-20 p-2 rounded-lg border border-white/10", isSameMonth(day, currentMonth) ? "bg-white/10" : "bg-white/5 text-muted-foreground")}>
                        {format(day, 'd')}
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
            <CardHeader><CardTitle>Bill / Payment Tracker</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {bills.map(bill => (
                        <div key={bill.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/10">
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
            <CardHeader><CardTitle>Monthly Goals</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                {goals.map(goal => (
                    <div key={goal.id}>
                        <label>{goal.text}</label>
                        <Input type="range" min="0" max="100" value={goal.progress} onChange={e => setGoals(goals.map(g => g.id === goal.id ? {...g, progress: +e.target.value} : g))} />
                        <span className="text-sm">{goal.progress}%</span>
                    </div>
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
