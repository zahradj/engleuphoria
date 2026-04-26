import React from 'react';
import { Plus, FileText, Gamepad2, Trash2, ChevronUp, ChevronDown, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudioSlide, PHASE_COLOR, PHASE_LABEL, unsplashUrl } from './types';
import { cn } from '@/lib/utils';

interface Props {
  slides: StudioSlide[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddBlank: () => void;
  onAddActivity: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}

export const SlideFilmstrip: React.FC<Props> = ({
  slides, selectedId, onSelect, onAddBlank, onAddActivity, onDuplicate, onDelete, onMove,
}) => {
  return (
    <aside className="w-[240px] flex-shrink-0 flex flex-col gap-2 h-full">
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-2">
        {slides.length === 0 && (
          <div className="rounded-xl border border-dashed border-border/60 bg-card/40 p-6 text-center text-xs text-muted-foreground">
            No slides yet. Generate with AI or add manually.
          </div>
        )}
        {slides.map((slide, i) => {
          const isActive = slide.id === selectedId;
          const imgSrc = slide.custom_image_url || unsplashUrl(slide.visual_keyword);
          return (
            <div
              key={slide.id}
              onClick={() => onSelect(slide.id)}
              className={cn(
                'group relative rounded-xl border bg-card/60 backdrop-blur cursor-pointer transition-all overflow-hidden',
                isActive
                  ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-lg'
                  : 'border-border/50 hover:border-border'
              )}
            >
              <div className={cn('h-1', PHASE_COLOR[slide.phase])} />
              <div className="p-2 flex gap-2">
                <div className="relative w-16 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  <img src={imgSrc} alt="" className="w-full h-full object-cover" loading="lazy"
                       onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {i + 1} · {PHASE_LABEL[slide.phase]}
                  </div>
                  <div className="text-xs font-semibold truncate">
                    {slide.title || 'Untitled slide'}
                  </div>
                </div>
              </div>
              {isActive && (
                <div className="flex items-center justify-between border-t border-border/50 px-1.5 py-1 bg-background/40">
                  <div className="flex gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); onMove(slide.id, -1); }}
                      className="h-6 w-6 rounded hover:bg-muted flex items-center justify-center"
                      title="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onMove(slide.id, 1); }}
                      className="h-6 w-6 rounded hover:bg-muted flex items-center justify-center"
                      title="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex gap-0.5">
                    <button
                      onClick={(e) => { e.stopPropagation(); onDuplicate(slide.id); }}
                      className="h-6 w-6 rounded hover:bg-muted flex items-center justify-center"
                      title="Duplicate"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDelete(slide.id); }}
                      className="h-6 w-6 rounded hover:bg-destructive/10 text-destructive flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex-shrink-0 grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
        <Button variant="outline" size="sm" onClick={onAddBlank} className="text-xs">
          <FileText className="h-3.5 w-3.5 mr-1" /> Blank
        </Button>
        <Button variant="outline" size="sm" onClick={onAddActivity} className="text-xs">
          <Gamepad2 className="h-3.5 w-3.5 mr-1" /> Activity
        </Button>
      </div>
    </aside>
  );
};
