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
import { Pin } from 'lucide-react';

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
              Pinned
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-200 animate-float" style={{ animationDelay: '0s' }}>
            <Pin className="h-4 w-4 transform -rotate-45 text-pink-400" />
            <span>Weekly Stand up Meeting</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-200 animate-float" style={{ animationDelay: '0.2s' }}>
            <Pin className="h-4 w-4 transform -rotate-45 text-blue-400" />
            <span>Weekly All Hands Call</span>
          </div>
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
