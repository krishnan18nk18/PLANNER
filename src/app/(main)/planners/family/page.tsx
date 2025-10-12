'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Users, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const familyMembers = ['Mom', 'Dad', 'Kid 1', 'Kid 2'];

const initialChores = [
  { id: 1, task: 'Do the dishes', assignedTo: 'Kid 1', completed: false },
  { id: 2, task: 'Walk the dog', assignedTo: 'Dad', completed: true },
];
const initialShoppingList = [
  { id: 1, item: 'Milk', category: 'Dairy', acquired: false },
  { id: 2, item: 'Bread', category: 'Bakery', acquired: false },
];
const initialEvents = [
    { id: 1, event: "Soccer practice", person: "Kid 1", date: "2024-07-28" }
]

export default function FamilyPlannerPage() {
  const { toast } = useToast();
  const [chores, setChores] = useLocalStorageState('familyPlanner_chores', initialChores);
  const [shoppingList, setShoppingList] = useLocalStorageState('familyPlanner_shoppingList', initialShoppingList);
  const [events, setEvents] = useLocalStorageState('familyPlanner_events', initialEvents);

  const handleSave = () => {
    toast({
      title: 'Family Planner Saved!',
      description: 'Your family\'s schedule has been updated.',
    });
  };

  const addChore = () => setChores([...chores, { id: Date.now(), task: '', assignedTo: familyMembers[0], completed: false }]);
  const removeChore = (id: number) => setChores(chores.filter(c => c.id !== id));
  
  const addShoppingItem = () => setShoppingList([...shoppingList, { id: Date.now(), item: '', category: 'Groceries', acquired: false }]);
  const removeShoppingItem = (id: number) => setShoppingList(shoppingList.filter(s => s.id !== id));
  
  const addEvent = () => setEvents([...events, { id: Date.now(), event: '', person: familyMembers[0], date: '' }]);
  const removeEvent = (id: number) => setEvents(events.filter(e => e.id !== id));

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" />
          Family Planner
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle>Chores Tracker</CardTitle></CardHeader>
          <CardContent>
            {chores.map(chore => (
              <div key={chore.id} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                <Checkbox checked={chore.completed} onCheckedChange={checked => setChores(chores.map(c => c.id === chore.id ? {...c, completed: !!checked} : c))} />
                <Input value={chore.task} onChange={e => setChores(chores.map(c => c.id === chore.id ? {...c, task: e.target.value} : c))} placeholder="Chore" className="flex-grow bg-transparent" />
                <Select value={chore.assignedTo} onValueChange={value => setChores(chores.map(c => c.id === chore.id ? {...c, assignedTo: value} : c))}>
                  <SelectTrigger className="w-32 bg-transparent"><SelectValue /></SelectTrigger>
                  <SelectContent>{familyMembers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => removeChore(chore.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button onClick={addChore} className="mt-4 w-full">Add Chore</Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader><CardTitle>Shopping List</CardTitle></CardHeader>
          <CardContent>
            {shoppingList.map(item => (
              <div key={item.id} className="flex items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                <Checkbox checked={item.acquired} onCheckedChange={checked => setShoppingList(shoppingList.map(s => s.id === item.id ? {...s, acquired: !!checked} : s))} />
                <Input value={item.item} onChange={e => setShoppingList(shoppingList.map(s => s.id === item.id ? {...s, item: e.target.value} : s))} placeholder="Item" className="flex-grow bg-transparent" />
                <Button variant="ghost" size="icon" onClick={() => removeShoppingItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button onClick={addShoppingItem} className="mt-4 w-full">Add Item</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Family Events & Appointments</CardTitle></CardHeader>
        <CardContent>
          {events.map(event => (
            <div key={event.id} className="grid grid-cols-4 items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
              <Input value={event.event} onChange={e => setEvents(events.map(ev => ev.id === event.id ? {...ev, event: e.target.value} : ev))} placeholder="Event Name" className="bg-transparent" />
              <Input type="date" value={event.date} onChange={e => setEvents(events.map(ev => ev.id === event.id ? {...ev, date: e.target.value} : ev))} className="bg-transparent" />
              <Select value={event.person} onValueChange={value => setEvents(events.map(ev => ev.id === event.id ? {...ev, person: value} : ev))}>
                <SelectTrigger className="bg-transparent"><SelectValue /></SelectTrigger>
                <SelectContent>{familyMembers.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
              </Select>
              <Button variant="ghost" size="icon" onClick={() => removeEvent(event.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
          <Button onClick={addEvent} className="mt-4 w-full">Add Event</Button>
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
