import { useState } from 'react';
import { StickyNote } from './StickyNote';
import { ProgressBar } from './ProgressBar';
import { StickyColor, Habit, HabitEntry } from '@/types/sticky-notes';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Plus, Trash2, Flame } from 'lucide-react';
import {
  startOfWeek,
  addDays,
  format,
  isToday,
  differenceInCalendarDays,
  parseISO,
} from 'date-fns';

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Returns the Mon–Sun dates of the current calendar week. */
function getCurrentWeekDays(): Date[] {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

/** ISO date string for a Date object. */
const toISO = (d: Date) => format(d, 'yyyy-MM-dd');

/** Checks whether the habit was completed on a given ISO date. */
function isCompleted(habit: Habit, isoDate: string): boolean {
  return habit.entries.some((e) => e.date === isoDate && e.completed);
}

/**
 * Current streak = consecutive days (going backwards from today)
 * where the habit was marked complete.
 */
function calcStreak(habit: Habit): number {
  let streak = 0;
  let cursor = new Date();
  while (true) {
    const iso = toISO(cursor);
    if (isCompleted(habit, iso)) {
      streak++;
      cursor = addDays(cursor, -1);
    } else {
      break;
    }
  }
  return streak;
}

// ── Component ─────────────────────────────────────────────────────────────────

interface HabitTrackerProps {
  id: string;
  color: StickyColor;
  rotation: number;
  position: { x: number; y: number };
  habits: Habit[];
  onDragEnd: (x: number, y: number) => void;
  onUpdate: (habits: Habit[]) => void;
  onColorChange: () => void;
  onDelete?: () => void;
}

export const HabitTracker = ({
  color,
  rotation,
  position,
  habits,
  onDragEnd,
  onUpdate,
  onColorChange,
  onDelete,
}: HabitTrackerProps) => {
  const [newHabit, setNewHabit] = useState('');
  const weekDays = getCurrentWeekDays();

  // ── Toggle a day cell ──────────────────────────────────────────────────────
  const handleToggle = (habitId: string, isoDate: string) => {
    const updated = habits.map((h) => {
      if (h.id !== habitId) return h;
      const exists = h.entries.find((e) => e.date === isoDate);
      let entries: HabitEntry[];
      if (exists) {
        entries = h.entries.map((e) =>
          e.date === isoDate ? { ...e, completed: !e.completed } : e
        );
      } else {
        entries = [...h.entries, { date: isoDate, completed: true }];
      }
      return { ...h, entries };
    });
    onUpdate(updated);
  };

  // ── Add a new habit ────────────────────────────────────────────────────────
  const handleAddHabit = () => {
    if (!newHabit.trim()) return;
    const habit: Habit = {
      id: Date.now().toString(),
      name: newHabit.trim(),
      entries: [],
    };
    onUpdate([...habits, habit]);
    setNewHabit('');
  };

  // ── Delete a habit ─────────────────────────────────────────────────────────
  const handleDeleteHabit = (habitId: string) => {
    onUpdate(habits.filter((h) => h.id !== habitId));
  };

  // ── Progress stats ─────────────────────────────────────────────────────────
  const totalCells = habits.length * 7;
  const completedCells = habits.reduce((acc, h) => {
    return (
      acc +
      weekDays.filter((day) => isCompleted(h, toISO(day))).length
    );
  }, 0);

  const weekLabel = `${format(weekDays[0], 'MMM d')} – ${format(weekDays[6], 'MMM d')}`;

  return (
    <StickyNote
      color={color}
      rotation={rotation}
      position={position}
      onDragEnd={onDragEnd}
      onColorChange={onColorChange}
      onDelete={onDelete}
      className="w-[420px]"
    >
      <div className="font-handwriting select-none">
        {/* Header */}
        <div className="mb-3">
          <h2 className="text-2xl font-bold text-foreground leading-none">
            🔥 Habit Tracker
          </h2>
          <p className="text-xs text-foreground/60 font-sans mt-0.5">{weekLabel}</p>
        </div>

        {/* Day-of-week column headers */}
        <div className="flex items-center gap-1 mb-2 pl-[120px]">
          {weekDays.map((day) => (
            <div
              key={toISO(day)}
              className={`w-8 flex-shrink-0 text-center text-[10px] font-bold font-sans uppercase tracking-wide ${
                isToday(day)
                  ? 'text-amber-600'
                  : 'text-foreground/50'
              }`}
            >
              {format(day, 'EEE')[0]}
              <br />
              <span className="text-[9px] font-normal">{format(day, 'd')}</span>
            </div>
          ))}
          <div className="w-8 flex-shrink-0" /> {/* spacer for streak col */}
        </div>

        {/* Habit rows */}
        <div className="space-y-1.5 mb-3">
          {habits.length === 0 && (
            <p className="text-sm text-foreground/40 italic text-center py-3 font-sans">
              No habits yet — add one below!
            </p>
          )}

          {habits.map((habit) => {
            const streak = calcStreak(habit);
            return (
              <div
                key={habit.id}
                className="flex items-center gap-1 group"
              >
                {/* Habit name */}
                <div
                  className="w-[112px] flex-shrink-0 text-sm font-medium truncate pr-1"
                  title={habit.name}
                >
                  {habit.name}
                </div>

                {/* Day cells */}
                {weekDays.map((day) => {
                  const iso = toISO(day);
                  const done = isCompleted(habit, iso);
                  const todayClass = isToday(day)
                    ? 'ring-2 ring-amber-400/70'
                    : '';
                  return (
                    <button
                      key={iso}
                      onClick={() => handleToggle(habit.id, iso)}
                      onPointerDown={(e) => e.stopPropagation()}
                      className={`w-8 h-8 flex-shrink-0 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                        done
                          ? 'bg-emerald-500 border-emerald-600 text-white'
                          : 'bg-white/40 border-foreground/20 hover:border-emerald-400'
                      } ${todayClass}`}
                      title={`${habit.name} — ${format(day, 'EEE MMM d')}`}
                    >
                      {done && (
                        <span className="flex items-center justify-center w-full h-full text-xs font-bold">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}

                {/* Streak badge */}
                <div
                  className={`w-8 flex-shrink-0 flex items-center justify-center gap-0.5 text-xs font-bold ${
                    streak > 0 ? 'text-orange-500' : 'text-foreground/30'
                  }`}
                >
                  {streak > 0 ? (
                    <>
                      <Flame className="w-3 h-3" />
                      {streak}
                    </>
                  ) : (
                    <span className="text-[10px]">–</span>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  onPointerDown={(e) => e.stopPropagation()}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-red-500 flex-shrink-0"
                  title="Remove habit"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Add new habit */}
        <div
          className="flex gap-2 mb-3"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Input
            placeholder="New habit..."
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddHabit();
            }}
            className="flex-1 h-9 bg-white/50 font-sans text-sm"
          />
          <Button onClick={handleAddHabit} size="sm" className="px-3">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Overall progress bar */}
        <ProgressBar completed={completedCells} total={totalCells} />
      </div>
    </StickyNote>
  );
};
