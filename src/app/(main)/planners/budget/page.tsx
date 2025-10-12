'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, DollarSign, Trash2, Plus, Banknote, Landmark, TrendingUp, TrendingDown, PiggyBank, Target } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';

const initialIncome = [{ id: 1, source: 'Salary', amount: 5000, date: '2024-07-01' }];
const initialExpenses = [
    { id: 1, category: 'Housing', amount: 1500, date: '2024-07-01' },
    { id: 2, category: 'Food', amount: 400, date: '2024-07-05' },
    { id: 3, category: 'Transportation', amount: 150, date: '2024-07-08' },
];
const initialSavingsGoals = [{ id: 1, name: 'Vacation Fund', target: 2000, current: 500 }];
const initialBills = [{ id: 1, name: 'Internet', dueDate: '2024-07-15', amount: 60, paid: true }];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8442ff', '#ff42b2'];
const financialCategories = ['Housing', 'Utilities', 'Food', 'Transportation', 'Healthcare', 'Entertainment', 'Education', 'Subscriptions', 'Insurance', 'Family', 'Savings', 'Investments', 'Miscellaneous'];

export default function BudgetPlannerPage() {
  const { toast } = useToast();
  const [income, setIncome] = useLocalStorageState('budgetPlanner_income_v2', initialIncome);
  const [expenses, setExpenses] = useLocalStorageState('budgetPlanner_expenses_v2', initialExpenses);
  const [savingsGoals, setSavingsGoals] = useLocalStorageState('budgetPlanner_savingsGoals_v2', initialSavingsGoals);
  const [bills, setBills] = useLocalStorageState('budgetPlanner_bills_v2', initialBills);

  const handleSave = () => {
    toast({
      title: 'Budget Planner Saved!',
      description: 'Your financial data has been saved.',
    });
  };

  const addIncome = () => setIncome([...income, { id: Date.now(), source: '', amount: 0, date: '' }]);
  const removeIncome = (id: number) => setIncome(income.filter(i => i.id !== id));
  
  const addExpense = () => setExpenses([...expenses, { id: Date.now(), category: 'Miscellaneous', amount: 0, date: '' }]);
  const removeExpense = (id: number) => setExpenses(expenses.filter(e => e.id !== id));
  
  const addSavingsGoal = () => setSavingsGoals([...savingsGoals, { id: Date.now(), name: 'New Goal', target: 1000, current: 0 }]);
  const removeSavingsGoal = (id: number) => setSavingsGoals(savingsGoals.filter(s => s.id !== id));

  const addBill = () => setBills([...bills, { id: Date.now(), name: '', dueDate: '', amount: 0, paid: false }]);
  const removeBill = (id: number) => setBills(bills.filter(b => b.id !== id));

  const totalIncome = useMemo(() => income.reduce((acc, i) => acc + Number(i.amount), 0), [income]);
  const totalExpenses = useMemo(() => expenses.reduce((acc, e) => acc + Number(e.amount), 0), [expenses]);
  const balance = totalIncome - totalExpenses;

  const expenseChartData = useMemo(() => {
    const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
        return acc;
    }, {} as Record<string, number>);
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-primary" />
          Budget & Financial Planner
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <Card className="glass-card bg-gradient-to-br from-green-500/30 to-blue-500/30"><CardHeader><CardTitle className="flex items-center justify-center gap-2"><TrendingUp/>Total Income</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-300">${totalIncome.toFixed(2)}</p></CardContent></Card>
        <Card className="glass-card bg-gradient-to-br from-red-500/30 to-orange-500/30"><CardHeader><CardTitle className="flex items-center justify-center gap-2"><TrendingDown/>Total Expenses</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-red-300">${totalExpenses.toFixed(2)}</p></CardContent></Card>
        <Card className="glass-card bg-gradient-to-br from-blue-500/30 to-purple-500/30"><CardHeader><CardTitle className="flex items-center justify-center gap-2"><Landmark/>Balance</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">${balance.toFixed(2)}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle className="flex items-center gap-2"><Banknote/>Income Tracker</CardTitle></CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {income.map(item => (
              <div key={item.id} className="grid grid-cols-4 items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                <Input value={item.source} onChange={(e) => setIncome(income.map(i => i.id === item.id ? {...i, source: e.target.value} : i))} placeholder="Source" className="bg-transparent" />
                <Input type="number" value={item.amount} onChange={(e) => setIncome(income.map(i => i.id === item.id ? {...i, amount: Number(e.target.value)} : i))} placeholder="Amount" className="bg-transparent" />
                <Input type="date" value={item.date} onChange={(e) => setIncome(income.map(i => i.id === item.id ? {...i, date: e.target.value} : i))} className="bg-transparent" />
                <Button variant="ghost" size="icon" onClick={() => removeIncome(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button onClick={addIncome} className="mt-4 w-full"><Plus className="mr-2 h-4 w-4"/>Add Income</Button>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle className="flex items-center gap-2 text-red-400"><TrendingDown/>Expense Tracker</CardTitle></CardHeader>
          <CardContent className="max-h-96 overflow-y-auto">
            {expenses.map(item => (
              <div key={item.id} className="grid grid-cols-4 items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                 <Input value={item.category} onChange={(e) => setExpenses(expenses.map(ex => ex.id === item.id ? {...ex, category: e.target.value} : ex))} placeholder="Category" className="bg-transparent" />
                <Input type="number" value={item.amount} onChange={(e) => setExpenses(expenses.map(ex => ex.id === item.id ? {...ex, amount: Number(e.target.value)} : ex))} placeholder="Amount" className="bg-transparent" />
                <Input type="date" value={item.date} onChange={(e) => setExpenses(expenses.map(ex => ex.id === item.id ? {...ex, date: e.target.value} : ex))} className="bg-transparent" />
                <Button variant="ghost" size="icon" onClick={() => removeExpense(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button onClick={addExpense} className="mt-4 w-full"><Plus className="mr-2 h-4 w-4"/>Add Expense</Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="glass-card lg:col-span-3">
          <CardHeader><CardTitle>Expense Breakdown</CardTitle></CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseChartData} layout="vertical" margin={{ left: 20 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" width={100} tickLine={false} axisLine={false}/>
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: 'var(--radius)'}}/>
                    <Bar dataKey="value" barSize={20} radius={[0, 10, 10, 0]}>
                        {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
         <Card className="glass-card lg:col-span-2">
            <CardHeader><CardTitle className="flex items-center gap-2"><PiggyBank/>Savings Goals</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {savingsGoals.map(goal => {
                const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
                return (
                  <div key={goal.id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <Input value={goal.name} onChange={e => setSavingsGoals(savingsGoals.map(s => s.id === goal.id ? {...s, name: e.target.value} : s))} className="bg-transparent border-none p-0 h-auto font-semibold" />
                      <span className="font-bold">${goal.current} / ${goal.target}</span>
                    </div>
                    <Progress value={progress} />
                  </div>
                )
              })}
              <Button onClick={addSavingsGoal} className="mt-4 w-full"><Plus className="mr-2 h-4 w-4"/>Add Savings Goal</Button>
            </CardContent>
        </Card>
      </div>

       <Card className="glass-card">
          <CardHeader><CardTitle>Bill Payment Tracker</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="grid grid-cols-5 gap-2 font-bold text-sm text-muted-foreground">
                <div>Status</div><div>Bill Name</div><div>Due Date</div><div>Amount</div><div>Actions</div>
              </div>
              {bills.map(bill => (
                <div key={bill.id} className="grid grid-cols-5 items-center gap-2 p-2 rounded-lg bg-white/10">
                  <Checkbox checked={bill.paid} onCheckedChange={checked => setBills(bills.map(b => b.id === bill.id ? {...b, paid: !!checked} : b))} />
                  <Input value={bill.name} onChange={e => setBills(bills.map(b => b.id === bill.id ? {...b, name: e.target.value} : b))} className="bg-transparent"/>
                  <Input type="date" value={bill.dueDate} onChange={e => setBills(bills.map(b => b.id === bill.id ? {...b, dueDate: e.target.value} : b))} className="bg-transparent"/>
                  <Input type="number" value={bill.amount} onChange={e => setBills(bills.map(b => b.id === bill.id ? {...b, amount: +e.target.value} : b))} className="bg-transparent"/>
                  <Button variant="ghost" size="icon" onClick={() => removeBill(bill.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
            <Button onClick={addBill} className="mt-4 w-full"><Plus className="mr-2 h-4 w-4"/>Add Bill</Button>
          </CardContent>
        </Card>
        
      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Target/>Long-Term Financial Goals</CardTitle></CardHeader>
        <CardContent>
            <Textarea placeholder="e.g., Retire by 55, Buy a house in 5 years..." className="h-24 bg-white/10"/>
        </CardContent>
      </Card>
      
      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-green-500 to-teal-500 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}
