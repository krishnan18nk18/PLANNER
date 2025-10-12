import type { Metadata } from 'next';
import { SuggestionTool } from '@/components/ai/suggestion-tool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Smart Suggestions',
};

export default function SuggestionsPage() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <CardTitle className="font-headline text-2xl">Smart Suggestion Tool</CardTitle>
        </div>
        <CardDescription>
          Let our AI find the perfect time for your tasks. Just provide the task details, your availability, and any preferences you have.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SuggestionTool />
      </CardContent>
    </Card>
  );
}
