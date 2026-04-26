import React, { useMemo } from 'react';
import { Image as ImageIcon, ListChecks, Pencil } from 'lucide-react';
import { PPPSlide } from '../../CreatorContext';
import { PHASE_ORDER, PHASE_STYLES, PhaseKey, normalizePhase } from './phaseTheme';
import { cn } from '@/lib/utils';

interface Props {
  slides: PPPSlide[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

const TYPE_ICON: Record<string, React.ElementType> = {
  text_image: ImageIcon,
  multiple_choice: ListChecks,
  drawing_prompt: Pencil,
};

export const SlideThumbnailRail: React.FC<Props> = ({ slides, activeId, onSelect }) => {
  const grouped = useMemo(() => {
    const map = new Map<PhaseKey, PPPSlide[]>();
    for (const s of slides) {
      const key = normalizePhase(s.phase as string);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(s);
    }
    return map;
  }, [slides]);

  return (
    <aside className="w-[260px] shrink-0 h-full overflow-y-auto bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border-r border-slate-200 dark:border-slate-800 p-3 space-y-4">
      {PHASE_ORDER.map((phase) => {
        const items = grouped.get(phase) ?? [];
        if (!items.length) return null;
        const style = PHASE_STYLES[phase];
        return (
          <div key={phase}>
            <div className="flex items-center gap-2 px-1 mb-2">
              <span className={cn('h-1.5 w-1.5 rounded-full', style.dot)} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                {style.label}
              </span>
            </div>
            <ul className="space-y-2">
              {items.map((s, i) => {
                const Icon = TYPE_ICON[s.slide_type ?? 'text_image'] ?? ImageIcon;
                const active = s.id === activeId;
                const idx = slides.findIndex((x) => x.id === s.id) + 1;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(s.id)}
                      className={cn(
                        'w-full text-left rounded-xl border bg-gradient-to-br p-3 transition-all',
                        style.gradient,
                        active
                          ? `ring-2 ${style.ring} border-transparent shadow-md scale-[1.01]`
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
                      )}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', style.chip)}>
                          {style.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">#{idx}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <Icon className="h-3.5 w-3.5 mt-0.5 text-slate-500 shrink-0" />
                        <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                          {s.title || 'Untitled slide'}
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </aside>
  );
};
