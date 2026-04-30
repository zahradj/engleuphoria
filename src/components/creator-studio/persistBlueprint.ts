import { supabase } from '@/integrations/supabase/client';
import type { CurriculumData } from './CreatorContext';

/**
 * After the AI generates a curriculum blueprint, bulk-insert every lesson stub
 * into `curriculum_lessons` as `is_published = false` (draft/locked). Also
 * upserts the parent `curriculum_levels` and `curriculum_units` rows so the
 * full Level → Unit → Lesson hierarchy exists in the database.
 *
 * Returns the IDs of the inserted levels, units, and lessons so the
 * CurriculumMap can link them when the user opens a lesson in the Slide Studio.
 */
export async function persistBlueprintAsDrafts(curriculum: CurriculumData) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) throw new Error('You must be signed in to save a blueprint.');

  // Map hub → target_system enum used by the DB.
  const hubToTargetSystem = (hub: string): 'kids' | 'teen' | 'adult' => {
    const h = (hub || '').toLowerCase();
    if (h === 'playground' || h === 'kids') return 'kids';
    if (h === 'academy' || h === 'teen' || h === 'teens') return 'teen';
    return 'adult';
  };

  // Map CEFR → difficulty_level enum.
  const cefrToDifficulty = (cefr: string): 'beginner' | 'intermediate' | 'advanced' => {
    const v = cefr.toUpperCase();
    if (v === 'A1' || v === 'A2') return 'beginner';
    if (v === 'B1' || v === 'B2') return 'intermediate';
    return 'advanced';
  };

  const targetSystem = hubToTargetSystem(curriculum.hub);
  const difficultyLevel = cefrToDifficulty(curriculum.cefr_level);

  // 1. Upsert level
  const { data: levelRow, error: levelErr } = await supabase
    .from('curriculum_levels')
    .upsert(
      {
        name: `${curriculum.cefr_level} – ${curriculum.curriculum_title}`,
        cefr_level: curriculum.cefr_level,
        age_group: targetSystem,
        target_system: targetSystem,
        description: curriculum.theme_hint || null,
      },
      { onConflict: 'id' }, // always insert a new row
    )
    .select('id')
    .single();
  if (levelErr) throw levelErr;
  const levelId = levelRow.id;

  // 2. Insert units
  const unitIdMap = new Map<string, string>(); // local uid → DB uuid
  for (const unit of curriculum.units) {
    const { data: unitRow, error: unitErr } = await supabase
      .from('curriculum_units')
      .insert({
        title: unit.unit_title,
        unit_number: unit.unit_number ?? 1,
        cefr_level: curriculum.cefr_level,
        age_group: targetSystem,
        created_by: userId,
        is_published: false,
      })
      .select('id')
      .single();
    if (unitErr) throw unitErr;
    unitIdMap.set(unit.id, unitRow.id);
  }

  // 3. Bulk-insert lesson stubs as DRAFT
  const lessonRows = curriculum.units.flatMap((unit) =>
    unit.lessons.map((lesson, idx) => ({
      title: lesson.title,
      description: lesson.objective || lesson.learning_objective || null,
      target_system: targetSystem,
      difficulty_level: difficultyLevel,
      duration_minutes: curriculum.hub === 'playground' ? 30 : 30,
      content: { slides: [] }, // empty until the creator builds slides
      is_published: false, // 🔒 DRAFT
      created_by: userId,
      level_id: levelId,
      unit_id: unitIdMap.get(unit.id) || null,
      sequence_order: lesson.lesson_number ?? idx + 1,
      skills_focus: lesson.skill_focus ? [String(lesson.skill_focus)] : [],
      language: 'en',
      is_review: lesson.skill_focus === 'Review',
      ai_metadata: {
        source: 'blueprint-auto-save',
        generated_at: new Date().toISOString(),
        blueprint_ref: lesson,
      },
    })),
  );

  const { data: insertedLessons, error: lessonsErr } = await supabase
    .from('curriculum_lessons')
    .insert(lessonRows as any[])
    .select('id, unit_id, sequence_order');
  if (lessonsErr) throw lessonsErr;

  return {
    levelId,
    unitIdMap,
    insertedLessons: insertedLessons ?? [],
    totalCount: lessonRows.length,
  };
}
