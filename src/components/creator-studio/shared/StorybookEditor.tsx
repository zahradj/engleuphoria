import { useState } from 'react';
import { Sparkles, Loader2, Plus, Trash2, ImageIcon, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { generateOnePlaygroundImage } from '@/hooks/usePlaygroundImages';
import type { StorybookSlideShape, StorybookPage, StorybookLayoutMode, StorybookTheme } from './StorybookRenderer';

type Hub = 'playground' | 'academy' | 'success';

interface Props {
  slide: StorybookSlideShape;
  hub: Hub;
  cefrLevel?: string;
  targetVocab?: string[];
  grammarFocus?: string;
  /** patches THIS storybook slide */
  onPatch: (patch: Partial<StorybookSlideShape>) => void;
  /** appends auto-generated comprehension quiz slides immediately after this storybook */
  onAppendQuiz?: (quizSlides: any[]) => void;
}

const DEFAULT_LAYOUT: Record<Hub, StorybookLayoutMode> = {
  playground: 'classic',
  academy: 'comic',
  success: 'case_study',
};

const THEME_OPTIONS: { value: StorybookTheme; label: string }[] = [
  { value: 'adventure', label: '🗺️ Adventure' },
  { value: 'school', label: '🎒 School Day' },
  { value: 'mystery', label: '🔍 Mystery' },
  { value: 'business_trip', label: '✈️ Business Trip' },
  { value: 'negotiation', label: '🤝 Negotiation' },
  { value: 'custom', label: '✨ Custom' },
];

const LAYOUT_OPTIONS: { value: StorybookLayoutMode; label: string }[] = [
  { value: 'classic', label: 'Classic (image + text)' },
  { value: 'comic', label: 'Comic (panels)' },
  { value: 'case_study', label: 'Case Study (vertical)' },
];

const HUB_TONE: Record<Hub, string> = {
  playground: 'border-orange-200 focus:border-orange-500 ring-orange-100',
  academy: 'border-indigo-200 focus:border-indigo-500 ring-indigo-100',
  success: 'border-emerald-200 focus:border-emerald-500 ring-emerald-100',
};

const HUB_BTN: Record<Hub, string> = {
  playground: 'from-fuchsia-500 to-orange-500',
  academy: 'from-indigo-600 to-purple-600',
  success: 'from-emerald-600 to-teal-600',
};

export function StorybookEditor({ slide, hub, cefrLevel, targetVocab = [], onPatch, onAppendQuiz }: Props) {
  const [busy, setBusy] = useState(false);
  const [imgBusyIdx, setImgBusyIdx] = useState<number | null>(null);
  const [audBusyIdx, setAudBusyIdx] = useState<number | null>(null);

  const pages = slide.pages || [];
  const inputCls = `w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 ${HUB_TONE[hub]}`;

  const generate = async () => {
    const topic = (slide.topic || '').trim();
    if (!topic) { toast.error('Add a story prompt first'); return; }
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-storybook', {
        body: {
          prompt: topic,
          target_vocab: targetVocab,
          cefr_level: cefrLevel || (hub === 'playground' ? 'A1' : hub === 'academy' ? 'B1' : 'B2'),
          hub_type: hub,
        },
      });
      if (error) throw error;
      const newPages: StorybookPage[] = (data?.pages || []).map((p: any, i: number) => ({
        page_number: p.page_number ?? i + 1,
        text: p.text || '',
        image_prompt: p.image_prompt || '',
        image_url: '',
        audio_url: '',
      }));
      onPatch({ title: data?.title || slide.title || topic, pages: newPages });
      if (Array.isArray(data?.quiz_slides) && data.quiz_slides.length > 0 && onAppendQuiz) {
        onAppendQuiz(data.quiz_slides);
      }
      toast.success(`Generated ${newPages.length} pages + ${data?.quiz_slides?.length ?? 0} comprehension slides ✨`);

      // background image enrichment
      newPages.forEach(async (p, i) => {
        try {
          const subj = p.image_prompt || `${topic} - page ${i + 1}`;
          const url = await generateOnePlaygroundImage(subj);
          if (url) {
            // re-read latest pages from local closure won't have update; use functional patch via onPatch
            onPatch({
              pages: (slide.pages || newPages).map((pp, idx) =>
                idx === i ? { ...pp, image_url: url } : pp,
              ).concat([]).slice(0, newPages.length).length === newPages.length
                ? newPages.map((pp, idx) => idx === i ? { ...pp, image_url: url } : pp)
                : newPages,
            });
          }
        } catch { /* silent */ }
      });
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || 'Story generation failed');
    } finally {
      setBusy(false);
    }
  };

  const updatePage = (i: number, patch: Partial<StorybookPage>) => {
    onPatch({ pages: pages.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) });
  };
  const addPage = () => {
    onPatch({
      pages: [...pages, { page_number: pages.length + 1, text: '', image_url: '', audio_url: '' }],
    });
  };
  const removePage = (i: number) => onPatch({ pages: pages.filter((_, idx) => idx !== i).map((p, idx) => ({ ...p, page_number: idx + 1 })) });

  const regenImage = async (i: number) => {
    const p = pages[i];
    const subj = p.image_prompt || p.text.slice(0, 80);
    if (!subj) { toast.error('Add page text first'); return; }
    setImgBusyIdx(i);
    try {
      const url = await generateOnePlaygroundImage(subj);
      if (!url) throw new Error('No image returned');
      updatePage(i, { image_url: url });
    } catch (e: any) {
      toast.error(e?.message || 'Image failed');
    } finally {
      setImgBusyIdx(null);
    }
  };

  const regenAudio = async (i: number) => {
    const p = pages[i];
    if (!p.text) { toast.error('Add page text first'); return; }
    setAudBusyIdx(i);
    try {
      const { data, error } = await supabase.functions.invoke('generate-slide-voiceover', {
        body: { text: p.text, hub },
      });
      if (error) throw error;
      const url = data?.audio_url || data?.url;
      if (!url) throw new Error('No audio returned');
      updatePage(i, { audio_url: url });
    } catch (e: any) {
      toast.error(e?.message || 'Audio failed');
    } finally {
      setAudBusyIdx(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200 p-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">📖 Mini Story Generator</div>
        <label className="block text-xs font-semibold text-slate-600 mb-1">Story Title</label>
        <input
          className={inputCls + ' mb-2'}
          value={slide.title || ''}
          placeholder="e.g. Lost at the Airport"
          onChange={(e) => onPatch({ title: e.target.value })}
        />
        <label className="block text-xs font-semibold text-slate-600 mb-1">Story Prompt / Topic</label>
        <textarea
          className={inputCls + ' h-20 resize-none'}
          value={slide.topic || ''}
          placeholder="Describe what the story should be about, e.g. 'A child learning to share toys at school' (3-5 pages)"
          onChange={(e) => onPatch({ topic: e.target.value })}
        />
        {targetVocab.length > 0 && (
          <div className="mt-2 text-[11px] text-slate-500">
            Target vocab to weave in: <span className="font-semibold text-slate-700">{targetVocab.slice(0, 8).join(', ')}</span>
          </div>
        )}
        <button
          disabled={busy}
          onClick={generate}
          className={`mt-3 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${HUB_BTN[hub]} text-white font-bold py-2.5 text-sm shadow disabled:opacity-50`}
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {busy ? 'Generating story…' : '✨ AI Generate Story Sequence'}
        </button>
        <p className="mt-2 text-[10px] text-slate-500 leading-snug">
          Auto-creates 3-5 illustrated pages and {hub === 'playground' ? '2' : hub === 'academy' ? '3-4' : '4-5'} comprehension quiz slides scaled to {hub.toUpperCase()}.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pages ({pages.length})</div>
          <button onClick={addPage} className="text-[11px] font-bold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add page
          </button>
        </div>
        {pages.map((p, i) => (
          <div key={i} className="rounded-lg border border-slate-200 bg-white p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Page {i + 1}</span>
              <button onClick={() => removePage(i)} className="text-red-500 hover:bg-red-50 rounded p-1">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              className={inputCls + ' h-16 resize-none'}
              value={p.text}
              placeholder="Page text…"
              onChange={(e) => updatePage(i, { text: e.target.value })}
            />
            <input
              className={inputCls + ' text-xs'}
              value={p.image_prompt || ''}
              placeholder="Image brief (optional)…"
              onChange={(e) => updatePage(i, { image_prompt: e.target.value })}
            />
            <div className="flex gap-2 items-center">
              {p.image_url ? (
                <img src={p.image_url} alt="" className="w-12 h-12 rounded object-cover border" />
              ) : (
                <div className="w-12 h-12 rounded border border-dashed flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
              )}
              <button onClick={() => regenImage(i)} disabled={imgBusyIdx === i}
                className="flex-1 text-xs font-bold rounded-md bg-slate-100 hover:bg-slate-200 px-2 py-1.5 inline-flex items-center justify-center gap-1 disabled:opacity-50">
                {imgBusyIdx === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Image
              </button>
              <button onClick={() => regenAudio(i)} disabled={audBusyIdx === i}
                className="flex-1 text-xs font-bold rounded-md bg-slate-100 hover:bg-slate-200 px-2 py-1.5 inline-flex items-center justify-center gap-1 disabled:opacity-50">
                {audBusyIdx === i ? <Loader2 className="w-3 h-3 animate-spin" /> : <Volume2 className="w-3 h-3" />} Audio
              </button>
            </div>
            {p.audio_url && <audio controls src={p.audio_url} className="w-full h-8" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StorybookEditor;
