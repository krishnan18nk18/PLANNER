/**
 * @fileOverview An AI agent for parsing a task from a raw text string.
 *
 * - parseTaskFromText - A function that extracts task details from text.
 * - ParseTaskFromTextInput - The input type for the parseTaskFromText function.
 * - ParseTaskFromTextOutput - The return type for the parseTaskFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { format } from 'date-fns';

const ParseTaskFromTextInputSchema = z.string();
export type ParseTaskFromTextInput = z.infer<typeof ParseTaskFromTextInputSchema>;

const ParseTaskFromTextOutputSchema = z.object({
  title: z.string().describe('The title of the task.'),
  description: z.string().optional().describe('A detailed description of the task, if provided.'),
  dueDate: z.string().describe("The due date of the task in 'yyyy-MM-dd' format. For example, if the current date is 2024-07-26 and the user says 'tomorrow', the due date should be '2024-07-27'."),
  priority: z.enum(['Low', 'Medium', 'High']).describe("The priority of the task. Default to 'Medium' if not specified."),
});
export type ParseTaskFromTextOutput = z.infer<typeof ParseTaskFromTextOutputSchema>;

export async function parseTaskFromText(
  command: ParseTaskFromTextInput
): Promise<ParseTaskFromTextOutput> {
  return parseTaskFromTextFlow(command);
}

const prompt = ai.definePrompt({
  name: 'parseTaskFromTextPrompt',
  input: {schema: ParseTaskFromTextInputSchema},
  output: {schema: ParseTaskFromTextOutputSchema},
  prompt: `You are an expert at parsing tasks from raw text. Extract the task details from the following command.
  
  The current date is: ${format(new Date(), 'yyyy-MM-dd')}.
  
  Command: "{{{command}}}"
  
  Infer the due date and priority. If priority is not mentioned, default to 'Medium'. Extract the title and a description if provided. Due dates should be returned in 'yyyy-MM-dd' format.`,
});

const parseTaskFromTextFlow = ai.defineFlow(
  {
    name: 'parseTaskFromTextFlow',
    inputSchema: ParseTaskFromTextInputSchema,
    outputSchema: ParseTaskFromTextOutputSchema,
  },
  async command => {
    const {output} = await prompt(command);
    return output!;
  }
);
