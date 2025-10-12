'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Briefcase, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const initialTasks = [
  { id: 1, task: 'Finalize Q3 report', status: 'In-Progress', deadline: '2024-08-05' },
  { id: 2, task: 'Prepare for client presentation', status: 'Todo', deadline: '2024-08-10' },
];
const initialMeetings = [
    { id: 1, time: '10:00', title: 'Team Sync', attendees: 'All' },
];

export default function WorkPlannerPage() {
  const { toast } = useToast();
  const [tasks, setTasks] = useLocalStorageState('workPlanner_tasks', initialTasks);
  const [meetings, setMeetings] = useLocalStorageState('workPlanner_meetings', initialMeetings);
  const [notes, setNotes] = useLocalStorageState('workPlanner_notes', '');

  const handleSave = () => {
    toast({
      title: 'Work Planner Saved!',
      description: 'Your work schedule has been updated.',
    });
  };

  const addTask = () => setTasks([...tasks, { id: Date.now(), task: '', status: 'Todo', deadline: '' }]);
  const removeTask = (id: number) => setTasks(tasks.filter(t => t.id !== id));
  
  const addMeeting = () => setMeetings([...meetings, { id: Date.now(), time: '', title: '', attendees: '' }]);
  const removeMeeting = (id: number) => setMeetings(meetings.filter(m => m.id !== id));

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Briefcase className="h-8 w-8 text-primary" />
          Work Planner
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle>Task/Project Tracker</CardTitle></CardHeader>
          <CardContent>
            {tasks.map(task => (
              <div key={task.id} className="grid grid-cols-4 items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                <Input value={task.task} onChange={e => setTasks(tasks.map(t => t.id === task.id ? {...t, task: e.target.value} : t))} placeholder="Task" className="bg-transparent col-span-2" />
                <Select value={task.status} onValueChange={value => setTasks(tasks.map(t => t.id === task.id ? {...t, status: value} : t))}>
                  <SelectTrigger className="bg-transparent"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todo">Todo</SelectItem>
                    <SelectItem value="In-Progress">In-Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={() => removeTask(task.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button onClick={addTask} className="w-full mt-4">Add Task</Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader><CardTitle>Meeting Schedule</CardTitle></CardHeader>
          <CardContent>
            {meetings.map(meeting => (
              <div key={meeting.id} className="grid grid-cols-4 items-center gap-2 mb-2 p-2 rounded-lg bg-white/10">
                <Input type="time" value={meeting.time} onChange={e => setMeetings(meetings.map(m => m.id === meeting.id ? {...m, time: e.target.value} : m))} className="bg-transparent" />
                <Input value={meeting.title} onChange={e => setMeetings(meetings.map(m => m.id === meeting.id ? {...m, title: e.target.value} : m))} placeholder="Title" className="bg-transparent col-span-2" />
                <Button variant="ghost" size="icon" onClick={() => removeMeeting(meeting.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button onClick={addMeeting} className="w-full mt-4">Add Meeting</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader><CardTitle>Meeting Notes</CardTitle></CardHeader>
        <CardContent>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="- Key discussion points..." className="h-48 bg-white/5" />
        </CardContent>
      </Card>
      
      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}
