import React from 'react';
import { cn } from '@/lib/utils';
import { Award } from 'lucide-react';

interface MasteryBadgeProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MasteryBadge: React.FC<MasteryBadgeProps> = ({ className, size = 'md' }) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const iconSize = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full',
        sizeMap[size],
        // Light mode: metallic gold
        'bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500',
        'shadow-[0_0_12px_rgba(245,158,11,0.3)]',
        // Dark mode: neon glow
        'dark:bg-gradient-to-br dark:from-primary dark:via-primary/80 dark:to-accent',
        'dark:shadow-[0_0_20px_hsl(var(--primary)/0.5),0_0_40px_hsl(var(--primary)/0.2)]',
        'animate-pulse-slow',
        className
      )}
    >
      {/* Inner ring */}
      <div className={cn(
        'absolute inset-[2px] rounded-full',
        'bg-gradient-to-br from-yellow-100 to-amber-200',
        'dark:from-background dark:to-card',
        'flex items-center justify-center'
      )}>
        <Award className={cn(
          iconSize[size],
          'text-amber-600 dark:text-primary',
          'drop-shadow-sm'
        )} />
      </div>
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div className="absolute -inset-full animate-[shine_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
      </div>
    </div>
  );
};
