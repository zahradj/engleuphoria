// Phase color tokens for the Slide Studio. Phases map to PPP arc.
export type PhaseKey =
  | 'Warm-up'
  | 'Presentation'
  | 'Practice'
  | 'Production'
  | 'Review';

export interface PhaseStyle {
  label: string;
  chip: string;       // pill background + text
  ring: string;       // active outline
  dot: string;        // small accent dot
  gradient: string;   // soft background gradient
}

export const PHASE_STYLES: Record<PhaseKey, PhaseStyle> = {
  'Warm-up': {
    label: 'Warm-up',
    chip: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    ring: 'ring-amber-400',
    dot: 'bg-amber-500',
    gradient: 'from-amber-500/10 to-orange-500/10',
  },
  Presentation: {
    label: 'Presentation',
    chip: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
    ring: 'ring-sky-400',
    dot: 'bg-sky-500',
    gradient: 'from-sky-500/10 to-indigo-500/10',
  },
  Practice: {
    label: 'Practice',
    chip: 'bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300',
    ring: 'ring-violet-400',
    dot: 'bg-violet-500',
    gradient: 'from-violet-500/10 to-purple-500/10',
  },
  Production: {
    label: 'Production',
    chip: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    ring: 'ring-emerald-400',
    dot: 'bg-emerald-500',
    gradient: 'from-emerald-500/10 to-teal-500/10',
  },
  Review: {
    label: 'Review',
    chip: 'bg-slate-200 text-slate-800 dark:bg-slate-500/20 dark:text-slate-300',
    ring: 'ring-slate-400',
    dot: 'bg-slate-500',
    gradient: 'from-slate-500/10 to-zinc-500/10',
  },
};

export function normalizePhase(p?: string): PhaseKey {
  if (!p) return 'Presentation';
  const lower = p.toLowerCase();
  if (lower.startsWith('warm')) return 'Warm-up';
  if (lower.startsWith('present')) return 'Presentation';
  if (lower.startsWith('pract')) return 'Practice';
  if (lower.startsWith('produc')) return 'Production';
  if (lower.startsWith('rev')) return 'Review';
  return 'Presentation';
}

export const PHASE_ORDER: PhaseKey[] = [
  'Warm-up',
  'Presentation',
  'Practice',
  'Production',
  'Review',
];
