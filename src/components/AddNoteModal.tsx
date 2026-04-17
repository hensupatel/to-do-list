import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { StickyColor, NoteType } from '@/types/sticky-notes';
import { Calendar, ListTodo, Target, StickyNote as StickyNoteIcon, Activity } from 'lucide-react';

interface AddNoteModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (type: NoteType, color: StickyColor) => void;
}

const noteTypes: { type: NoteType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: 'daily', label: 'Daily Tasks', icon: <ListTodo />, description: 'Track your daily to-dos' },
  { type: 'monthly', label: 'Monthly Goals', icon: <Calendar />, description: 'Plan monthly objectives' },
  { type: 'yearly', label: 'Yearly Goals', icon: <Target />, description: 'Set long-term goals' },
  { type: 'calendar', label: 'Strict Calendar', icon: <Calendar />, description: 'Must-do tasks with dates' },
  { type: 'habit', label: 'Habit Tracker', icon: <Activity />, description: 'Track daily habits & streaks' },
  { type: 'blank', label: 'Blank Note', icon: <StickyNoteIcon />, description: 'Free-form sticky note' },
];


const colors: { color: StickyColor; label: string }[] = [
  { color: 'yellow', label: 'Yellow' },
  { color: 'pink', label: 'Pink' },
  { color: 'blue', label: 'Blue' },
  { color: 'green', label: 'Green' },
  { color: 'purple', label: 'Purple' },
];

export const AddNoteModal = ({ open, onClose, onAdd }: AddNoteModalProps) => {
  const [selectedType, setSelectedType] = useState<NoteType>('daily');
  const [selectedColor, setSelectedColor] = useState<StickyColor>('yellow');

  const handleAdd = () => {
    onAdd(selectedType, selectedColor);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-handwriting text-3xl">Add New Sticky Note</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 font-handwriting text-xl">Choose Note Type</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {noteTypes.map(({ type, label, icon, description }) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`p-4 rounded-lg border-2 transition-all text-left hover:scale-105 ${
                    selectedType === type
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5">{icon}</div>
                    <span className="font-medium">{label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3 font-handwriting text-xl">Choose Color</h3>
            <div className="flex gap-3">
              {colors.map(({ color, label }) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`flex-1 p-3 rounded-lg transition-all hover:scale-105 ${
                    selectedColor === color ? 'ring-4 ring-foreground/30' : ''
                  }`}
                  style={{ backgroundColor: `hsl(var(--sticky-${color}))` }}
                >
                  <span className="font-medium text-sm">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleAdd} className="font-handwriting text-lg px-6">
              Add Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
