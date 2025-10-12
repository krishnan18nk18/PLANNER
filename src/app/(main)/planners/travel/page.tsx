'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plane, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorageState } from '@/hooks/use-local-storage-state';

const initialPackingList = [
    { id: 1, category: 'Clothes', item: 'T-shirts', packed: false },
    { id: 2, category: 'Documents', item: 'Passport', packed: true },
];
const initialItinerary = [
    { id: 1, day: 1, location: 'Tokyo', activities: 'Visit Shibuya Crossing' },
];

export default function TravelPlannerPage() {
  const { toast } = useToast();
  const [tripName, setTripName] = useLocalStorageState('travelPlanner_tripName', 'Japan Adventure');
  const [dates, setDates] = useLocalStorageState('travelPlanner_dates', '2024-10-10 to 2024-10-24');
  const [packingList, setPackingList] = useLocalStorageState('travelPlanner_packingList', initialPackingList);
  const [itinerary, setItinerary] = useLocalStorageState('travelPlanner_itinerary', initialItinerary);

  const handleSave = () => {
    toast({
      title: 'Travel Planner Saved!',
      description: 'Your trip details have been updated.',
    });
  };

  const addPackingItem = () => setPackingList([...packingList, { id: Date.now(), category: 'Misc', item: '', packed: false }]);
  const removePackingItem = (id: number) => setPackingList(packingList.filter(item => item.id !== id));
  
  const addItineraryItem = () => setItinerary([...itinerary, { id: Date.now(), day: itinerary.length + 1, location: '', activities: '' }]);
  const removeItineraryItem = (id: number) => setItinerary(itinerary.filter(item => item.id !== id));

  return (
    <div className="space-y-6 animate-fade-in p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="h-10 w-10">
          <Link href="/planners"><ArrowLeft /></Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2">
          <Plane className="h-8 w-8 text-primary" />
          Travel/Trip Planner
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input placeholder="Trip Name" value={tripName} onChange={e => setTripName(e.target.value)} className="h-12 text-lg"/>
        <Input placeholder="Dates" value={dates} onChange={e => setDates(e.target.value)} className="h-12 text-lg"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card">
          <CardHeader><CardTitle>Packing Checklist</CardTitle></CardHeader>
          <CardContent>
            {packingList.map(item => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/10 mb-2">
                    <Checkbox checked={item.packed} onCheckedChange={checked => setPackingList(packingList.map(p => p.id === item.id ? {...p, packed: !!checked} : p))} />
                    <Input value={item.item} onChange={e => setPackingList(packingList.map(p => p.id === item.id ? {...p, item: e.target.value} : p))} placeholder="Item" className="bg-transparent" />
                    <Button variant="ghost" size="icon" onClick={() => removePackingItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
            ))}
            <Button onClick={addPackingItem} className="w-full mt-4">Add Item</Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader><CardTitle>Itinerary</CardTitle></CardHeader>
          <CardContent>
             {itinerary.map(item => (
                <div key={item.id} className="p-2 rounded-lg bg-white/10 mb-2">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold">Day {item.day} - {item.location}</h4>
                         <Button variant="ghost" size="icon" onClick={() => removeItineraryItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                    <Textarea value={item.activities} onChange={e => setItinerary(itinerary.map(i => i.id === item.id ? {...i, activities: e.target.value} : i))} placeholder="Activities..." className="bg-transparent mt-1" />
                </div>
            ))}
            <Button onClick={addItineraryItem} className="w-full mt-4">Add Day</Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="fixed bottom-8 right-8 z-50">
        <Button onClick={handleSave} className="rounded-full w-24 h-12 bg-gradient-to-r from-blue-500 to-teal-500 text-white hover:scale-110 transition-transform shadow-lg">
          Save
        </Button>
      </div>
    </div>
  );
}
