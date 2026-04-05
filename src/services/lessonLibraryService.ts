import { supabase } from '@/integrations/supabase/client';
import { GeneratedSlide, HubType } from '@/components/admin/lesson-builder/ai-wizard/types';

export interface LibraryLesson {
  id: string;
  title: string;
  description: string | null;
  target_system: string;
  difficulty_level: string;
  duration_minutes: number | null;
  thumbnail_url: string | null;
  content: any;
  is_published: boolean;
  created_at: string;
  created_by: string | null;
  ai_metadata: any;
}

const HUB_MAP: Record<string, string> = {
  kids: 'playground',
  teens: 'academy',
  adults: 'professional',
  playground: 'playground',
  academy: 'academy',
  professional: 'professional',
};

/**
 * Save a generated lesson to curriculum_lessons (the library).
 */
export async function saveToLibrary(
  topic: string,
  hub: HubType,
  level: string,
  slides: GeneratedSlide[],
  thumbnailUrl?: string
) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  const { data, error } = await supabase
    .from('curriculum_lessons')
    .insert({
      title: topic,
      description: `AI-generated ${hub} lesson on "${topic}"`,
      target_system: hub,
      difficulty_level: level,
      duration_minutes: 30,
      thumbnail_url: thumbnailUrl || null,
      content: { slides, hub, generatedAt: new Date().toISOString() },
      is_published: true,
      created_by: userId || null,
      ai_metadata: { hub, level, slideCount: slides.length },
    } as any)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Fetch all published lessons from the library.
 */
export async function getLibraryLessons(hubFilter?: string) {
  let query = supabase
    .from('curriculum_lessons')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  if (hubFilter && hubFilter !== 'all') {
    query = query.eq('target_system', hubFilter);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as LibraryLesson[];
}

/**
 * Fetch a single lesson by ID.
 */
export async function getLessonById(id: string) {
  const { data, error } = await supabase
    .from('curriculum_lessons')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as LibraryLesson;
}
