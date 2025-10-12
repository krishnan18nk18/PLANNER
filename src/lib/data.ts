import type { Task, CalendarEvent } from './types';
import { subDays, addDays } from 'date-fns';

const today = new Date();

export const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Finalize Q3 report',
    description: 'Compile all data and create final presentation slides.',
    dueDate: today.toISOString(),
    priority: 'High',
    completed: false,
  },
  {
    id: '2',
    title: 'Design new landing page',
    description: 'Create mockups in Figma based on the new brand guidelines.',
    dueDate: addDays(today, 2).toISOString(),
    priority: 'High',
    completed: false,
  },
  {
    id: '3',
    title: 'Team brainstorming session',
    description: 'Discuss ideas for the next marketing campaign.',
    dueDate: addDays(today, 3).toISOString(),
    priority: 'Medium',
    completed: false,
  },
  {
    id: '4',
    title: 'Book flights for conference',
    description: 'Find best deals and book for the entire team.',
    dueDate: addDays(today, 5).toISOString(),
    priority: 'Low',
    completed: true,
  },
  {
    id: '5',
    title: 'Review user feedback',
    description: 'Go through the latest feedback and categorize it.',
    dueDate: subDays(today, 1).toISOString(),
    priority: 'Medium',
    completed: true,
  },
];

export const calendarEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Project Kick-off',
    date: addDays(today, 1).toISOString(),
    type: 'meeting',
  },
  {
    id: '2',
    title: 'Dentist Appointment',
    date: addDays(today, 4).toISOString(),
    type: 'event',
  },
  {
    id: '3',
    title: 'Design Sync',
    date: addDays(today, 7).toISOString(),
    type: 'meeting',
  },
];
