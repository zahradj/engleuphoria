import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LessonBlueprint {
  vocabulary: string[]; // exactly 5
  grammar: string;
  rationale?: string;
  /** Creative anchor — comma-separated topics the student loves. */
  interests?: string;
  /** Free-text accommodations / goals (e.g. "shy speaker, exam prep"). */
  specific_needs?: string;
}

export const EMPTY_BLUEPRINT: LessonBlueprint = {
  vocabulary: ['', '', '', '', ''],
  grammar: '',
  interests: '',
  specific_needs: '',
};

interface Props {
  hub: 'playground' | 'academy' | 'success';
  blueprint: LessonBlueprint | null;
  onChange: (bp: LessonBlueprint) => void;
  /** Slides to rewrite when "Sync Slides" is clicked. */
  slides: any[];
  /** Apply rewritten slides back to the editor. */
  onSyncedSlides: (slides: any[]) => void;
  cefrLevel?: string;
}

const HUB_THEME = {
  playground: {
    border: 'border-orange-200',
    chip: 'bg-orange-50 text-orange-700 border-orange-200',
    accent: 'text-orange-600',
    btn: 'bg-orange-500 hover:bg-orange-600 text-white',
    ring: 'focus:ring-orange-300',
  },
  academy: {
    border: 'border-indigo-200',
    chip: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    accent: 'text-indigo-600',
    btn: 'bg-indigo-600 hover:bg-indigo-500 text-white',
    ring: 'focus:ring-indigo-300',
  },
  success: {
    border: 'border-emerald-200',
    chip: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    accent: 'text-emerald-700',
    btn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    ring: 'focus:ring-emerald-300',
  },
};

export function LessonBlueprintPanel({
  hub,
  blueprint,
  onChange,
  slides,
  onSyncedSlides,
  cefrLevel = 'A1',
}: Props) {
  const [open, setOpen] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const t = HUB_THEME[hub];
  const bp = blueprint ?? EMPTY_BLUEPRINT;
  const hasContent = bp.vocabulary.some((v) => v.trim()) || bp.grammar.trim();

  const updateVocab = (i: number, value: string) => {
    const next = [...bp.vocabulary];
    next[i] = value;
    onChange({ ...bp, vocabulary: next });
  };
  const updateGrammar = (g: string) => onChange({ ...bp, grammar: g });

  const sync = async () => {
    if (!slides?.length) {
      toast.error('No slides to sync');
      return;
    }
    if (!bp.grammar.trim() || bp.vocabulary.filter((v) => v.trim()).length < 1) {
      toast.error('Add vocabulary and a grammar point first');
      return;
    }
    setSyncing(true);
    try {
      const { data, error } = await supabase.functions.invoke('sync-slides-to-blueprint', {
        body: {
          slides,
          vocabulary: bp.vocabulary.filter((v) => v.trim()),
          grammar: bp.grammar.trim(),
          hub,
          cefr_level: cefrLevel,
        },
      });
      if (error) throw error;
      const next = data?.slides;
      if (!Array.isArray(next) || next.length === 0) throw new Error('AI returned no slides');
      onSyncedSlides(next);
      toast.success('Slides re-aligned to blueprint ✨');
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className={`bg-white rounded-xl border-2 ${t.border} mb-3 overflow-hidden`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-slate-50"
      >
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${t.accent}`}>
          <BookOpen className="w-3.5 h-3.5" />
          📖 Lesson Blueprint
          {hasContent && <Sparkles className="w-3 h-3 opacity-60" />}
        </span>
        {open ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2.5">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Target Vocabulary (5)
                </p>
                <div className="space-y-1">
                  {bp.vocabulary.map((w, i) => (
                    <input
                      key={i}
                      value={w}
                      onChange={(e) => updateVocab(i, e.target.value)}
                      placeholder={`word ${i + 1}`}
                      className={`w-full text-xs rounded-md border ${t.border} px-2 py-1 outline-none focus:ring-2 ${t.ring}`}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">
                  Grammar Focus
                </p>
                <input
                  value={bp.grammar}
                  onChange={(e) => updateGrammar(e.target.value)}
                  placeholder="e.g. Simple Past"
                  className={`w-full text-xs rounded-md border ${t.border} px-2 py-1 outline-none focus:ring-2 ${t.ring}`}
                />
              </div>
              <button
                onClick={sync}
                disabled={syncing}
                className={`w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg px-2 py-2 ${t.btn} disabled:opacity-50`}
              >
                {syncing ? (
                  <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Syncing slides…</>
                ) : (
                  <><RefreshCw className="w-3.5 h-3.5" /> Sync Slides</>
                )}
              </button>
              <p className="text-[10px] text-slate-400 leading-snug">
                Edit a word above, then click Sync to rewrite all slides to match.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
