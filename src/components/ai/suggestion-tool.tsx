'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { getSuggestions } from '@/app/actions';
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

const initialState = {
  message: '',
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full bg-accent hover:bg-accent/90">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Get Suggestions
    </Button>
  );
}

export function SuggestionTool() {
  const [state, formAction] = useActionState(getSuggestions, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message && state.message !== 'Success' && !state.errors) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="task">Task</Label>
        <Input
          id="task"
          name="task"
          placeholder="e.g., 'Schedule a 1-hour workout session'"
        />
        {state?.errors?.task && <p className="text-sm text-destructive">{state.errors.task[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="availability">Your Availability</Label>
        <Textarea
          id="availability"
          name="availability"
          placeholder="e.g., 'Free tomorrow from 2 PM to 5 PM. Busy on Wednesday morning.'"
        />
        {state?.errors?.availability && <p className="text-sm text-destructive">{state.errors.availability[0]}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="preferences">Preferences</Label>
        <Textarea
          id="preferences"
          name="preferences"
          placeholder="e.g., 'I prefer to work out in the afternoon. Avoid scheduling during lunch hours (12 PM - 1 PM).'"
        />
        {state?.errors?.preferences && <p className="text-sm text-destructive">{state.errors.preferences[0]}</p>}
      </div>

      <SubmitButton />

      {state?.data && (
        <Alert className="mt-6">
          <Lightbulb className="h-4 w-4" />
          <AlertTitle>AI Suggestions</AlertTitle>
          <AlertDescription>
            <p className="font-semibold mt-2">Suggested Times:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              {state.data.suggestedTimes.map((time, index) => (
                <li key={index}>{time}</li>
              ))}
            </ul>
            <p className="font-semibold mt-4">Reasoning:</p>
            <p className="mt-1">{state.data.reasoning}</p>
          </AlertDescription>
        </Alert>
      )}
    </form>
  );
}
