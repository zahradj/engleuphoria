import React, { useState } from 'react';
import { Sparkles, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCreator, PPPSlide } from '../../CreatorContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { normalizePhase } from './phaseTheme';

export const EmptyState: React.FC = () => {
  const { activeLessonData, replaceSlides, setCurrentStep } = useCreator();
  const [loading, setLoading] = useState(false);

  if (!activeLessonData) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-ppp-slides', {
        body: {
          lesson_title: activeLessonData.lesson_title,
          objective: activeLessonData.target_goal,
          skill_focus: activeLessonData.source_lesson?.skill_focus ?? 'Vocabulary',
          cefr_level: activeLessonData.cefr_level,
          hub: activeLessonData.hub,
        },
      });
      if (error) {
        const ctx: any = (error as any).context;
        const status = ctx?.status;
        // Try to read the actual error body returned by the edge function
        let backendMessage = '';
        try {
          if (ctx?.body && typeof ctx.body.getReader === 'function') {
            const text = await new Response(ctx.body).text();
            const parsed = JSON.parse(text);
            backendMessage = parsed?.error || parsed?.detail || text;
          } else if (typeof ctx?.responseText === 'string') {
            try { backendMessage = JSON.parse(ctx.responseText)?.error || ctx.responseText; }
            catch { backendMessage = ctx.responseText; }
          }
        } catch (parseErr) {
          console.warn('Could not parse edge function error body', parseErr);
        }
        console.error('generate-ppp-slides failed', { status, backendMessage, error });
        if (status === 429) toast.error('Rate limit reached. Try again in a moment.');
        else if (status === 402) toast.error('AI credits exhausted. Add funds in Workspace → Usage.');
        else toast.error(backendMessage || error.message || 'Could not generate slides');
        return;
      }
      const slides: PPPSlide[] = (data?.slides ?? []).map((s: any) => ({
        ...s,
        phase: normalizePhase(s.phase),
        layout_style: s.layout_style ?? 'full_background',
        interactive_data: s.interactive_data ?? {},
      }));
      if (!slides.length) {
        toast.error('AI returned no slides. Please retry.');
        return;
      }
      replaceSlides(slides);
      toast.success(`Generated ${slides.length} slides ✨`);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="max-w-xl w-full text-center p-10 rounded-3xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-lg mb-5">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          Let the AI build your PPP arc
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          Six classroom-ready slides — Warm-up, Presentation, Practice, Production, Review — tailored to{' '}
          <span className="font-semibold text-slate-700 dark:text-slate-200">
            {activeLessonData.cefr_level} · {activeLessonData.source_lesson?.skill_focus ?? 'Mixed Skills'}
          </span>.
        </p>

        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={loading}
          className="mt-6 h-14 px-8 text-base font-bold gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 hover:opacity-95 text-white border-0 shadow-lg"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating PPP slides…
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              ✨ Auto-Generate PPP Slides
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
