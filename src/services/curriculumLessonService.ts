import { supabase } from '@/integrations/supabase/client';
import { SystemId, CurriculumLesson } from '@/types/multiTenant';

export async function getLessonsBySystem(systemId: SystemId): Promise<CurriculumLesson[]> {
  const { data, error } = await supabase
    .from('curriculum_lessons')
    .select('*')
    .eq('target_system', systemId)
    .eq('is_published', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching curriculum lessons:', error);
    throw error;
  }

  return (data || []) as CurriculumLesson[];
}

export async function getCurriculumLessonById(lessonId: string): Promise<CurriculumLesson | null> {
  const { data, error } = await supabase
    .from('curriculum_lessons')
    .select('*')
    .eq('id', lessonId)
    .single();

  if (error) {
    console.error('Error fetching curriculum lesson:', error);
    return null;
  }

  return data as CurriculumLesson;
}
