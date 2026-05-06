/**
 * Resolves the canonical Master Library lesson + hub for a classroom booking.
 *
 * Priority chain:
 *   1. lessons.curriculum_lesson_id  → curriculum_lessons row (THE master library)
 *   2. class_bookings.hub_type       → just the hub (no slides)
 */
import { supabase } from '@/integrations/supabase/client';
import { getLessonById, getLibraryLessonSlides, type LibraryLesson } from './lessonLibraryService';

export type ClassroomHub = 'playground' | 'academy' | 'professional';

export interface ResolvedClassroomLesson {
  hubType: ClassroomHub;
  lesson: LibraryLesson | null;
  lessonId: string | null;
  lessonTitle: string | null;
  slides: any[];
}

const FALLBACK_HUB: ClassroomHub = 'academy';

export function normalizeHub(value?: string | null): ClassroomHub {
  const v = String(value ?? '').toLowerCase();
  if (v === 'playground' || v === 'kids') return 'playground';
  if (v === 'professional' || v === 'success' || v === 'adult' || v === 'adults') return 'professional';
  if (v === 'academy' || v === 'teen' || v === 'teens') return 'academy';
  return FALLBACK_HUB;
}

export async function resolveBookingLesson(booking: {
  id: string;
  lesson_id?: string | null;
  hub_type?: string | null;
}): Promise<ResolvedClassroomLesson> {
  let curriculumLessonId: string | null = null;

  if (booking.lesson_id) {
    const { data: lessonRow } = await supabase
      .from('lessons')
      .select('curriculum_lesson_id, title')
      .eq('id', booking.lesson_id)
      .maybeSingle();
    curriculumLessonId = (lessonRow as any)?.curriculum_lesson_id ?? null;
  }

  let lesson: LibraryLesson | null = null;
  if (curriculumLessonId) {
    try {
      lesson = await getLessonById(curriculumLessonId);
    } catch (e) {
      console.warn('[classroomLessonResolver] failed to load curriculum lesson:', e);
    }
  }

  const hubFromLesson = lesson ? normalizeHub(lesson.target_system) : null;
  const hubType = hubFromLesson ?? normalizeHub(booking.hub_type);

  return {
    hubType,
    lesson,
    lessonId: lesson?.id ?? null,
    lessonTitle: lesson?.title ?? null,
    slides: lesson ? getLibraryLessonSlides(lesson) : [],
  };
}
