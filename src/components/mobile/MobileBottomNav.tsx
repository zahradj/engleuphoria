import React from 'react';
import { Home, BookOpen, Calendar, Trophy, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudentLevel } from '@/hooks/useStudentLevel';

export type StudentNavTab =
  | 'dashboard'
  | 'learning-path'
  | 'upcoming-classes'
  | 'certificates'
  | 'profile';

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: StudentNavTab) => void;
  className?: string;
}

const NAV_ITEMS: { id: StudentNavTab; icon: typeof Home; label: string }[] = [
  { id: 'dashboard', icon: Home, label: 'Home' },
  { id: 'learning-path', icon: BookOpen, label: 'Lessons' },
  { id: 'upcoming-classes', icon: Calendar, label: 'Classes' },
  { id: 'certificates', icon: Trophy, label: 'Awards' },
  { id: 'profile', icon: User, label: 'Profile' },
];

const HUB_THEME: Record<string, { active: string; activeBg: string; ring: string }> = {
  playground: {
    active: 'text-orange-600 dark:text-orange-400',
    activeBg: 'bg-orange-500/15',
    ring: 'ring-orange-500/30',
  },
  academy: {
    active: 'text-indigo-600 dark:text-indigo-400',
    activeBg: 'bg-indigo-500/15',
    ring: 'ring-indigo-500/30',
  },
  professional: {
    active: 'text-emerald-600 dark:text-emerald-400',
    activeBg: 'bg-emerald-500/15',
    ring: 'ring-emerald-500/30',
  },
};

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onTabChange,
  className,
}) => {
  const { studentLevel } = useStudentLevel();
  const theme = HUB_THEME[studentLevel || 'playground'];

  return (
    <nav
      className={cn(
        'fixed bottom-0 inset-x-0 z-40 md:hidden',
        'bg-card/90 backdrop-blur-xl border-t border-border/60',
        'shadow-[0_-4px_20px_-6px_rgba(0,0,0,0.15)]',
        className
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary mobile navigation"
    >
      <ul className="grid grid-cols-5 gap-1 px-2 pt-2 pb-2">
        {NAV_ITEMS.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onTabChange(id)}
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 w-full min-h-[52px] rounded-xl',
                  'transition-all duration-200 touch-manipulation select-none',
                  'active:scale-95',
                  isActive
                    ? cn(theme.active, theme.activeBg, 'ring-1', theme.ring)
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-current={isActive ? 'page' : undefined}
                aria-label={label}
              >
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                <span className="text-[10px] font-semibold tracking-tight">{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
