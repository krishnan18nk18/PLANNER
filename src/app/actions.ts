'use server';

import {
  suggestOptimalTaskTimes,
  type SuggestOptimalTaskTimesInput,
} from '@/ai/flows/suggest-optimal-task-times';
import {
  parseTaskFromText,
  type ParseTaskFromTextOutput,
} from '@/ai/flows/parse-task-from-text';
import { z } from 'zod';
import { add } from 'date-fns';

const inputSchema = z.object({
  task: z.string().min(1, 'Task description is required.'),
  availability: z.string().min(1, 'Availability information is required.'),
  preferences: z.string().min(1, 'Preferences are required.'),
});

export async function getSuggestions(
  prevState: any,
  formData: FormData
) {
  const rawFormData = {
    task: formData.get('task'),
    availability: formData.get('availability'),
    preferences: formData.get('preferences'),
  };

  const validatedFields = inputSchema.safeParse(rawFormData);
  
  if (!validatedFields.success) {
    return {
      message: 'Validation Error',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await suggestOptimalTaskTimes(validatedFields.data as SuggestOptimalTaskTimesInput);
    return { message: 'Success', data: result };
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return { message: 'An error occurred while getting suggestions. Please try again.' };
  }
}

export async function createTaskFromVoice(
  command: string
): Promise<{ error?: string; task?: ParseTaskFromTextOutput & { id: string; completed: boolean; dueDate: string } }> {
  if (!command) {
    return { error: 'No command provided.' };
  }

  try {
    const parsedTask = await parseTaskFromText(command);
    // The AI returns date as yyyy-MM-dd. We need to add time to it to make it a valid ISO string.
    // Let's set it to noon on that day in the local timezone.
    const dueDate = new Date(parsedTask.dueDate);
    dueDate.setHours(12, 0, 0, 0);

    const task = {
        ...parsedTask,
        id: Date.now().toString(),
        completed: false,
        dueDate: dueDate.toISOString(),
    }
    return { task };
  } catch (error) {
    console.error('Error creating task from voice:', error);
    return { error: 'Failed to understand the task. Please try again.' };
  }
}
