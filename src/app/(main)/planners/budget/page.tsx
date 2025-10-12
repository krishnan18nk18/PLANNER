'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, DollarSign, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const initialIncome = [{ id: 1, source: 'Salary', amount: 5000, date: '2024-07-01' }];
const initialExpenses = [{ id: 1, category: 'Rent', amount: 1500, date: '2024-07-01' }];
const initialSavings = [{ id: 1, goal: 'Vacation', target: 2000, current: 500 }];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function BudgetPlannerPage() {
  const { toast } = useToast();
  const [income, setIncome] = useLocalStorageState('budgetPlanner_income', initialIncome);
  const [expenses, setExpenses] = useLocalStorageState('budgetPlanner_expenses', initialExpenses);
  const [savings, setSavings] = useLocalStorageState('budgetPlanner_savings', initialSavings);

  const handleSave = () => {
    toast({
      title: 'Budget Planner Saved!',
      description: 'Your financial data has been saved.',
    });
  };

  const addIncome = () => setIncome([...income, { id: Date.now(), source: '', amount: 0, date: '' }]);
  const removeIncome = (id: number) => setIncome(income.filter(i => i.id !== id));
  
  const addExpense = () => setExpenses([...expenses, { id: Date.now(), category: '', amount: 0, date: '' }]);
  const removeExpense = (id: number) => setExpenses(expenses.filter(e => e.id !== id));

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
          Budget Planner
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        <Card className="glass-card"><CardHeader><CardTitle>Total Income</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-green-400">${totalIncome.toFixed(2)}</p></CardContent></Card>
        <Card className="glass-card"><CardHeader><CardTitle>Total Expenses</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold text-red-400">${totalExpenses.toFixed(2)}</p></CardContent></Card>
        <Card className="glass-card"><CardHeader><CardTitle>Balance</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">${balance.toFixed(2)}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle>Income Tracker</CardTitle></CardHeader>
          <CardContent>
            {income.map(item => (
              <div key={item.id} className="grid grid-cols-4 items-center gap-2 mb-2">
                <Input value={item.source} onChange={(e) => setIncome(income.map(i => i.id === item.id ? {...i, source: e.target.value} : i))} placeholder="Source" />
                <Input type="number" value={item.amount} onChange={(e) => setIncome(income.map(i => i.id === item.id ? {...i, amount: Number(e.target.value)} : i))} placeholder="Amount" />
                <Input type="date" value={item.date} onChange={(e) => setIncome(income.map(i => i.id === item.id ? {...i, date: e.target.value} : i))} />
                <Button variant="ghost" size="icon" onClick={() => removeIncome(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button onClick={addIncome} className="mt-4 w-full">Add Income</Button>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader><CardTitle>Expense Tracker</CardTitle></CardHeader>
          <CardContent>
            {expenses.map(item => (
              <div key={item.id} className="grid grid-cols-4 items-center gap-2 mb-2">
                <Input value={item.category} onChange={(e) => setExpenses(expenses.map(ex => ex.id === item.id ? {...ex, category: e.target.value} : ex))} placeholder="Category" />
                <Input type="number" value={item.amount} onChange={(e) => setExpenses(expenses.map(ex => ex.id === item.id ? {...ex, amount: Number(e.target.value)} : ex))} placeholder="Amount" />
                <Input type="date" value={item.date} onChange={(e) => setExpenses(expenses.map(ex => ex.id === item.id ? {...ex, date: e.target.value} : ex))} />
                <Button variant="ghost" size="icon" onClick={() => removeExpense(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button onClick={addExpense} className="mt-4 w-full">Add Expense</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Expense Breakdown</CardTitle></CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={expenseChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                {expenseChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
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
