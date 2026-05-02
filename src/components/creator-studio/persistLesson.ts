import { supabase } from '@/integrations/supabase/client';
import type { ActiveLessonData, PPPSlide } from './CreatorContext';

/**
 * Persist a lesson (its slides + metadata) to Supabase `curriculum_lessons`.
 * - First save (no `lesson_id`) → INSERT, returns the new row id.
 * - Subsequent saves (has `lesson_id`) → UPDATE in place.
 *
 * Used by the StudioHeader (Save Draft / Publish buttons) AND by the
 * generation flow as an auto-save the moment the AI returns slides, so a
 * page refresh never wipes a generated lesson.
 */
export type LessonKind = 'standard' | 'trial' | 'story';

export async function persistLesson(
  lesson: ActiveLessonData,
  slides: PPPSlide[],
  isPublished: boolean,
  kind: LessonKind = 'standard',
): Promise<{ ok: true; lesson_id: string } | { ok: false; error: string }> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { ok: false, error: 'You must be signed in to save.' };

  // Map CEFR (A1..C2) → allowed difficulty_level enum (beginner|intermediate|advanced).
  const cefrToDifficulty = (cefr?: string | null): 'beginner' | 'intermediate' | 'advanced' => {
    const v = String(cefr ?? '').trim().toUpperCase();
    if (v === 'A1' || v === 'A2') return 'beginner';
    if (v === 'B1' || v === 'B2') return 'intermediate';
    if (v === 'C1' || v === 'C2') return 'advanced';
    const lower = v.toLowerCase();
    if (lower === 'beginner' || lower === 'intermediate' || lower === 'advanced') {
      return lower as 'beginner' | 'intermediate' | 'advanced';
    }
    return 'beginner';
  };

  // DB CHECK constraint: target_system ∈ ('kids' | 'teen' | 'adult').
  // Map studio hubs (playground/academy/success) → allowed values.
  const hubToTargetSystem = (hub: string): 'kids' | 'teen' | 'adult' => {
    const h = (hub || '').toLowerCase();
    if (h === 'playground' || h === 'kids') return 'kids';
    if (h === 'academy' || h === 'teen' || h === 'teens') return 'teen';
    return 'adult'; // success / professional / adults
  };

  const basePayload: Record<string, any> = {
    title: lesson.lesson_title,
    description: lesson.target_goal ?? null,
    target_system: hubToTargetSystem(lesson.hub),
    difficulty_level: cefrToDifficulty(lesson.cefr_level),
    duration_minutes: 30,
    content: { slides, homework_missions: lesson.homework_missions ?? [] },
    ai_metadata: {
      source: 'creator-studio-ppp',
      kind,
      generated_at: new Date().toISOString(),
      blueprint_ref: lesson.source_lesson ?? null,
    },
    is_published: isPublished,
    skills_focus: lesson.source_lesson?.skill_focus
      ? [String(lesson.source_lesson.skill_focus)]
      : [],
    language: 'en',
    is_review: lesson.source_lesson?.skill_focus === 'Review',
  };
  if (lesson.level_id) basePayload.level_id = lesson.level_id;
  if (lesson.unit_id) basePayload.unit_id = lesson.unit_id;

  if (lesson.lesson_id) {
    const { data, error } = await supabase
      .from('curriculum_lessons')
      .update(basePayload)
      .eq('id', lesson.lesson_id)
      .select('id')
      .maybeSingle();
    if (error) return { ok: false, error: error.message };
    return { ok: true, lesson_id: data?.id ?? lesson.lesson_id };
  }

  const insertPayload = { ...basePayload, created_by: userId };
  const { data, error } = await supabase
    .from('curriculum_lessons')
    .insert(insertPayload)
    .select('id')
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, lesson_id: data.id };
}
