import { motion } from 'framer-motion';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export const ProgressBar = ({ completed, total }: ProgressBarProps) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground/70">
          {completed} / {total} tasks
        </span>
        <span className="text-sm font-semibold text-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="h-2.5 bg-white/40 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
        />
      </div>
    </div>
  );
};
