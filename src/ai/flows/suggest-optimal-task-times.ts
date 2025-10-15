'use client';
/**
 * @fileOverview An AI agent for suggesting optimal times for tasks based on user preferences and availability.
 *
 * - suggestOptimalTaskTimes - A function that suggests optimal times for tasks.
 * - SuggestOptimalTaskTimesInput - The input type for the suggestOptimalTaskTimes function.
 * - SuggestOptimalTaskTimesOutput - The return type for the suggestOptimalTaskTimes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestOptimalTaskTimesInputSchema = z.object({
  task: z.string().describe('The task for which to suggest optimal times.'),
  availability: z.string().describe('The user\u2019s availability, including existing calendar events.'),
  preferences: z.string().describe('The user\u2019s preferences, such as preferred time of day for certain tasks.'),
});
export type SuggestOptimalTaskTimesInput = z.infer<typeof SuggestOptimalTaskTimesInputSchema>;

const SuggestOptimalTaskTimesOutputSchema = z.object({
  suggestedTimes: z.array(z.string()).describe('An array of suggested times for the task.'),
  reasoning: z.string().describe('The reasoning behind the suggested times.'),
});
export type SuggestOptimalTaskTimesOutput = z.infer<typeof SuggestOptimalTaskTimesOutputSchema>;

export async function suggestOptimalTaskTimes(
  input: SuggestOptimalTaskTimesInput
): Promise<SuggestOptimalTaskTimesOutput> {
  return suggestOptimalTaskTimesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestOptimalTaskTimesPrompt',
  input: {schema: SuggestOptimalTaskTimesInputSchema},
  output: {schema: SuggestOptimalTaskTimesOutputSchema},
  prompt: `You are an AI assistant that suggests optimal times for tasks based on user preferences and availability.

  Task: {{{task}}}
  Availability: {{{availability}}}
  Preferences: {{{preferences}}}

  Consider the task, the user's availability, and the user's preferences to suggest the best times for the task. Provide the reasoning for your suggestions.

  Format the output as a JSON object with "suggestedTimes" and "reasoning" fields.`,
});

const suggestOptimalTaskTimesFlow = ai.defineFlow(
  {
    name: 'suggestOptimalTaskTimesFlow',
    inputSchema: SuggestOptimalTaskTimesInputSchema,
    outputSchema: SuggestOptimalTaskTimesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
