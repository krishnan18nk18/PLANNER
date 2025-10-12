export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
};

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: 'event' | 'meeting';
};
