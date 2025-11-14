import { useState } from 'react';
import { StickyNote } from './StickyNote';
import { ProgressBar } from './ProgressBar';
import { StickyColor, TodoItem } from '@/types/sticky-notes';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from './ui/button';

interface MonthlyToDoProps {
  id: string;
  color: StickyColor;
  rotation: number;
  position: { x: number; y: number };
  title: string;
  todos: TodoItem[];
  onDragEnd: (x: number, y: number) => void;
  onUpdate: (title: string, todos: TodoItem[]) => void;
  onColorChange: () => void;
  onDelete?: () => void;
}

export const MonthlyToDo = ({
  id,
  color,
  rotation,
  position,
  title,
  todos,
  onDragEnd,
  onUpdate,
  onColorChange,
  onDelete,
}: MonthlyToDoProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newTask, setNewTask] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleText, setTitleText] = useState(title);

  const handleToggle = (todoId: string) => {
    const updated = todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
    onUpdate(title, updated);
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
      onUpdate(title, updated);
    }
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (todoId: string) => {
    const updated = todos.filter(todo => todo.id !== todoId);
    onUpdate(title, updated);
  };

  const handleAddTask = () => {
    if (newTask.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTask.trim(),
        completed: false,
      };
      onUpdate(title, [...todos, newTodo]);
      setNewTask('');
    }
  };

  const handleSaveTitle = () => {
    if (titleText.trim()) {
      onUpdate(titleText.trim(), todos);
    }
    setIsEditingTitle(false);
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
      className="w-96"
    >
      <div className="font-handwriting">
        {isEditingTitle ? (
          <Input
            value={titleText}
            onChange={(e) => setTitleText(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
              if (e.key === 'Escape') setIsEditingTitle(false);
            }}
            className="text-2xl font-bold mb-4 bg-white/50 font-handwriting"
            autoFocus
            onPointerDown={(e) => e.stopPropagation()}
          />
        ) : (
          <h2
            className="text-2xl font-bold mb-4 text-foreground cursor-text"
            onClick={() => setIsEditingTitle(true)}
          >
            {title}
          </h2>
        )}
        
        <div className="space-y-2 mb-3 max-h-80 overflow-y-auto">
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
            placeholder="Add new task..."
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
