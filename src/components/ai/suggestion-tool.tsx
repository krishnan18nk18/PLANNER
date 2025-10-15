
'use client';

import { useState, useEffect } from 'react';
import { suggestOptimalTaskTimes, type SuggestOptimalTaskTimesInput, type SuggestOptimalTaskTimesOutput } from '@/ai/flows/suggest-optimal-task-times';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function SuggestionTool() {
  const { toast } = useToast();
  const [task, setTask] = useState('');
  const [availability, setAvailability] = useState('');
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestOptimalTaskTimesOutput | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!task || !availability || !preferences) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please fill out all fields to get suggestions.',
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const input: SuggestOptimalTaskTimesInput = { task, availability, preferences };
      const suggestionResult = await suggestOptimalTaskTimes(input);
      setResult(suggestionResult);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An error occurred while getting suggestions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="task">Task</Label>
        <Input
          id="task"
          name="task"
          placeholder="e.g., 'Schedule a 1-hour workout session'"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="availability">Your Availability</Label>
        <Textarea
          id="availability"
          name="availability"
          placeholder="e.g., 'Free tomorrow from 2 PM to 5 PM. Busy on Wednesday morning.'"
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferences">Preferences</Label>
        <Textarea
          id="preferences"
          name="preferences"
          placeholder="e.g., 'I prefer to work out in the afternoon. Avoid scheduling during lunch hours (12 PM - 1 PM).'"
          value={preferences}
          onChange={(e) => setPreferences(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full bg-accent hover:bg-accent/90">
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Get Suggestions
      </Button>

      {result && (
        <Alert className="mt-6">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>AI Suggestions</AlertTitle>
          <AlertDescription>
            <p className="font-semibold mt-2">Suggested Times:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {result.suggestedTimes.map((time, index) => (
                <li key={index}>{time}</li>
              ))}
            </ul>
            <p className="font-semibold mt-4">Reasoning:</p>
            <p className="mt-1">{result.reasoning}</p>
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
