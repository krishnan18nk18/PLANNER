'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, HeartPulse, Trash2, Droplet, Dumbbell, Star } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';

const initialWorkouts = [
  { id: 1, date: '2024-07-26', type: 'Weightlifting', exercise: 'Bench Press', sets: 3, reps: 10, duration: 60 },
];
const initialMeasurements = [
    { date: '2024-07-01', weight: 180, chest: 42, waist: 34 },
    { date: '2024-07-15', weight: 178, chest: 42.5, waist: 33.5 },
];
const initialSymptoms = [{ id: 1, date: '2024-07-26', symptom: 'Headache', severity: 5 }];
const initialNutrition = { calories: 2200, protein: 150, carbs: 250, fat: 70 };
const initialSleep = { hours: 7, quality: 4 };

export default function HealthPlannerPage() {
  const { toast } = useToast();
  const [date, setDate] = useLocalStorageState('healthPlanner_date', new Date().toISOString().split('T')[0]);
  const [workouts, setWorkouts] = useLocalStorageState('healthPlanner_workouts', initialWorkouts);
  const [measurements, setMeasurements] = useLocalStorageState('healthPlanner_measurements', initialMeasurements);
  const [symptoms, setSymptoms] = useLocalStorageState('healthPlanner_symptoms', initialSymptoms);
  const [nutrition, setNutrition] = useLocalStorageState('healthPlanner_nutrition', initialNutrition);
  const [sleep, setSleep] = useLocalStorageState('healthPlanner_sleep', initialSleep);
  const [waterIntake, setWaterIntake] = useLocalStorageState('healthPlanner_water', 4);

  const handleSave = () => {
    toast({
      title: 'Health Planner Saved!',
      description: 'Your health and fitness data has been updated.',
    });
  };

  const addWorkout = () => setWorkouts([...workouts, { id: Date.now(), date: date, type: '', exercise: '', sets: 0, reps: 0, duration: 0 }]);
  const removeWorkout = (id: number) => setWorkouts(workouts.filter(w => w.id !== id));
  
  const addSymptom = () => setSymptoms([...symptoms, { id: Date.now(), date: date, symptom: '', severity: 1 }]);
  const removeSymptom = (id: number) => setSymptoms(symptoms.filter(s => s.id !== id));

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-primary" />
          Health & Fitness Planner
        </h1>
      </div>
      
       <Card className="glass-card">
          <CardContent className="pt-6 flex justify-between items-center">
            <div>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto bg-transparent border-none text-2xl font-bold p-0 focus-visible:ring-0" />
              <p className="text-muted-foreground">{format(new Date(date), 'EEEE')}</p>
            </div>
            <Card className="glass-card from-red-500/30 to-pink-500/30 p-4 text-center">
                <CardTitle className="text-sm">Health Goal</CardTitle>
                <CardContent className="p-0 pt-2"><Input defaultValue="Stay active and hydrated" className="bg-transparent text-center border-none focus-visible:ring-0"/></CardContent>
            </Card>
          </CardContent>
        </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
            <CardHeader><CardTitle className="flex items-center gap-2"><Dumbbell/>Workout Log</CardTitle></CardHeader>
            <CardContent className="max-h-96 overflow-y-auto">
              <div className="space-y-2">
                {workouts.filter(w => w.date === date).map(workout => (
                  <div key={workout.id} className="p-4 rounded-xl bg-white/10">
                      <div className="flex justify-between items-center">
                        <Input value={workout.exercise} onChange={(e) => setWorkouts(workouts.map(w => w.id === workout.id ? {...w, exercise: e.target.value} : w))} className="bg-transparent text-lg font-semibold border-none" />
                        <Button variant="ghost" size="icon" onClick={() => removeWorkout(workout.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                        <Input type="number" value={workout.sets} onChange={(e) => setWorkouts(workouts.map(w => w.id === workout.id ? {...w, sets: +e.target.value} : w))} placeholder="Sets" className="bg-white/10" />
                        <Input type="number" value={workout.reps} onChange={(e) => setWorkouts(workouts.map(w => w.id === workout.id ? {...w, reps: +e.target.value} : w))} placeholder="Reps" className="bg-white/10" />
                        <Input type="number" value={workout.duration} onChange={(e) => setWorkouts(workouts.map(w => w.id === workout.id ? {...w, duration: +e.target.value} : w))} placeholder="Mins" className="bg-white/10" />
                      </div>
                  </div>
                ))}
              </div>
              <Button onClick={addWorkout} className="mt-4 w-full"><Plus className="mr-2 h-4 w-4" /> Add Workout</Button>
            </CardContent>
        </Card>

        <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader><CardTitle>Water Intake</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Droplet
                    key={i}
                    className={`h-10 w-10 cursor-pointer transition-all duration-300 ${i < waterIntake ? 'text-blue-400 fill-current scale-110' : 'text-gray-500'}`}
                    onClick={() => setWaterIntake(i + 1)}
                  />
                ))}
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader><CardTitle>Sleep Tracker</CardTitle></CardHeader>
              <CardContent className="flex items-center gap-4">
                <Input type="number" value={sleep.hours} onChange={e => setSleep({...sleep, hours: +e.target.value})} placeholder="Hours" className="bg-white/10"/>
                <div className="flex items-center gap-1">
                    {Array.from({length: 5}).map((_, i) => (
                        <Star key={i} className={`cursor-pointer ${i < sleep.quality ? 'text-yellow-400 fill-current' : 'text-gray-500'}`} onClick={() => setSleep({...sleep, quality: i+1})}/>
                    ))}
                </div>
              </CardContent>
            </Card>
        </div>
      </div>
      
      <Card className="glass-card">
        <CardHeader><CardTitle>Progress Chart (Weight)</CardTitle></CardHeader>
        <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={measurements}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" tickFormatter={(val) => format(new Date(val), 'MMM d')} />
                    <YAxis stroke="rgba(255,255,255,0.7)" domain={['dataMin - 5', 'dataMax + 5']} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30,30,30,0.8)', border: 'none' }} />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Symptom Log</CardTitle></CardHeader>
        <CardContent>
          {symptoms.map(symptom => (
            <div key={symptom.id} className="grid grid-cols-4 items-center gap-2 mb-2 p-2 rounded-xl bg-white/10">
                <Input type="date" value={symptom.date} onChange={(e) => setSymptoms(symptoms.map(s => s.id === symptom.id ? {...s, date: e.target.value} : s))} className="bg-transparent" />
                <Input value={symptom.symptom} onChange={(e) => setSymptoms(symptoms.map(s => s.id === symptom.id ? {...s, symptom: e.target.value} : s))} placeholder="Symptom" className="bg-transparent col-span-2" />
                <Button variant="ghost" size="icon" onClick={() => removeSymptom(symptom.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          <Button onClick={addSymptom} className="mt-4 w-full"><Plus className="mr-2 h-4 w-4"/>Add Symptom Entry</Button>
        </CardContent>
      </Card>

      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-red-500 to-pink-500 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}
