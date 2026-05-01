import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Palette, Library, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'relative flex-shrink-0 flex flex-col bg-slate-950 text-slate-100 border-r border-slate-800 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center justify-center shadow"
      >
        {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      {/* Brand */}
      <div className={cn('h-16 flex items-center border-b border-slate-800', collapsed ? 'px-2 justify-center' : 'px-5')}>
        <Logo size="small" />
        {!collapsed && (
          <div className="ml-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">Studio</div>
            <div className="text-xs text-slate-400 -mt-0.5">Content publishing</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className={cn('flex-1 space-y-1', collapsed ? 'p-2' : 'p-3')}>
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = currentStep === item.key;
          return (
            <button
              key={item.key}
              onClick={() => { setCurrentStep(item.key); navigate(`/content-creator/${item.key}`); }}
              title={collapsed ? item.label : undefined}
              className={cn(
                'w-full flex items-center rounded-lg text-sm font-medium transition-all',
                collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5',
                active
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-300 border border-amber-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              )}
            >
              {collapsed ? (
                <Icon className={cn('h-5 w-5', active ? 'text-amber-300' : 'text-slate-400')} />
              ) : (
                <>
                  <span className="text-base leading-none">{item.emoji}</span>
                  <Icon className={cn('h-4 w-4', active ? 'text-amber-300' : 'text-slate-400')} />
                  <span className="truncate">{item.label}</span>
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn('border-t border-slate-800', collapsed ? 'p-2' : 'p-3')}>
        <button
          onClick={() => navigate('/super-admin')}
          title={collapsed ? 'Exit Studio' : undefined}
          className={cn(
            'w-full flex items-center rounded-lg text-sm text-slate-400 hover:bg-slate-900 hover:text-white transition-colors',
            collapsed ? 'justify-center px-0 py-2.5' : 'gap-3 px-3 py-2.5'
          )}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && 'Exit Studio'}
        </button>
      </div>
    </aside>
  );
};
