export type StickyColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple';

export type NoteType = 'daily' | 'monthly' | 'yearly' | 'calendar' | 'habit-monthly' | 'blank';

export interface Position {
  x: number;
  y: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface HabitItem {
  id: string;
  name: string;
  completedDates: string[];
}

export interface StickyNote {
  id: string;
  type: NoteType;
  color: StickyColor;
  position: Position;
  rotation: number;
  title?: string;
  todos?: TodoItem[];
  category?: string;
}

export interface StrictCalendarTask {
  id: string;
  date: string;
  task: string;
  completed: boolean;
}

export interface CalendarNote extends StickyNote {
  type: 'calendar';
  tasks: StrictCalendarTask[];
  currentMonth: number;
  currentYear: number;
}

export interface MonthlyHabitNote extends StickyNote {
  type: 'habit-monthly';
  habits: HabitItem[];
  currentMonth: number;
  currentYear: number;
  title: string;
}
