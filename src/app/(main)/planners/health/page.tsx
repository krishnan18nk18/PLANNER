'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, HeartPulse, Trash2, Upload } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const initialWorkouts = [
  { id: 1, date: '2024-07-26', type: 'Weightlifting', exercise: 'Bench Press', sets: 3, reps: 10, duration: 60 },
];
const initialMeasurements = [
    { date: '2024-07-01', weight: 180, chest: 42, waist: 34 },
    { date: '2024-07-15', weight: 178, chest: 42.5, waist: 33.5 },
];
const initialSymptoms = [{ id: 1, date: '2024-07-26', symptom: 'Headache', severity: 5 }];

export default function HealthPlannerPage() {
  const { toast } = useToast();
  const [workouts, setWorkouts] = useLocalStorageState('healthPlanner_workouts', initialWorkouts);
  const [measurements, setMeasurements] = useLocalStorageState('healthPlanner_measurements', initialMeasurements);
  const [symptoms, setSymptoms] = useLocalStorageState('healthPlanner_symptoms', initialSymptoms);

  const handleSave = () => {
    toast({
      title: 'Health Planner Saved!',
      description: 'Your health and fitness data has been updated.',
    });
  };

  const addWorkout = () => setWorkouts([...workouts, { id: Date.now(), date: '', type: '', exercise: '', sets: 0, reps: 0, duration: 0 }]);
  const removeWorkout = (id: number) => setWorkouts(workouts.filter(w => w.id !== id));
  
  const addSymptom = () => setSymptoms([...symptoms, { id: Date.now(), date: '', symptom: '', severity: 1 }]);
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
        <CardHeader><CardTitle>Workout Log</CardTitle></CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="space-y-2 min-w-[600px]">
            <div className="grid grid-cols-7 gap-2 font-bold text-sm">
                <div>Date</div><div>Type</div><div>Exercise</div><div>Sets</div><div>Reps</div><div>Duration (min)</div><div>Actions</div>
            </div>
            {workouts.map(workout => (
              <div key={workout.id} className="grid grid-cols-7 gap-2 items-center">
                <Input type="date" value={workout.date} onChange={(e) => setWorkouts(workouts.map(w => w.id === workout.id ? {...w, date: e.target.value} : w))} />
                <Input value={workout.type} onChange={(e) => setWorkouts(workouts.map(w => w.id === workout.id ? {...w, type: e.target.value} : w))} />
                <Input value={workout.exercise} onChange={(e) => setWorkouts(workouts.map(w => w.id === workout.id ? {...w, exercise: e.target.value} : w))} />
                <Input type="number" value={workout.sets} onChange={(e) => setWorkouts(workouts.map(w => w.id === workout.id ? {...w, sets: +e.target.value} : w))} />
                <Input type="number" value={workout.reps} onChange={(e) => setWorkouts(workouts.map(w => w.id === workout.id ? {...w, reps: +e.target.value} : w))} />
                <Input type="number" value={workout.duration} onChange={(e) => setWorkouts(workouts.map(w => w.id === workout.id ? {...w, duration: +e.target.value} : w))} />
                <Button variant="ghost" size="icon" onClick={() => removeWorkout(workout.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
          </div>
          <Button onClick={addWorkout} className="mt-4">Add Workout</Button>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader><CardTitle>Progress Chart (Weight)</CardTitle></CardHeader>
        <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={measurements}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="date" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
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
            <div key={symptom.id} className="grid grid-cols-4 gap-2 items-center mb-2">
                <Input type="date" value={symptom.date} onChange={(e) => setSymptoms(symptoms.map(s => s.id === symptom.id ? {...s, date: e.target.value} : s))} />
                <Input value={symptom.symptom} onChange={(e) => setSymptoms(symptoms.map(s => s.id === symptom.id ? {...s, symptom: e.target.value} : s))} placeholder="Symptom" />
                <Input type="number" value={symptom.severity} onChange={(e) => setSymptoms(symptoms.map(s => s.id === symptom.id ? {...s, severity: +e.target.value} : s))} placeholder="Severity (1-10)" />
                <Button variant="ghost" size="icon" onClick={() => removeSymptom(symptom.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          <Button onClick={addSymptom} className="mt-4">Add Symptom Entry</Button>
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
