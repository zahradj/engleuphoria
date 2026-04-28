import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowLeft, Link2, X, Baby, GraduationCap, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreator, PPPSlide, HubType } from '../../CreatorContext';
import type { TargetHub } from './blueprintTypes';

const HUB_TO_TARGET: Record<HubType, TargetHub> = {
  playground: 'Playground',
  academy: 'Academy',
  success: 'Success',
};

const HUB_OPTIONS: Array<{ value: HubType; label: string; sub: string; Icon: any; classes: string }> = [
  { value: 'playground', label: 'Playground', sub: 'Kids · COPPA-safe', Icon: Baby,
    classes: 'data-[active=true]:from-orange-400 data-[active=true]:to-yellow-300 data-[active=true]:text-orange-950 data-[active=true]:border-orange-400' },
  { value: 'academy', label: 'Academy', sub: 'Teens · PG-13', Icon: GraduationCap,
    classes: 'data-[active=true]:from-violet-500 data-[active=true]:to-fuchsia-400 data-[active=true]:text-white data-[active=true]:border-violet-500' },
  { value: 'success', label: 'Success', sub: 'Pros · Adult', Icon: Briefcase,
    classes: 'data-[active=true]:from-emerald-500 data-[active=true]:to-teal-400 data-[active=true]:text-white data-[active=true]:border-emerald-500' },
];
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { normalizePhase } from './phaseTheme';
import { persistLesson } from '../../persistLesson';
import { BlueprintReview } from './BlueprintReview';
import type { LessonBlueprint } from './blueprintTypes';

/** Read the JSON `error` field from a Supabase Functions invoke error. */
async function readEdgeError(err: unknown): Promise<{ status?: number; message: string }> {
  const ctx: any = (err as any)?.context;
  const status = ctx?.status as number | undefined;
  let message = (err as Error)?.message || 'Request failed';
  try {
    if (ctx?.body && typeof ctx.body.getReader === 'function') {
      const text = await new Response(ctx.body).text();
      try {
        const parsed = JSON.parse(text);
        message = parsed?.error || parsed?.detail || text || message;
      } catch {
        message = text || message;
      }
    } else if (typeof ctx?.responseText === 'string') {
      try {
        message = JSON.parse(ctx.responseText)?.error || ctx.responseText;
      } catch {
        message = ctx.responseText;
      }
    }
  } catch (parseErr) {
    console.warn('Could not parse edge function error body', parseErr);
  }
  return { status, message };
}

function toastEdgeError(status: number | undefined, message: string, fallback: string) {
  if (status === 429) toast.error('Rate limit reached. Try again in a moment.');
  else if (status === 402) toast.error('AI credits exhausted. Add funds in Workspace → Usage.');
  else toast.error(message || fallback);
}

