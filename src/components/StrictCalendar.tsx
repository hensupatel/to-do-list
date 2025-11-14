import { useState } from 'react';
import { StickyNote } from './StickyNote';
import { StickyColor, StrictCalendarTask } from '@/types/sticky-notes';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

interface StrictCalendarProps {
  id: string;
  color: StickyColor;
  rotation: number;
  position: { x: number; y: number };
  tasks: StrictCalendarTask[];
  currentMonth: number;
  currentYear: number;
  onDragEnd: (x: number, y: number) => void;
  onUpdate: (tasks: StrictCalendarTask[], month: number, year: number) => void;
  onColorChange: () => void;
  onDelete?: () => void;
}

export const StrictCalendar = ({
  id,
  color,
  rotation,
  position,
  tasks,
  currentMonth,
  currentYear,
  onDragEnd,
  onUpdate,
  onColorChange,
  onDelete,
}: StrictCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [taskText, setTaskText] = useState('');
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (m: number, y: number) => {
    return new Date(y, m, 1).getDay();
  };

  const getDayStatus = (day: number): 'completed' | 'pending' | 'incomplete' => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.date === dateStr);
    
    if (dayTasks.length === 0) return 'pending';
    
    const allCompleted = dayTasks.every(t => t.completed);
    const today = new Date();
    const taskDate = new Date(year, month, day);
    
    if (allCompleted) return 'completed';
    if (taskDate < today) return 'incomplete';
    return 'pending';
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setTaskText('');
  };

  const handleAddTask = () => {
    if (taskText.trim() && selectedDate) {
      const newTask: StrictCalendarTask = {
        id: Date.now().toString(),
        date: selectedDate,
        task: taskText.trim(),
        completed: false,
      };
      onUpdate([...tasks, newTask], month, year);
      setTaskText('');
    }
  };

  const handleToggleTask = (taskId: string) => {
    const updated = tasks.map(t =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdate(updated, month, year);
  };

  const handleDeleteTask = (taskId: string) => {
    const updated = tasks.filter(t => t.id !== taskId);
    onUpdate(updated, month, year);
  };

  const selectedDateTasks = selectedDate
    ? tasks.filter(t => t.date === selectedDate)
    : [];

  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const changeMonth = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    setMonth(newMonth);
    setYear(newYear);
    onUpdate(tasks, newMonth, newYear);
  };

  return (
    <>
      <StickyNote
        color={color}
        rotation={rotation}
        position={position}
        onDragEnd={onDragEnd}
        onColorChange={onColorChange}
        onDelete={onDelete}
        className="w-[380px]"
      >
        <div className="font-handwriting">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-1 hover:bg-white/50 rounded"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-2xl font-bold text-foreground">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={() => changeMonth(1)}
              className="p-1 hover:bg-white/50 rounded"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="text-xs font-sans mb-2 opacity-70">Strict Calendar</div>

          <div className="grid grid-cols-7 gap-1 mb-2 font-sans text-xs font-semibold">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center p-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {blanks.map(i => (
              <div key={`blank-${i}`} />
            ))}
            {days.map(day => {
              const status = getDayStatus(day);
              const bgColor =
                status === 'completed'
                  ? 'bg-green-500/80'
                  : status === 'incomplete'
                  ? 'bg-red-500/80'
                  : 'bg-yellow-500/60';

              return (
                <button
                  key={day}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square p-1 rounded text-sm font-medium transition-all hover:scale-110 ${bgColor} hover:shadow-md font-sans`}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-3 text-xs font-sans space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500/80" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500/80" />
              <span>Incomplete</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500/60" />
              <span>Pending</span>
            </div>
          </div>
        </div>
      </StickyNote>

      <Dialog open={selectedDate !== null} onOpenChange={() => setSelectedDate(null)}>
        <DialogContent className="font-sans">
          <DialogHeader>
            <DialogTitle className="font-handwriting text-2xl">
              Tasks for {selectedDate}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              {selectedDateTasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 group">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => handleToggleTask(task.id)}
                  />
                  <span className={`flex-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
                    {task.task}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add strict task..."
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddTask();
                }}
              />
              <Button onClick={handleAddTask}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
