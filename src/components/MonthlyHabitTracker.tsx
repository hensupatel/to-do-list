import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { StickyNote } from './StickyNote';
import { ProgressBar } from './ProgressBar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { HabitItem, StickyColor } from '@/types/sticky-notes';

interface MonthlyHabitTrackerProps {
  id: string;
  color: StickyColor;
  rotation: number;
  position: { x: number; y: number };
  title: string;
  habits: HabitItem[];
  currentMonth: number;
  currentYear: number;
  onDragEnd: (x: number, y: number) => void;
  onUpdate: (title: string, habits: HabitItem[], month: number, year: number) => void;
  onColorChange: () => void;
  onDelete?: () => void;
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const buildDateKey = (year: number, month: number, day: number) => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const getDaysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export const MonthlyHabitTracker = ({
  id,
  color,
  rotation,
  position,
  title,
  habits,
  currentMonth,
  currentYear,
  onDragEnd,
  onUpdate,
  onColorChange,
  onDelete,
}: MonthlyHabitTrackerProps) => {
  const [newHabit, setNewHabit] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(title);

  const daysInMonth = useMemo(() => getDaysInMonth(currentMonth, currentYear), [currentMonth, currentYear]);
  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, i) => i + 1), [daysInMonth]);

  const handleAddHabit = () => {
    if (!newHabit.trim()) return;

    const createdHabit: HabitItem = {
      id: Date.now().toString(),
      name: newHabit.trim(),
      completedDates: [],
    };

    onUpdate(title, [...habits, createdHabit], currentMonth, currentYear);
    setNewHabit('');
  };

  const handleDeleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter((habit) => habit.id !== habitId);
    onUpdate(title, updatedHabits, currentMonth, currentYear);
  };

  const toggleHabitDay = (habitId: string, day: number) => {
    const key = buildDateKey(currentYear, currentMonth, day);

    const updatedHabits = habits.map((habit) => {
      if (habit.id !== habitId) return habit;

      const exists = habit.completedDates.includes(key);
      const completedDates = exists
        ? habit.completedDates.filter((date) => date !== key)
        : [...habit.completedDates, key];

      return { ...habit, completedDates };
    });

    onUpdate(title, updatedHabits, currentMonth, currentYear);
  };

  const handleSaveTitle = () => {
    const trimmed = titleText.trim();
    if (trimmed) {
      onUpdate(trimmed, habits, currentMonth, currentYear);
      setTitleText(trimmed);
    } else {
      setTitleText(title);
    }
    setEditingTitle(false);
  };

  const changeMonth = (delta: number) => {
    let month = currentMonth + delta;
    let year = currentYear;

    if (month > 11) {
      month = 0;
      year += 1;
    } else if (month < 0) {
      month = 11;
      year -= 1;
    }

    onUpdate(title, habits, month, year);
  };

  const completedCount = habits.reduce((total, habit) => {
    return total + habit.completedDates.filter((date) => date.startsWith(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`)).length;
  }, 0);
  const totalCount = habits.length * daysInMonth;

  return (
    <StickyNote
      color={color}
      rotation={rotation}
      position={position}
      onDragEnd={onDragEnd}
      onColorChange={onColorChange}
      onDelete={onDelete}
      className="w-[520px]"
    >
      <div className="font-handwriting">
        {editingTitle ? (
          <Input
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
              if (e.key === 'Escape') setEditingTitle(false);
            }}
            className="text-2xl font-bold mb-3 bg-white/50 font-handwriting"
            autoFocus
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <h2 className="text-2xl font-bold mb-3 cursor-text" onClick={() => setEditingTitle(true)}>
            {title}
          </h2>
        )}

        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => changeMonth(-1)}
            className="p-1.5 hover:bg-white/60 rounded"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <p className="font-sans text-sm font-semibold">{monthNames[currentMonth]} {currentYear}</p>
          <button
            onClick={() => changeMonth(1)}
            className="p-1.5 hover:bg-white/60 rounded"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-2 mb-3" onPointerDown={(e) => e.stopPropagation()}>
          <Input
            value={newHabit}
            placeholder="Add a habit..."
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddHabit();
            }}
            className="h-9 bg-white/50 font-sans text-sm"
          />
          <Button onClick={handleAddHabit} size="sm" className="px-3">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {habits.map((habit) => (
            <div key={habit.id} className="bg-white/40 rounded-md p-2" onPointerDown={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="font-sans text-sm font-medium truncate">{habit.name}</p>
                <button
                  onClick={() => handleDeleteHabit(habit.id)}
                  className="p-1 hover:bg-white/60 rounded text-destructive"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-7 md:grid-cols-8 lg:grid-cols-10 gap-1">
                {days.map((day) => {
                  const key = buildDateKey(currentYear, currentMonth, day);
                  const checked = habit.completedDates.includes(key);

                  return (
                    <button
                      key={key}
                      onClick={() => toggleHabitDay(habit.id, day)}
                      className={`h-7 rounded text-[11px] font-sans transition-colors ${
                        checked ? 'bg-emerald-600 text-white' : 'bg-white/70 hover:bg-white'
                      }`}
                      onPointerDown={(e) => e.stopPropagation()}
                      title={`Day ${day}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <ProgressBar completed={completedCount} total={totalCount} />
      </div>
    </StickyNote>
  );
};
