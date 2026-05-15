import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { extractEdgeError } from '@/lib/extractEdgeError';

export const MIN_VOCAB_FOR_HOMEWORK = 3;

export function getVocabArray(blueprint: any): string[] {
  const raw = blueprint?.vocabulary ?? blueprint?.target_vocabulary ?? [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((v: any) => (typeof v === 'string' ? v : v?.word ?? v?.term ?? ''))
    .map((s: string) => (s || '').trim())
    .filter(Boolean);
}

export function homeworkGuardReason(
  lessonId: string | null | undefined,
  blueprint: any
): string | null {
  if (!lessonId) return 'Save the lesson once before generating homework.';
  const vocab = getVocabArray(blueprint);
  if (vocab.length < MIN_VOCAB_FOR_HOMEWORK) {
    return `Please add at least ${MIN_VOCAB_FOR_HOMEWORK} vocabulary words to this lesson before generating homework.`;
  }
  return null;
}

interface GenerateArgs {
  lessonId: string | null | undefined;
  blueprint: any;
  title: string;
  hub: 'academy' | 'playground' | 'success';
}

export async function generateHomeworkSafe({ lessonId, blueprint, title, hub }: GenerateArgs) {
  const reason = homeworkGuardReason(lessonId, blueprint);
  if (reason) {
    toast.error(reason);
    return { ok: false as const };
  }
  const tId = (toast as any).loading?.('Generating homework…');
  try {
    const { data, error } = await supabase.functions.invoke('generate-homework', {
      body: { lesson_id: lessonId, blueprint, title: title || 'Lesson', hub },
    });
    if (error || data?.error) {
      const raw = await extractEdgeError({ error, data, fallback: 'Generation failed' });
      const code = data?.code || (typeof raw === 'string' && raw.includes('INSUFFICIENT_VOCABULARY') ? 'INSUFFICIENT_VOCABULARY' : null);
      if (code === 'INSUFFICIENT_VOCABULARY') {
        toast.error(`Please add at least ${MIN_VOCAB_FOR_HOMEWORK} vocabulary words to this lesson before generating homework.`);
      } else {
        toast.error("Couldn't generate homework. Please try again.");
      }
      return { ok: false as const };
    }
    toast.success('Homework ready ✓');
    return { ok: true as const, data };
  } catch (e: any) {
    console.error('[homeworkGuard]', e);
    toast.error("Couldn't generate homework. Please try again.");
    return { ok: false as const };
  } finally {
    if (tId) (toast as any).dismiss?.(tId);
  }
}
