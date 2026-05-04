/**
 * Single source of truth for mapping between studio "hub" labels
 * (playground/academy/success) and the canonical `target_system`
 * enum stored in `curriculum_lessons` (kids/teen/adult), plus the
 * CEFR ↔ difficulty_level enum mapping.
 */

export type StudioHub = 'playground' | 'academy' | 'success';
export type TargetSystem = 'kids' | 'teen' | 'adult';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export function hubToTargetSystem(hub: string | null | undefined): TargetSystem {
  const h = (hub || '').toLowerCase();
  if (h === 'playground' || h === 'kids') return 'kids';
  if (h === 'academy' || h === 'teen' || h === 'teens') return 'teen';
  return 'adult';
}

export function targetSystemToHub(ts: string | null | undefined): StudioHub {
  const t = (ts || '').toLowerCase();
  if (t === 'kids') return 'playground';
  if (t === 'teen') return 'academy';
  return 'success';
}

export function cefrToDifficulty(cefr?: string | null): DifficultyLevel {
  const v = String(cefr ?? '').trim().toUpperCase();
  if (v === 'A1' || v === 'A2') return 'beginner';
  if (v === 'B1' || v === 'B2') return 'intermediate';
  if (v === 'C1' || v === 'C2') return 'advanced';
  const lower = v.toLowerCase();
  if (lower === 'beginner' || lower === 'intermediate' || lower === 'advanced') {
    return lower as DifficultyLevel;
  }
  return 'beginner';
}

export function isCefr(value?: string | null): boolean {
  const v = String(value ?? '').trim().toUpperCase();
  return ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(v);
}
