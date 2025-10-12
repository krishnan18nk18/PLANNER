
'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Utensils, Trash2, Plus, Star, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useDoc, useUser, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Droplet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Textarea } from '@/components/ui/textarea';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

const initialMenu = Array.from({ length: 7 }, () => Array(4).fill(''));
const initialGroceries = [
  { id: 1, name: 'Chicken Breast', category: 'Protein', acquired: false },
  { id: 2, name: 'Broccoli', category: 'Vegetables', acquired: false },
];
const initialMacros = { protein: 120, carbs: 200, fat: 60 };

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const initialPlannerState = {
    menu: initialMenu,
    groceries: initialGroceries,
    waterIntake: 0,
    macros: initialMacros,
    recipes: [{id: 1, name: 'Grilled Chicken Salad', prepTime: 20, rating: 4}]
}

export default function MealPlannerPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const { db } = useFirestore();

  const plannerPath = user ? `users/${user.uid}/planners/meal` : null;
  const { data: plannerData, loading } = useDoc<typeof initialPlannerState>(plannerPath);

  const plannerState = plannerData || initialPlannerState;
  
  const handleSave = () => {
    if (!db || !user) return;
    const docRef = doc(db, plannerPath!);
    setDoc(docRef, plannerState, { merge: true })
      .then(() => {
        toast({
          title: 'Meal Planner Saved!',
          description: 'Your meal plan has been updated.',
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

  const addGroceryItem = () => {
    updatePlanner({ groceries: [...plannerState.groceries, { id: Date.now(), name: '', category: 'Misc', acquired: false }]});
  };
  
  const removeGroceryItem = (id: number) => {
    updatePlanner({ groceries: plannerState.groceries.filter(item => item.id !== id) });
  };
  
  const addRecipe = () => {
    updatePlanner({ recipes: [...plannerState.recipes, { id: Date.now(), name: 'New Recipe', prepTime: 0, rating: 0 }]});
  };

  const removeRecipe = (id: number) => {
    updatePlanner({ recipes: plannerState.recipes.filter(r => r.id !== id) });
  };
  
  const macroChartData = [
      { name: 'Protein', value: plannerState.macros.protein },
      { name: 'Carbs', value: plannerState.macros.carbs },
      { name: 'Fat', value: plannerState.macros.fat },
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
          <Utensils className="h-8 w-8 text-primary" />
          Meal & Diet Planner
        </h1>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Weekly Menu</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-1 min-w-[900px]">
            <div></div>
            {days.map(day => <div key={day} className="font-bold text-center">{day}</div>)}
            
            {meals.map((meal, mealIndex) => (
              <React.Fragment key={meal}>
                <div className="font-bold pr-2 text-right self-center">{meal}</div>
                {days.map((day, dayIndex) => (
                  <Textarea
                    key={`${day}-${meal}`}
                    value={plannerState.menu[dayIndex][mealIndex]}
                    onChange={(e) => {
                      const newMenu = [...plannerState.menu];
                      newMenu[dayIndex][mealIndex] = e.target.value;
                      updatePlanner({ menu: newMenu });
                    }}
                    className="h-24 text-xs p-1 bg-white/10"
                    placeholder="Meal details..."
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
            <CardHeader><CardTitle>Grocery List</CardTitle></CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
                {plannerState.groceries.map(item => (
                    <div key={item.id} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                        <Checkbox checked={item.acquired} onCheckedChange={checked => updatePlanner({ groceries: plannerState.groceries.map(g => g.id === item.id ? {...g, acquired: !!checked} : g)})} />
                        <Input value={item.name} onChange={e => updatePlanner({ groceries: plannerState.groceries.map(g => g.id === item.id ? {...g, name: e.target.value} : g)})} placeholder="Item name" className="flex-grow bg-transparent" />
                        <Input value={item.category} onChange={e => updatePlanner({ groceries: plannerState.groceries.map(g => g.id === item.id ? {...g, category: e.target.value} : g)})} placeholder="Category" className="w-32 bg-transparent" />
                        <Button variant="ghost" size="icon" onClick={() => removeGroceryItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                ))}
                <Button onClick={addGroceryItem} className="w-full mt-4"><Plus className="mr-2 h-4 w-4"/>Add Item</Button>
            </CardContent>
        </Card>
        <div className="space-y-6">
            <Card className="glass-card">
                <CardHeader><CardTitle>Water Intake</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <Droplet
                            key={i}
                            className={`h-10 w-10 cursor-pointer transition-colors ${i < plannerState.waterIntake ? 'text-blue-400 fill-current' : 'text-gray-500'}`}
                            onClick={() => updatePlanner({ waterIntake: i + 1 })}
                        />
                    ))}
                </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader><CardTitle>Macro Tracker (grams)</CardTitle></CardHeader>
              <CardContent className="h-48">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={macroChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} label>
                            {macroChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
      </div>
       <Card className="glass-card">
          <CardHeader><CardTitle>Favorite Recipes</CardTitle></CardHeader>
          <CardContent>
            {plannerState.recipes.map(recipe => (
              <div key={recipe.id} className="grid grid-cols-4 items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                <Input value={recipe.name} onChange={e => updatePlanner({ recipes: plannerState.recipes.map(r => r.id === recipe.id ? {...r, name: e.target.value} : r) })} placeholder="Recipe Name" className="bg-transparent col-span-2" />
                 <Input type="number" value={recipe.prepTime} onChange={e => updatePlanner({ recipes: plannerState.recipes.map(r => r.id === recipe.id ? {...r, prepTime: +e.target.value} : r) })} placeholder="Prep time (min)" className="bg-transparent" />
                <Button variant="ghost" size="icon" onClick={() => removeRecipe(recipe.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button onClick={addRecipe} className="w-full mt-4"><Plus className="mr-2 h-4 w-4"/>Add Recipe</Button>
          </CardContent>
        </Card>

      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}
