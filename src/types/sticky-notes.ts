export type StickyColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple';

export type NoteType = 'daily' | 'monthly' | 'yearly' | 'calendar' | 'blank';

export interface Position {
  x: number;
  y: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
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
