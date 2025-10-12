'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Heart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { differenceInDays } from 'date-fns';

const initialChecklist = [
  { id: 1, task: 'Book Venue', deadline: '2024-08-01', completed: true },
  { id: 2, task: 'Send Invitations', deadline: '2024-09-01', completed: false },
];
const initialGuests = [
    { id: 1, name: 'John Doe', rsvp: 'Attending', invited: true },
    { id: 2, name: 'Jane Smith', rsvp: 'Pending', invited: true },
];

export default function WeddingPlannerPage() {
  const { toast } = useToast();
  const [eventDate, setEventDate] = useLocalStorageState('weddingPlanner_eventDate', new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]);
  const [checklist, setChecklist] = useLocalStorageState('weddingPlanner_checklist', initialChecklist);
  const [guests, setGuests] = useLocalStorageState('weddingPlanner_guests', initialGuests);
  
  const daysLeft = differenceInDays(new Date(eventDate), new Date());

  const handleSave = () => {
    toast({
      title: 'Wedding Planner Saved!',
      description: 'Your event details have been updated.',
    });
  };
  
  const addChecklistItem = () => setChecklist([...checklist, { id: Date.now(), task: '', deadline: '', completed: false }]);
  const removeChecklistItem = (id: number) => setChecklist(checklist.filter(item => item.id !== id));
  
  const addGuest = () => setGuests([...guests, { id: Date.now(), name: '', rsvp: 'Pending', invited: true }]);
  const removeGuest = (id: number) => setGuests(guests.filter(guest => guest.id !== id));

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Heart className="h-8 w-8 text-pink-400" />
          Wedding/Event Planner
        </h1>
      </div>
      
      <Card className="glass-card text-center">
        <CardHeader>
            <CardTitle>Countdown</CardTitle>
        </CardHeader>
        <CardContent>
            <Input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="mb-4 w-1/2 mx-auto" />
            <p className="text-4xl font-bold text-pink-300">{daysLeft} days to go!</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle>Master Checklist</CardTitle></CardHeader>
          <CardContent>
            {checklist.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/10 mb-2">
                    <Checkbox checked={item.completed} onCheckedChange={checked => setChecklist(checklist.map(c => c.id === item.id ? {...c, completed: !!checked} : c))} />
                    <Input value={item.task} onChange={e => setChecklist(checklist.map(c => c.id === item.id ? {...c, task: e.target.value} : c))} placeholder="Task" className="bg-transparent" />
                    <Input type="date" value={item.deadline} onChange={e => setChecklist(checklist.map(c => c.id === item.id ? {...c, deadline: e.target.value} : c))} className="bg-transparent w-32" />
                    <Button variant="ghost" size="icon" onClick={() => removeChecklistItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
            ))}
            <Button onClick={addChecklistItem} className="w-full mt-4">Add Task</Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader><CardTitle>Guest List</CardTitle></CardHeader>
          <CardContent>
            {guests.map(guest => (
                <div key={guest.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/10 mb-2">
                    <Input value={guest.name} onChange={e => setGuests(guests.map(g => g.id === guest.id ? {...g, name: e.target.value} : g))} placeholder="Guest Name" className="bg-transparent" />
                    <p className="text-sm">{guest.rsvp}</p>
                    <Button variant="ghost" size="icon" onClick={() => removeGuest(guest.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
            ))}
            <Button onClick={addGuest} className="w-full mt-4">Add Guest</Button>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}
