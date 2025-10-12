'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Target, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Progress } from '@/components/ui/progress';
import { eachMonthOfInterval, format, startOfYear, endOfYear } from 'date-fns';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';

const currentYear = new Date();

const initialMilestones = [
    { id: 1, text: 'Launch new project', targetDate: '2024-03-31', completed: false },
    { id: 2, text: 'Reach 10k users', targetDate: '2024-06-30', completed: false },
];
const initialBucketList = [
    { id: 1, text: 'Learn a new language', completed: false },
    { id: 2, text: 'Travel to Japan', completed: false },
];
const initialQuarterlyProgress = [25, 50, 10, 0];

export default function AnnualPlannerPage() {
  const { toast } = useToast();
  const [year, setYear] = useState(currentYear);
  const [milestones, setMilestones] = useLocalStorageState('annualPlanner_milestones', initialMilestones);
  const [bucketList, setBucketList] = useLocalStorageState('annualPlanner_bucketList', initialBucketList);
  const [quarterlyProgress, setQuarterlyProgress] = useLocalStorageState('annualPlanner_quarterlyProgress', initialQuarterlyProgress);

  const months = eachMonthOfInterval({
    start: startOfYear(year),
    end: endOfYear(year)
  });

  const handleSave = () => {
    toast({
      title: 'Annual Planner Saved!',
      description: 'Your plans for the year have been saved.',
    });
  };

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now(), text: '', targetDate: '', completed: false }]);
  };

  const removeMilestone = (id: number) => {
    setMilestones(milestones.filter(item => item.id !== id));
  };
  
  const addBucketListItem = () => {
    setBucketList([...bucketList, { id: Date.now(), text: '', completed: false }]);
  };

  const removeBucketListItem = (id: number) => {
    setBucketList(bucketList.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
        <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="icon" className="h-10 w-10">
            <Link href="/planners">
                <ArrowLeft />
            </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Annual Planner
            </h1>
        </div>

        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Year Overview: {format(year, 'yyyy')}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
                {months.map(month => (
                    <div key={month.toString()} className="p-2 rounded-lg bg-white/10">
                        {format(month, 'MMM')}
                    </div>
                ))}
            </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Major Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {milestones.map((item) => (
                            <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/10">
                                <Checkbox checked={item.completed} onCheckedChange={checked => setMilestones(milestones.map(m => m.id === item.id ? {...m, completed: !!checked} : m))} />
                                <Input value={item.text} onChange={e => setMilestones(milestones.map(m => m.id === item.id ? {...m, text: e.target.value} : m))} className="bg-transparent border-none flex-grow" placeholder="Milestone..." />
                                <Input type="date" value={item.targetDate} onChange={e => setMilestones(milestones.map(m => m.id === item.id ? {...m, targetDate: e.target.value} : m))} className="bg-transparent border-none w-32" />
                                <Button variant="ghost" size="icon" onClick={() => removeMilestone(item.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    <Button onClick={addMilestone} className="mt-4 w-full">Add Milestone</Button>
                </CardContent>
            </Card>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Bucket List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                    {bucketList.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/10">
                            <Checkbox checked={item.completed} onCheckedChange={checked => setBucketList(bucketList.map(b => b.id === item.id ? {...b, completed: !!checked} : b))} />
                            <Input value={item.text} onChange={e => setBucketList(bucketList.map(b => b.id === item.id ? {...b, text: e.target.value} : b))} className="bg-transparent border-none flex-grow" placeholder="Bucket list item..." />
                            <Button variant="ghost" size="icon" onClick={() => removeBucketListItem(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                    </div>
                    <Button onClick={addBucketListItem} className="mt-4 w-full">Add Item</Button>
                </CardContent>
            </Card>
        </div>

        <Card className="glass-card">
            <CardHeader>
                <CardTitle>Quarterly Progress</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {quarterlyProgress.map((progress, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                        <div className="relative h-24 w-24">
                             <Progress value={progress} className="w-full h-full rounded-full" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-white">{progress}%</span>
                            </div>
                        </div>
                        <p className="font-semibold">Q{index + 1}</p>
                        <Input 
                            type="number" 
                            value={progress} 
                            onChange={e => {
                                const newProgress = [...quarterlyProgress];
                                newProgress[index] = parseInt(e.target.value);
                                setQuarterlyProgress(newProgress);
                            }}
                            className="w-20 text-center"
                        />
                    </div>
                ))}
            </CardContent>
        </Card>

      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}
