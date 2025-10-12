'use server';

import {
  suggestOptimalTaskTimes,
  type SuggestOptimalTaskTimesInput,
} from '@/ai/flows/suggest-optimal-task-times';
import { z } from 'zod';

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
