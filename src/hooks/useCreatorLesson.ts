import { useCallback, useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  getLibraryLessons,
  getLessonById,
  type LibraryLesson,
} from '@/services/lessonLibraryService';
import { cefrToDifficulty, hubToTargetSystem, isCefr } from '@/services/lessonHubMapping';

/**
 * Shared persistence hook for the Playground & Academy slide creators.
 *
 * Routes everything through `curriculum_lessons` (the canonical table the
 * Master Library reads from). Slides are stored as `content.slides`.
 */

export type CreatorHub = 'playground' | 'academy' | 'success';

interface UseCreatorLessonArgs {
  hub: CreatorHub;
  initialLessonId?: string | null;
}

export function useCreatorLesson({ hub, initialLessonId }: UseCreatorLessonArgs) {
  const qc = useQueryClient();
  const [lessonId, setLessonId] = useState<string | null>(initialLessonId ?? null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialLessonId && initialLessonId !== lessonId) {
      setLessonId(initialLessonId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLessonId]);

  const lessonQuery = useQuery({
    queryKey: ['creator-lesson', lessonId],
    queryFn: async () => {
      if (!lessonId) return null;
      return getLessonById(lessonId);
    },
    enabled: !!lessonId,
  });

  const libraryQuery = useQuery({
    queryKey: ['creator-library', hub],
    queryFn: () => getLibraryLessons(hub),
  });

  const persist = useCallback(
    async (
      slides: any[],
      meta: { title: string; level?: string; publish: boolean; silent?: boolean },
    ): Promise<string | null> => {
      if (!meta.silent) setIsSaving(true);
      try {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id ?? null;
        const targetSystem = hubToTargetSystem(hub);
        const levelRaw = (meta.level || '').trim();
        const cefr = isCefr(levelRaw) ? levelRaw.toUpperCase() : null;
        const difficulty = cefr ? cefrToDifficulty(cefr) : cefrToDifficulty(levelRaw || 'A1');
        const successToast = '✅ Saved to Master Library';

        if (lessonId) {
          // Preserve existing content (blueprint metadata: objectives,
          // vocabularyTheme, ai_wizard_manifest, mediaAssets, homework_missions, etc.)
          // and existing ai_metadata while merging the new slides + hub/cefr.
          const { data: existing } = await supabase
            .from('curriculum_lessons')
            .select('content, ai_metadata')
            .eq('id', lessonId)
            .maybeSingle();
          const prevContent = (existing?.content as Record<string, any> | null) ?? {};
          const mergedContent = {
            ...prevContent,
            slides,
            hub,
            updated_at: new Date().toISOString(),
          };
          const mergedMeta = {
            ...(existing?.ai_metadata as Record<string, any> | null ?? {}),
            hub,
            ...(cefr ? { cefr_level: cefr } : {}),
            slideCount: slides.length,
          };
          const { error } = await supabase
            .from('curriculum_lessons')
            .update({
              title: meta.title,
              content: mergedContent,
              is_published: meta.publish,
              difficulty_level: difficulty,
              target_system: targetSystem,
              ai_metadata: mergedMeta,
            })
            .eq('id', lessonId);
          if (error) throw error;
          qc.invalidateQueries({ queryKey: ['creator-lesson', lessonId] });
          qc.invalidateQueries({ queryKey: ['creator-library', hub] });
          qc.invalidateQueries({ queryKey: ['curriculum-lessons-library'] });
          if (!meta.silent) toast.success(successToast);
          return lessonId;
        }

        const content = {
          slides,
          hub,
          updated_at: new Date().toISOString(),
        };
          qc.invalidateQueries({ queryKey: ['creator-lesson', lessonId] });
          qc.invalidateQueries({ queryKey: ['creator-library', hub] });
          qc.invalidateQueries({ queryKey: ['curriculum-lessons-library'] });
          if (!meta.silent) toast.success(successToast);
          return lessonId;
        }

        const { data, error } = await supabase
          .from('curriculum_lessons')
          .insert({
            title: meta.title,
            description: `${hub === 'playground' ? 'Playground' : hub === 'success' ? 'Success Hub' : 'Academy'} lesson`,
            target_system: targetSystem,
            difficulty_level: difficulty,
            duration_minutes: hub === 'playground' ? 30 : 60,
            content,
            is_published: meta.publish,
            created_by: userId,
            ai_metadata: { hub, cefr_level: cefr ?? undefined, slideCount: slides.length },
          } as any)
          .select('id')
          .single();
        if (error) throw error;
        const newId = (data as any).id as string;
        setLessonId(newId);
        qc.invalidateQueries({ queryKey: ['creator-library', hub] });
        qc.invalidateQueries({ queryKey: ['curriculum-lessons-library'] });
        if (!meta.silent) toast.success(successToast);
        return newId;
      } catch (e: any) {
        console.error('[useCreatorLesson] persist error', e);
        if (!meta.silent) toast.error(e?.message || 'Failed to save lesson');
        return null;
      } finally {
        if (!meta.silent) setIsSaving(false);
      }
    },
    [hub, lessonId, qc],
  );

  const saveDraft = useCallback(
    (slides: any[], meta: { title: string; level?: string }) =>
      persist(slides, { ...meta, publish: false }),
    [persist],
  );

  const publish = useCallback(
    (slides: any[], meta: { title: string; level?: string }) =>
      persist(slides, { ...meta, publish: true }),
    [persist],
  );

  const silentSaveDraft = useCallback(
    (slides: any[], meta: { title: string; level?: string }) =>
      persist(slides, { ...meta, publish: false, silent: true }),
    [persist],
  );

  const importLesson = useCallback(async (id: string): Promise<LibraryLesson | null> => {
    try {
      const lesson = await getLessonById(id);
      setLessonId(id);
      return lesson;
    } catch (e: any) {
      toast.error(e?.message || 'Failed to import lesson');
      return null;
    }
  }, []);

  return {
    lessonId,
    setLessonId,
    lesson: lessonQuery.data,
    isLoadingLesson: lessonQuery.isLoading,
    library: libraryQuery.data ?? [],
    isLoadingLibrary: libraryQuery.isLoading,
    refreshLibrary: () => qc.invalidateQueries({ queryKey: ['creator-library', hub] }),
    saveDraft,
    publish,
    silentSaveDraft,
    isSaving,
    importLesson,
  };
}
