import React from 'react';
import { Map, Palette, Library, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useCreator, CreatorStep } from './CreatorContext';

const NAV: Array<{ key: CreatorStep; label: string; icon: React.ElementType; emoji: string }> = [
  { key: 'blueprint', label: 'Blueprint', icon: Map, emoji: '🗺️' },
  { key: 'slide-builder', label: 'Slides', icon: Palette, emoji: '🎨' },
  { key: 'library', label: 'Library', icon: Library, emoji: '📚' },
];

export const StudioMobileNav: React.FC = () => {
  const { currentStep, setCurrentStep } = useCreator();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950 border-t border-slate-800 flex items-center justify-around px-2 py-1 safe-area-pb">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = currentStep === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setCurrentStep(item.key)}
            className={cn(
              'flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-[10px] font-medium transition-colors min-w-[60px]',
              active
                ? 'text-amber-300'
                : 'text-slate-400 active:text-white'
            )}
          >
            <Icon className={cn('h-5 w-5', active ? 'text-amber-300' : 'text-slate-500')} />
            <span>{item.label}</span>
          </button>
        );
      })}
      <button
        onClick={() => navigate('/super-admin')}
        className="flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-[10px] font-medium text-slate-400 active:text-white min-w-[60px]"
      >
        <LogOut className="h-5 w-5 text-slate-500" />
        <span>Exit</span>
      </button>
    </nav>
  );
};
