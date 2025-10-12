'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { BookCopy, MessageSquare, Pin } from 'lucide-react';

const pinnedNotes = [
  {
    id: '1',
    text: 'Weekly Stand up Meeting',
    icon: MessageSquare,
    color: 'from-purple-500 to-indigo-500',
    delay: '0s',
  },
  {
    id: '2',
    text: 'Weekly All Hands Call',
    icon: BookCopy,
    color: 'from-blue-500 to-sky-500',
    delay: '0.2s',
  },
  {
    id: '3',
    text: 'Review Q2 performance',
    icon: Pin,
    color: 'from-pink-500 to-rose-500',
    delay: '0.4s',
  }
];

export function WeeklyPlanner() {
  return (
    <Card className="glass-card text-white border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-lg text-white">Taskfly</CardTitle>
        </div>
        <Tabs defaultValue="personal" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger value="personal" className='data-[state=active]:bg-pink-500/50 data-[state=active]:text-white'>
              <span className="font-bold text-xl mr-2">3</span> Personal
            </TabsTrigger>
            <TabsTrigger value="official" className='data-[state=active]:bg-blue-500/50 data-[state=active]:text-white'>
              <span className="font-bold text-xl mr-2">4</span> Official
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="w-full flex justify-start bg-transparent p-0">
            <TabsTrigger
              value="weekly"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none text-gray-300"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="pinned"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none text-gray-300"
            >
              Pinned Notes
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-6 space-y-4">
          {pinnedNotes.map((note) => (
            <div
              key={note.id}
              className={cn(
                'glass-card p-4 flex items-center gap-4 animate-float hover:scale-105 transform transition-all duration-300 rounded-2xl bg-gradient-to-r text-white shadow-lg hover:shadow-xl',
                note.color
              )}
              style={{ animationDelay: note.delay }}
            >
              <div className="p-2 bg-white/20 rounded-lg">
                <note.icon className="h-5 w-5" />
              </div>
              <span className="font-medium text-sm">{note.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h4 className="font-semibold mb-4 text-white">Add New Task</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="sr-only">Title</Label>
              <Input id="title" placeholder="Title" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"/>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input type="text" placeholder="24/06/20" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"/>
              <Input type="text" placeholder="9:00 AM" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"/>
            </div>
             <div className="grid grid-cols-2 gap-4">
              <Input type="text" placeholder="24/06/20" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"/>
              <Input type="text" placeholder="11:00 AM" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"/>
            </div>
            <Select>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Does not Repeat" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-700">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
             <Textarea placeholder="Add Note" className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"/>
            <div className="flex justify-end gap-2">
                <Button variant="ghost" className="text-white hover:bg-white/10">Cancel</Button>
                <Button className="bg-blue-500 hover:bg-blue-600">Save</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
