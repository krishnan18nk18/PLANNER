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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-headline text-lg">Taskfly</CardTitle>
        </div>
        <Tabs defaultValue="personal" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal" className='data-[state=active]:bg-pink-200 data-[state=active]:text-pink-900'>
              <span className="font-bold text-xl mr-2">3</span> Personal
            </TabsTrigger>
            <TabsTrigger value="official" className='data-[state=active]:bg-blue-200 data-[state=active]:text-blue-900'>
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
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="pinned"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
            >
              Pinned
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Pin className="h-4 w-4 transform -rotate-45" />
            <span>Weekly Stand up Meeting</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Pin className="h-4 w-4 transform -rotate-45" />
            <span>Weekly All Hands Call</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-semibold mb-4">Add New Task</h4>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="sr-only">Title</Label>
              <Input id="title" placeholder="Title" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input type="text" placeholder="24/06/20" />
              <Input type="text" placeholder="9:00 AM" />
            </div>
             <div className="grid grid-cols-2 gap-4">
              <Input type="text" placeholder="24/06/20" />
              <Input type="text" placeholder="11:00 AM" />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Does not Repeat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
             <Textarea placeholder="Add Note" />
            <div className="flex justify-end gap-2">
                <Button variant="ghost">Cancel</Button>
                <Button>Save</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
