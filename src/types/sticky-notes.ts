export type StickyColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple';

export type NoteType = 'daily' | 'monthly' | 'yearly' | 'calendar' | 'blank' | 'habit';

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

// ── Habit Tracker ─────────────────────────────────────────────────────────────

/** One day's completion record for a single habit. date is ISO "YYYY-MM-DD". */
export interface HabitEntry {
  date: string;
  completed: boolean;
}

/** A single trackable habit with its per-day history. */
export interface Habit {
  id: string;
  name: string;
  entries: HabitEntry[];
}

/** Sticky-note variant that holds a list of habits. */
export interface HabitNote extends StickyNote {
  type: 'habit';
  habits: Habit[];
}
