import { useState } from 'react';
import { StickyNote } from './StickyNote';
import { ProgressBar } from './ProgressBar';
import { StickyColor, TodoItem } from '@/types/sticky-notes';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface YearlyToDoProps {
  id: string;
  color: StickyColor;
  rotation: number;
  position: { x: number; y: number };
  category: string;
  todos: TodoItem[];
  onDragEnd: (x: number, y: number) => void;
  onUpdate: (category: string, todos: TodoItem[]) => void;
  onColorChange: () => void;
  onDelete?: () => void;
}

export const YearlyToDo = ({
  id,
  color,
  rotation,
  position,
  category,
  todos,
  onDragEnd,
  onUpdate,
  onColorChange,
  onDelete,
}: YearlyToDoProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newTask, setNewTask] = useState('');
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [categoryText, setCategoryText] = useState(category);

  const handleToggle = (todoId: string) => {
    const updated = todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    onUpdate(category, updated);
  };

  const handleEdit = (todo: TodoItem) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = (todoId: string) => {
    if (editText.trim()) {
      const updated = todos.map(todo =>
        todo.id === todoId ? { ...todo, text: editText.trim() } : todo
      );
      onUpdate(category, updated);
    }
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (todoId: string) => {
    const updated = todos.filter(todo => todo.id !== todoId);
    onUpdate(category, updated);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
      };
      onUpdate(category, [...todos, newTodo]);
      setNewTask('');
    }
  };

  const handleSaveCategory = () => {
    if (categoryText.trim()) {
      onUpdate(categoryText.trim(), todos);
    }
    setIsEditingCategory(false);
  };

  const completedCount = todos.filter(t => t.completed).length;

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
      <div className="font-handwriting">
        <div className="mb-4">
          {isEditingCategory ? (
            <Input
              value={categoryText}
              onChange={(e) => setCategoryText(e.target.value)}
              onBlur={handleSaveCategory}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveCategory();
                if (e.key === 'Escape') setIsEditingCategory(false);
              }}
              className="text-2xl font-bold bg-white/50 font-handwriting"
              autoFocus
              onPointerDown={(e) => e.stopPropagation()}
            />
          ) : (
            <h2
              className="text-2xl font-bold text-foreground cursor-text"
              onClick={() => setIsEditingCategory(true)}
            >
              {category}
            </h2>
          )}
          <p className="text-sm opacity-70 font-sans">Yearly Goals</p>
        </div>
        
        <div className="space-y-2 mb-3 max-h-96 overflow-y-auto">
          {todos.map(todo => (
            <div key={todo.id} className="flex items-center gap-2 group">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => handleToggle(todo.id)}
                className="flex-shrink-0"
              />
              
              {editingId === todo.id ? (
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => handleSaveEdit(todo.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(todo.id);
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  className="flex-1 h-8 bg-white/50 font-sans text-sm"
                  autoFocus
                />
              ) : (
                <span
                  className={`flex-1 text-lg ${
                    todo.completed ? 'line-through opacity-60' : ''
                  }`}
                >
                  {todo.text}
                </span>
              )}
              
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(todo)}
                  className="p-1 hover:bg-white/50 rounded"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="p-1 hover:bg-white/50 rounded text-destructive"
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-3" onPointerDown={(e) => e.stopPropagation()}>
          <Input
            placeholder="Add new goal..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddTask();
            }}
            className="flex-1 h-9 bg-white/50 font-sans text-sm"
          />
          <Button
            onClick={handleAddTask}
            size="sm"
            className="px-3"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <ProgressBar completed={completedCount} total={todos.length} />
      </div>
    </StickyNote>
  );
};
