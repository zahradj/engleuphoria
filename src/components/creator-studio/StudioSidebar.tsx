import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Palette, Library, LogOut } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { cn } from '@/lib/utils';
import { useCreator, CreatorStep } from './CreatorContext';

const NAV: Array<{ key: CreatorStep; label: string; icon: React.ElementType; emoji: string }> = [
  { key: 'blueprint', label: 'Curriculum Blueprint', icon: Map, emoji: '🗺️' },
  { key: 'slide-builder', label: 'Slide Studio', icon: Palette, emoji: '🎨' },
  { key: 'library', label: 'Master Library', icon: Library, emoji: '📚' },
];

export const StudioSidebar: React.FC = () => {
  const { currentStep, setCurrentStep } = useCreator();
  const navigate = useNavigate();

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col bg-slate-950 text-slate-100 border-r border-slate-800">
      {/* Brand */}
      <div className="h-16 flex items-center px-5 border-b border-slate-800">
        <Logo size="small" />
        <div className="ml-3">
          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Studio</div>
          <div className="text-xs text-slate-400 -mt-0.5">Content publishing</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = currentStep === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setCurrentStep(item.key)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                active
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              )}
            >
              <span className="text-base leading-none">{item.emoji}</span>
              <Icon className={cn('h-4 w-4', active ? 'text-amber-300' : 'text-slate-400')} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800">
        <button
          onClick={() => navigate('/super-admin')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Exit Studio
        </button>
      </div>
    </aside>
  );
};