export const EmptyState: React.FC = () => {
  const { activeLessonData, replaceSlides, setCurrentStep, setActiveLessonData, setDirty } = useCreator();
  const [topic, setTopic] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [fetchingSource, setFetchingSource] = useState(false);
  const [sourceText, setSourceText] = useState<string>('');
  const [sourceTitle, setSourceTitle] = useState<string>('');
  const [draftingBlueprint, setDraftingBlueprint] = useState(false);
  const [generatingDeck, setGeneratingDeck] = useState(false);
  const [blueprint, setBlueprint] = useState<LessonBlueprint | null>(null);

  if (!activeLessonData) return null;

  const currentHub: HubType = activeLessonData.hub;
  const targetHub: TargetHub = HUB_TO_TARGET[currentHub] ?? 'Academy';
  const targetAudience = `${activeLessonData.cefr_level} ${targetHub} learner`;

  const setHub = (h: HubType) => {
    setActiveLessonData({ ...activeLessonData, hub: h });
    setDirty(true);
  };

  const fetchSource = async () => {
    const url = sourceUrl.trim();
    if (!url) return null;
    if (!/^https?:\/\//i.test(url)) {
      toast.error('Please enter a valid URL starting with http(s)://');
      return null;
    }
    setFetchingSource(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-web-source', {
        body: { url },
      });
      if (error) {
        const { status, message } = await readEdgeError(error);
        console.error('fetch-web-source failed', { status, message });
        toast.error(message || 'Could not read this website. Please try pasting the text manually.');
        return null;
      }
      const text: string = data?.text ?? '';
      const title: string = data?.title ?? '';
      if (!text) {
        toast.error('Could not read this website. Please try pasting the text manually.');
        return null;
      }
      setSourceText(text);
      setSourceTitle(title);
      toast.success(`Loaded source: ${title || url}`);
      return { text, title };
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Could not read this website. Please try pasting the text manually.');
      return null;
    } finally {
      setFetchingSource(false);
    }
  };

  const clearSource = () => {
    setSourceUrl('');
    setSourceText('');
    setSourceTitle('');
  };

  const draftBlueprint = async (overrideTopic?: string) => {
    const useTopic = (overrideTopic ?? topic).trim() || activeLessonData.lesson_title;
    if (!useTopic && !sourceText && !sourceUrl.trim()) {
      toast.error('Enter a topic or paste a source URL.');
      return;
    }

    // If a URL was pasted but not yet fetched, fetch it now.
    let material = sourceText;
    if (!material && sourceUrl.trim()) {
      const fetched = await fetchSource();
      if (!fetched) return;
      material = fetched.text;
    }

    setDraftingBlueprint(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-blueprint', {
        body: {
          topic: useTopic || sourceTitle || 'Source-grounded lesson',
          target_audience: targetAudience,
          cefr_level: activeLessonData.cefr_level,
          hub: currentHub,
          target_hub: targetHub, // hub-aware routing (TitleCase)
          skill_focus: activeLessonData.source_lesson?.skill_focus ?? 'Mixed Skills',
          source_material: material || '',
          source_url: sourceUrl.trim() || '',
        },
      });
      if (error) {
        const { status, message } = await readEdgeError(error);
        console.error('generate-blueprint failed', { status, message });
        toastEdgeError(status, message, 'Could not draft the blueprint');
        return;
      }
      const bp: LessonBlueprint | undefined = data?.blueprint;
      if (!bp) {
        toast.error('No blueprint returned. Please retry.');
        return;
      }
      setBlueprint(bp);
      toast.success(
        material
          ? 'Blueprint drafted from your source ✨ Review and edit, then approve.'
          : 'Blueprint drafted ✨ Review and edit, then approve.',
      );
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Blueprint generation failed');
    } finally {
      setDraftingBlueprint(false);
    }
  };

  const approveAndGenerate = async () => {
    if (!blueprint) return;
    setGeneratingDeck(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ppp-slides', {
        body: {
          lesson_title: blueprint.lesson_title || activeLessonData.lesson_title,
          objective: activeLessonData.target_goal,
          skill_focus: activeLessonData.source_lesson?.skill_focus ?? 'Vocabulary',
          cefr_level: activeLessonData.cefr_level,
          hub: activeLessonData.hub,
          target_hub: blueprint.target_hub ?? activeLessonData.hub,
          blueprint, // ← Blueprint-First payload (incl. phases + framework)
        },
      });
      if (error) {
        const { status, message } = await readEdgeError(error);
        console.error('generate-ppp-slides failed', { status, message });
        toastEdgeError(status, message, 'Could not generate slides');
        return;
      }
      const slides: PPPSlide[] = (data?.slides ?? []).map((s: any) => ({
        ...s,
        phase: normalizePhase(s.phase),
        layout_style: s.layout_style ?? 'full_background',
        interactive_data: s.interactive_data ?? {},
      }));
      const homework_missions = Array.isArray(data?.homework_missions) ? data.homework_missions : [];
      if (!slides.length) {
        toast.error('AI returned no slides. Please retry.');
        return;
      }
      replaceSlides(slides);
      const lessonWithMissions = {
        ...activeLessonData,
        lesson_title: blueprint.lesson_title || activeLessonData.lesson_title,
        slides,
        homework_missions,
      };
      setActiveLessonData(lessonWithMissions);
      toast.success(`Generated ${slides.length} slides + ${homework_missions.length} homework missions ✨`);

      // Auto-persist (same as before)
      const saveRes = await persistLesson(lessonWithMissions, slides, false);
      if (saveRes.ok === true) {
        if (!activeLessonData.lesson_id) {
          setActiveLessonData({ ...lessonWithMissions, lesson_id: saveRes.lesson_id });
        }
        setDirty(false);
        toast.success('Saved to your library ☁️');
      } else {
        console.error('Auto-save after generation failed:', saveRes.error);
        toast.error(`Generated, but auto-save failed: ${saveRes.error}`);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Generation failed');
    } finally {
      setGeneratingDeck(false);
    }
  };

  // ── Step 2: Blueprint Review ──
  if (blueprint) {
    return (
      <BlueprintReview
        blueprint={blueprint}
        onChange={setBlueprint}
        onApprove={approveAndGenerate}
        onRegenerate={() => draftBlueprint()}
        onBack={() => setBlueprint(null)}
        approving={generatingDeck}
        regenerating={draftingBlueprint}
      />
    );
  }

  // ── Step 1: Draft Blueprint ──
  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center p-10 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg mb-5">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
          Step 1 of 2 · Draft Blueprint
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
          What's this lesson about?
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          Describe the topic. The AI will draft a structured plan — vocabulary, grammar rule,
          reading direction, final mission — that you can review and edit before any slides are built.
          Tailored for{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {activeLessonData.cefr_level} · {activeLessonData.source_lesson?.skill_focus ?? 'Mixed Skills'}
          </span>.
        </p>

        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !draftingBlueprint) {
              e.preventDefault();
              draftBlueprint();
            }
          }}
          placeholder={`Topic — e.g. "${activeLessonData.lesson_title || 'A trip to remember'}"`}
          className="mt-6 h-12 text-base"
          disabled={draftingBlueprint}
        />

        {/* Optional source URL — NotebookLM-style source-grounded mode */}
        <div className="mt-4 text-left">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5" />
            Paste an Article / Source URL (optional)
          </label>
          <div className="mt-1.5 flex gap-2">
            <Input
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="h-11 text-sm"
              disabled={fetchingSource || draftingBlueprint}
              type="url"
            />
            {sourceText ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSource}
                disabled={fetchingSource || draftingBlueprint}
                className="h-11 px-3 shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fetchSource}
                disabled={!sourceUrl.trim() || fetchingSource || draftingBlueprint}
                className="h-11 px-3 shrink-0"
              >
                {fetchingSource ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Read'}
              </Button>
            )}
          </div>
          {fetchingSource && (
            <p className="mt-1.5 text-xs text-slate-500 italic">Reading the internet…</p>
          )}
          {sourceText && !fetchingSource && (
            <p className="mt-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Source loaded{sourceTitle ? ` — “${sourceTitle}”` : ''} ({sourceText.length.toLocaleString()} chars). The blueprint will be grounded on this text.
            </p>
          )}
        </div>

        <Button
          size="lg"
          onClick={() => draftBlueprint()}
          disabled={draftingBlueprint}
          className="mt-3 h-14 w-full text-base font-bold gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:opacity-95 text-white border-0 shadow-lg"
        >
          {draftingBlueprint ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Drafting blueprint…
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              Draft Lesson Blueprint
            </>
          )}
        </Button>

        <div className="mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrentStep('blueprint')}
            className="text-slate-500"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Blueprint
          </Button>
        </div>
      </div>
    </div>
  );
};
