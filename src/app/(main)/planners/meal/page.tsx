'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Utensils, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { Droplet } from 'lucide-react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const meals = ['Breakfast', 'Lunch', 'Dinner'];

const initialMenu = Array.from({ length: 7 }, () => Array(3).fill(''));
const initialGroceries = [
  { id: 1, name: 'Chicken Breast', acquired: false },
  { id: 2, name: 'Broccoli', acquired: false },
];

export default function MealPlannerPage() {
  const { toast } = useToast();
  const [menu, setMenu] = useLocalStorageState('mealPlanner_menu', initialMenu);
  const [groceries, setGroceries] = useLocalStorageState('mealPlanner_groceries', initialGroceries);
  const [waterIntake, setWaterIntake] = useLocalStorageState('mealPlanner_water', 0);

  const handleSave = () => {
    toast({
      title: 'Meal Planner Saved!',
      description: 'Your meal plan has been updated.',
    });
  };

  const addGroceryItem = () => {
    setGroceries([...groceries, { id: Date.now(), name: '', acquired: false }]);
  };
  
  const removeGroceryItem = (id: number) => {
    setGroceries(groceries.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Utensils className="h-8 w-8 text-primary" />
          Meal/Diet Planner
        </h1>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Weekly Menu</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="grid grid-cols-8 gap-1 min-w-[800px]">
            <div></div>
            {days.map(day => <div key={day} className="font-bold text-center">{day}</div>)}
            
            {meals.map((meal, mealIndex) => (
              <>
                <div key={meal} className="font-bold pr-2 text-right">{meal}</div>
                {days.map((day, dayIndex) => (
                  <Input
                    key={`${day}-${meal}`}
                    value={menu[dayIndex][mealIndex]}
                    onChange={(e) => {
                      const newMenu = [...menu];
                      newMenu[dayIndex][mealIndex] = e.target.value;
                      setMenu(newMenu);
                    }}
                    className="h-16 text-xs p-1"
                  />
                ))}
              </>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass-card">
            <CardHeader><CardTitle>Grocery List</CardTitle></CardHeader>
            <CardContent>
                {groceries.map(item => (
                    <div key={item.id} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                        <Checkbox checked={item.acquired} onCheckedChange={checked => setGroceries(groceries.map(g => g.id === item.id ? {...g, acquired: !!checked} : g))} />
                        <Input value={item.name} onChange={e => setGroceries(groceries.map(g => g.id === item.id ? {...g, name: e.target.value} : g))} className="flex-grow bg-transparent" />
                        <Button variant="ghost" size="icon" onClick={() => removeGroceryItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                ))}
                <Button onClick={addGroceryItem} className="w-full mt-4">Add Item</Button>
            </CardContent>
        </Card>
        <Card className="glass-card">
            <CardHeader><CardTitle>Water Intake</CardTitle></CardHeader>
            <CardContent className="flex justify-around items-center h-full">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Droplet
                        key={i}
                        className={`h-10 w-10 cursor-pointer transition-colors ${i < waterIntake ? 'text-blue-400 fill-current' : 'text-gray-500'}`}
                        onClick={() => setWaterIntake(i + 1)}
                    />
                ))}
            </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}
