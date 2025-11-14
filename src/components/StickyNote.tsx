import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { StickyColor } from '@/types/sticky-notes';
import { Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StickyNoteProps {
  children: ReactNode;
  color: StickyColor;
  rotation: number;
  position: { x: number; y: number };
  onDragEnd: (x: number, y: number) => void;
  onColorChange?: () => void;
  onDelete?: () => void;
  className?: string;
}

const colorMap: Record<StickyColor, string> = {
  yellow: 'bg-sticky-yellow',
  pink: 'bg-sticky-pink',
  blue: 'bg-sticky-blue',
  green: 'bg-sticky-green',
  purple: 'bg-sticky-purple',
};

export const StickyNote = ({
  children,
  color,
  rotation,
  position,
  onDragEnd,
  onColorChange,
  onDelete,
  className,
}: StickyNoteProps) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      style={{
        x: position.x,
        y: position.y,
        rotate: rotation,
        width: 'fit-content',
        minWidth: '280px',
        maxWidth: '400px',
      }}
      onDragEnd={(e, info) => {
        const element = e.target as HTMLElement;
        const rect = element.getBoundingClientRect();
        onDragEnd(rect.left, rect.top);
      }}
      whileHover={{ 
        scale: 1.02,
        rotate: rotation + 1,
        transition: { duration: 0.2 }
      }}
      className={cn(
        'absolute cursor-move sticky-shadow hover:sticky-shadow-hover transition-shadow',
        colorMap[color],
        className
      )}
    >
      <div className="p-6 relative">
        <div className="absolute top-2 right-2 flex gap-1 z-10">
          {onColorChange && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onColorChange();
              }}
              className="p-1.5 rounded-full bg-white/50 hover:bg-white/80 transition-colors"
              onPointerDown={(e) => e.stopPropagation()}
              title="Change color"
            >
              <Palette className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1.5 rounded-full bg-red-500/50 hover:bg-red-500/80 transition-colors"
              onPointerDown={(e) => e.stopPropagation()}
              title="Delete note"
            >
              <span className="w-4 h-4 flex items-center justify-center text-white font-bold">×</span>
            </button>
          )}
        </div>
        {children}
      </div>
    </motion.div>
  );
};
