// Sequencer — applies cognitive-load corrections to a selected slot list.
// Selection already considers pacing; sequencer enforces hard caps post-hoc.

import type { GenerationContext } from '../types';
import type { SelectedSlot } from './activitySelector';
import { ACTIVITY_CATALOG } from '../catalog/activityCatalog';

export function enforcePacing(
  slots: SelectedSlot[],
  ctx: GenerationContext,
): SelectedSlot[] {
  const maxRecep = ctx.plan.cognitive_load.max_consecutive_receptive;
  const maxSame = ctx.plan.cognitive_load.max_consecutive_same_modality;
  const speakEvery = ctx.plan.cognitive_load.speaking_every_n_slides;

  let recepStreak = 0;
  let lastModality = '';
  let sameModalityStreak = 0;
  let sinceSpeaking = 0;

  return slots.map((slot) => {
    const entry = ACTIVITY_CATALOG[slot.type];
    const isProductive = entry.productive;
    const dominantModality = entry.modalities[0] ?? 'thinking';

    if (!isProductive) recepStreak++;
    else recepStreak = 0;

    if (dominantModality === lastModality) sameModalityStreak++;
    else sameModalityStreak = 1;
    lastModality = dominantModality;

    if (entry.modalities.includes('speaking')) sinceSpeaking = 0;
    else sinceSpeaking++;

    // Soft swap rules — we just annotate. Real swap would re-rank; we keep selector authoritative.
    if (recepStreak > maxRecep) {
      // Mark as needing a productive break — selector will be re-invoked next iteration in caller.
      (slot as any).__needs_productive_break = true;
    }
    if (sameModalityStreak > maxSame) {
      (slot as any).__needs_modality_break = true;
    }
    if (sinceSpeaking > speakEvery) {
      (slot as any).__needs_speaking = true;
    }
    return slot;
  });
}
