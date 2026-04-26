import React, { useMemo } from 'react';
import { PPPSlide } from '../../CreatorContext';
import { PHASE_STYLES, normalizePhase } from './phaseTheme';
import { cn } from '@/lib/utils';
import { Pencil } from 'lucide-react';

interface Props {
  slide: PPPSlide;
  onChange: (patch: Partial<PPPSlide>) => void;
}

interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

function tryParseMCQ(content?: string): MCQ | null {
  if (!content) return null;
  try {
    const v = JSON.parse(content);
    if (v && typeof v.question === 'string' && Array.isArray(v.options)) return v as MCQ;
  } catch {}
  return null;
}

export const SlideCanvas: React.FC<Props> = ({ slide, onChange }) => {
  const phaseKey = normalizePhase(slide.phase as string);
  const style = PHASE_STYLES[phaseKey];

  const bgUrl = useMemo(() => {
    const kw = (slide.visual_keyword || 'classroom').trim().replace(/\s+/g, ',');
    return slide.custom_image_url || `https://source.unsplash.com/1600x1000/?${encodeURIComponent(kw)}`;
  }, [slide.visual_keyword, slide.custom_image_url]);

  const mcq = slide.slide_type === 'multiple_choice' ? tryParseMCQ(slide.content) : null;

  return (
    <section className="flex-1 min-w-0 h-full overflow-y-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Phase strip */}
        <div className="flex items-center justify-between mb-3">
          <span className={cn('text-[11px] font-bold uppercase tracking-widest px-2 py-1 rounded', style.chip)}>
            {style.label}
          </span>
          <span className="text-[11px] font-mono text-slate-400">{slide.slide_type}</span>
        </div>

        {/* Canvas card */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800"
          style={{ aspectRatio: '16 / 10' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${bgUrl})` }}
            aria-hidden
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" aria-hidden />

          <div className="relative h-full w-full flex flex-col justify-end p-8 sm:p-10 text-white">
            <input
              type="text"
              value={slide.title ?? ''}
              onChange={(e) => onChange({ title: e.target.value })}
              placeholder="Slide title…"
              className="bg-transparent text-3xl sm:text-4xl font-extrabold tracking-tight outline-none border-0 placeholder:text-white/50 focus:bg-white/5 rounded-md px-1"
            />

            {!mcq && (
              <textarea
                value={slide.content ?? ''}
                onChange={(e) => onChange({ content: e.target.value })}
                placeholder="Write the on-slide content…"
                rows={3}
                className="mt-3 max-w-3xl bg-transparent text-base sm:text-lg leading-relaxed outline-none border-0 placeholder:text-white/40 focus:bg-white/5 rounded-md px-1 resize-none"
              />
            )}

            {mcq && (
              <div className="mt-4 max-w-3xl">
                <input
                  value={mcq.question}
                  onChange={(e) => onChange({ content: JSON.stringify({ ...mcq, question: e.target.value }) })}
                  className="w-full bg-transparent text-lg sm:text-xl font-semibold outline-none border-0 placeholder:text-white/40 focus:bg-white/5 rounded-md px-1"
                  placeholder="Question…"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                  {mcq.options.map((opt, i) => {
                    const isAnswer = opt === mcq.answer;
                    return (
                      <div
                        key={i}
                        className={cn(
                          'flex items-center gap-2 rounded-xl px-3 py-2 backdrop-blur',
                          isAnswer ? 'bg-emerald-500/30 ring-1 ring-emerald-400' : 'bg-white/10',
                        )}
                      >
                        <span className="text-xs font-mono text-white/60">{String.fromCharCode(65 + i)}</span>
                        <input
                          value={opt}
                          onChange={(e) => {
                            const options = [...mcq.options];
                            const newAnswer = options[i] === mcq.answer ? e.target.value : mcq.answer;
                            options[i] = e.target.value;
                            onChange({ content: JSON.stringify({ ...mcq, options, answer: newAnswer }) });
                          }}
                          className="flex-1 bg-transparent text-sm outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => onChange({ content: JSON.stringify({ ...mcq, answer: opt }) })}
                          className={cn(
                            'text-[10px] font-bold uppercase px-1.5 py-0.5 rounded',
                            isAnswer ? 'bg-emerald-400 text-emerald-950' : 'bg-white/10 text-white/70 hover:bg-white/20',
                          )}
                        >
                          {isAnswer ? '✓ Answer' : 'Mark'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {slide.slide_type === 'drawing_prompt' && (
              <div className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-xs font-semibold">
                <Pencil className="h-3.5 w-3.5" />
                Drawing prompt — students sketch their answer
              </div>
            )}
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
          Background pulled from Unsplash via <span className="font-mono">{slide.visual_keyword}</span>. Edit the keyword in the right panel to swap.
        </p>
      </div>
    </section>
  );
};
