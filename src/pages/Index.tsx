import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { StickyNote as StickyNoteType, StickyColor, NoteType, TodoItem, CalendarNote, StrictCalendarTask } from '@/types/sticky-notes';
import { DailyToDo } from '@/components/DailyToDo';
import { MonthlyToDo } from '@/components/MonthlyToDo';
import { YearlyToDo } from '@/components/YearlyToDo';
import { StrictCalendar } from '@/components/StrictCalendar';
import { AddNoteModal } from '@/components/AddNoteModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Index = () => {
  const [notes, setNotes] = useLocalStorage<StickyNoteType[]>('sticky-notes', []);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [colorChangeNoteId, setColorChangeNoteId] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        !!target?.isContentEditable;

      if (isTypingTarget) return;

      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        setIsAddModalOpen(true);
      }

      if (event.key === 'Escape') {
        setIsAddModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getRandomRotation = () => Math.random() * 6 - 3;

  const getRandomPosition = () => ({
    x: Math.random() * (window.innerWidth - 400) + 50,
    y: Math.random() * (window.innerHeight - 400) + 50,
  });

  const colors: StickyColor[] = ['yellow', 'pink', 'blue', 'green', 'purple'];

  const cycleColor = (currentColor: StickyColor): StickyColor => {
    const currentIndex = colors.indexOf(currentColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    return colors[nextIndex];
  };

  const handleAddNote = (type: NoteType, color: StickyColor) => {
    const newNote: StickyNoteType = {
      id: Date.now().toString(),
      type,
      color,
      position: getRandomPosition(),
      rotation: getRandomRotation(),
      title: type === 'monthly' ? 'This Month' : undefined,
      category: type === 'yearly' ? 'Life Goals' : undefined,
      todos: type !== 'calendar' && type !== 'blank' ? [] : undefined,
    };

    if (type === 'calendar') {
      const now = new Date();
      (newNote as CalendarNote).tasks = [];
      (newNote as CalendarNote).currentMonth = now.getMonth();
      (newNote as CalendarNote).currentYear = now.getFullYear();
    }

    setNotes([...notes, newNote]);
  };

  const handleUpdatePosition = (id: string, x: number, y: number) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, position: { x, y } } : note
    ));
  };

  const handleColorChange = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, color: cycleColor(note.color) } : note
    ));
  };

  const handleUpdateTodos = (id: string, todos: TodoItem[], title?: string, category?: string) => {
    setNotes(notes.map(note =>
      note.id === id ? { ...note, todos, title: title || note.title, category: category || note.category } : note
    ));
  };

  const handleUpdateCalendar = (id: string, tasks: StrictCalendarTask[], month: number, year: number) => {
    setNotes(notes.map(note =>
      note.id === id ? { 
        ...note, 
        tasks, 
        currentMonth: month, 
        currentYear: year 
      } as CalendarNote : note
    ));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="min-h-screen w-full overflow-hidden relative bg-gradient-to-br from-background via-background to-muted">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border px-6 py-4">
        <h1 className="font-handwriting text-4xl font-bold text-foreground">
          MyWebApp To-Do Dashboard
        </h1>
        <p className="text-sm text-muted-foreground font-sans">
          Drag your sticky notes anywhere on the wall
        </p>
      </div>

      {/* Dashboard Wall */}
      <div className="pt-24 pb-20 px-4 w-full h-screen relative">
        {notes.length === 0 && (
          <div className="absolute inset-0 pt-24 pb-20 px-4 flex items-center justify-center pointer-events-none">
            <div className="max-w-md text-center p-6 rounded-xl bg-background/60 backdrop-blur-sm border border-border shadow-lg">
              <h2 className="font-handwriting text-3xl text-foreground mb-2">Start your board</h2>
              <p className="font-sans text-sm text-muted-foreground">
                Click the + button to create your first sticky note, or press N.
              </p>
            </div>
          </div>
        )}

        {notes.map(note => {
          if (note.type === 'daily') {
            return (
              <DailyToDo
                key={note.id}
                id={note.id}
                color={note.color}
                rotation={note.rotation}
                position={note.position}
                todos={note.todos || []}
                onDragEnd={(x, y) => handleUpdatePosition(note.id, x, y)}
                onUpdate={(todos) => handleUpdateTodos(note.id, todos)}
                onColorChange={() => handleColorChange(note.id)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            );
          }

          if (note.type === 'monthly') {
            return (
              <MonthlyToDo
                key={note.id}
                id={note.id}
                color={note.color}
                rotation={note.rotation}
                position={note.position}
                title={note.title || 'This Month'}
                todos={note.todos || []}
                onDragEnd={(x, y) => handleUpdatePosition(note.id, x, y)}
                onUpdate={(title, todos) => handleUpdateTodos(note.id, todos, title)}
                onColorChange={() => handleColorChange(note.id)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            );
          }

          if (note.type === 'yearly') {
            return (
              <YearlyToDo
                key={note.id}
                id={note.id}
                color={note.color}
                rotation={note.rotation}
                position={note.position}
                category={note.category || 'Life Goals'}
                todos={note.todos || []}
                onDragEnd={(x, y) => handleUpdatePosition(note.id, x, y)}
                onUpdate={(category, todos) => handleUpdateTodos(note.id, todos, undefined, category)}
                onColorChange={() => handleColorChange(note.id)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            );
          }

          if (note.type === 'calendar') {
            const calNote = note as CalendarNote;
            return (
              <StrictCalendar
                key={note.id}
                id={note.id}
                color={note.color}
                rotation={note.rotation}
                position={note.position}
                tasks={calNote.tasks || []}
                currentMonth={calNote.currentMonth}
                currentYear={calNote.currentYear}
                onDragEnd={(x, y) => handleUpdatePosition(note.id, x, y)}
                onUpdate={(tasks, month, year) => handleUpdateCalendar(note.id, tasks, month, year)}
                onColorChange={() => handleColorChange(note.id)}
                onDelete={() => handleDeleteNote(note.id)}
              />
            );
          }

          return null;
        })}
      </div>

      {/* Floating Add Button */}
      <Button
        onClick={() => setIsAddModalOpen(true)}
        size="lg"
        className="fixed bottom-8 right-8 rounded-full w-16 h-16 shadow-2xl hover:shadow-xl transition-all hover:scale-110 z-20"
      >
        <Plus className="w-8 h-8" />
      </Button>

      {/* Add Note Modal */}
      <AddNoteModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddNote}
      />
    </div>
  );
};

export default Index;
