import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export type Hub = 'playground' | 'academy' | 'success';

export interface GenerateLessonPayload {
  topic: string;
  level: string;
  vocabulary: string[]; // length 5 (or 3-4 for Pre-A1)
  grammar: string;
  target_phonics: string;
  interests: string;
  specific_needs: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  hub: Hub;
  defaultTopic: string;
  defaultLevel: string;
  defaultVocabulary?: string[];
  defaultGrammar?: string;
  defaultPhonics?: string;
  defaultInterests?: string;
  defaultNeeds?: string;
  busy: boolean;
  onGenerate: (payload: GenerateLessonPayload) => Promise<void> | void;
}

const THEME: Record<Hub, {
  border: string; headerGrad: string; footerBg: string; footerBorder: string;
  primaryBtn: string; chipBg: string; chipText: string; levels: string[]; title: string; subtitle: string;
}> = {
  playground: {
    border: 'border-4 border-orange-300',
    headerGrad: 'from-fuchsia-500 to-orange-500',
    footerBg: 'bg-orange-50',
    footerBorder: 'border-orange-200',
    primaryBtn: 'bg-gradient-to-r from-fuchsia-500 to-orange-500',
    chipBg: 'bg-orange-50',
    chipText: 'text-orange-700',
    levels: ['Pre-A1', 'A1', 'A2', 'B1', 'B2'],
    title: 'Generate Playground Lesson',
    subtitle: 'AI will craft a kid-friendly interactive deck.',
  },
  academy: {
    border: 'border border-indigo-200',
    headerGrad: 'from-indigo-500 to-purple-600',
    footerBg: 'bg-slate-50',
    footerBorder: 'border-slate-200',
    primaryBtn: 'bg-indigo-600 hover:bg-indigo-500',
    chipBg: 'bg-indigo-50',
    chipText: 'text-indigo-700',
    levels: ['A1', 'A2', 'B1', 'B2'],
    title: 'Generate Academy Lesson',
    subtitle: 'A 60-min, 7-block TEFL deck for teens.',
  },
  success: {
    border: 'border border-emerald-200',
    headerGrad: 'from-emerald-500 to-teal-600',
    footerBg: 'bg-slate-50',
    footerBorder: 'border-slate-200',
    primaryBtn: 'bg-emerald-600 hover:bg-emerald-500',
    chipBg: 'bg-emerald-50',
    chipText: 'text-emerald-700',
    levels: ['A2', 'B1', 'B2', 'C1'],
    title: 'Generate Success Lesson',
    subtitle: 'A 60-min, 7-block Business English deck for adults.',
  },
};

const inputCls =
  'mt-1 w-full px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-slate-400 outline-none text-sm';
const smallInputCls =
  'w-full px-2 py-2 rounded-lg border-2 border-slate-200 focus:border-slate-400 outline-none text-sm';
const labelCls = 'text-xs font-bold text-slate-600 uppercase tracking-wider';

function ensureFive(arr?: string[]): string[] {
  const base = Array.isArray(arr) ? [...arr] : [];
  while (base.length < 5) base.push('');
  return base.slice(0, 5);
}

export default function GenerateLessonModal({
  open,
  onClose,
  hub,
  defaultTopic,
  defaultLevel,
  defaultVocabulary,
  defaultGrammar,
  defaultPhonics,
  defaultInterests,
  defaultNeeds,
  busy,
  onGenerate,
}: Props) {
  const theme = THEME[hub];

  const [topic, setTopic] = useState(defaultTopic);
  const [level, setLevel] = useState(defaultLevel);
  const [vocab, setVocab] = useState<string[]>(ensureFive(defaultVocabulary));
  const [grammar, setGrammar] = useState(defaultGrammar || '');
  const [phonics, setPhonics] = useState(defaultPhonics || '');
  const [interests, setInterests] = useState(defaultInterests || '');
  const [needs, setNeeds] = useState(defaultNeeds || '');
  const [expanded, setExpanded] = useState(false);
  const [autoFillBusy, setAutoFillBusy] = useState(false);

  const isPreA1 = level === 'Pre-A1';

  // Re-sync defaults whenever modal opens
  useEffect(() => {
    if (!open) return;
    setTopic(defaultTopic);
    setLevel(defaultLevel);
    setVocab(ensureFive(defaultVocabulary));
    setGrammar(defaultGrammar || '');
    setPhonics(defaultPhonics || '');
    setInterests(defaultInterests || '');
    setNeeds(defaultNeeds || '');
    setExpanded(Boolean(
      (defaultVocabulary && defaultVocabulary.some((v) => v?.trim())) ||
      defaultGrammar?.trim() ||
      defaultPhonics?.trim() ||
      defaultInterests?.trim() ||
      defaultNeeds?.trim(),
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Pre-A1 only needs 3 vocab + phonics; grammar may be empty.
  const filledVocabCount = vocab.filter((v) => v.trim().length > 0).length;
  const canGenerate = isPreA1
    ? Boolean(topic.trim() && phonics.trim() && filledVocabCount >= 3 && !busy)
    : Boolean(topic.trim() && grammar.trim() && filledVocabCount === 5 && !busy);

  // CEFR-tiered phonics tier hint, mirrors plan-lesson-blueprint.
  const phonicsTier: 'A' | 'B' | 'C' =
    ['Pre-A1', 'A1'].includes(level) ? 'A' :
    ['A2', 'B1'].includes(level) ? 'B' : 'C';
  const phonicsTierHint =
    phonicsTier === 'A'
      ? `PHONICS RULE (Tier A — Pre-A1/A1): pick a single-phoneme focus, CVC blend, or simple digraph (sh, ch, th). e.g. "Short A: /æ/", "Digraph /ʃ/".`
      : phonicsTier === 'B'
      ? `PHONICS RULE (Tier B — A2/B1): pick a minimal pair, tricky consonant cluster, or silent letter. e.g. "Minimal pair /ɪ/ vs /iː/ (ship/sheep)", "Silent K (knee)".`
      : `PHONICS RULE (Tier C — B2/C1+): pick a suprasegmental — word stress, intonation, linking, elision, or weak forms. e.g. "Noun↔verb stress (RE-cord vs re-CORD)", "Elision in connected speech".`;

  const handleAutoFill = async () => {
    if (!topic.trim() || autoFillBusy) return;
    setAutoFillBusy(true);
    try {
      const system = isPreA1
        ? `You are an expert Early-Years Phonics Designer. Audience: 4-5 year-old true beginners and pre-readers. ` +
          `DO NOT propose grammar rules or full sentences. Pick EXACTLY 3 phonetically decodable CVC words ` +
          `(or ultra-basic single-syllable nouns) tied to ONE phonics focus. ${phonicsTierHint} ` +
          `target_phonics is REQUIRED — never empty.`
        : `You are an expert ESL Curriculum Designer. Hub: ${hub}. ` +
          `Pick exactly 5 target vocabulary items, 1 grammar focus, 1 phonics focus, ` +
          `2-3 likely student interests for this topic, and 1 short specific-needs hint ` +
          `that suit the topic and CEFR level. Keep vocab short (1-3 words each), age-appropriate, and high-frequency. ` +
          `${phonicsTierHint} target_phonics is REQUIRED — never empty.`;
      const prompt = isPreA1
        ? `TOPIC: ${topic.trim()}\nCEFR LEVEL: Pre-A1 (ages 4-5)\n\n` +
          `Return ONLY JSON in this exact shape (grammar MUST be empty string, target_phonics MUST be non-empty):\n` +
          `{ "vocabulary": ["w1","w2","w3"], "grammar": "", "target_phonics": "string", "interests": "string", "specific_needs": "string" }`
        : `TOPIC: ${topic.trim()}\nCEFR LEVEL: ${level}\n\n` +
          `Return ONLY JSON in this exact shape (target_phonics MUST be non-empty and follow the tier rule above):\n` +
          `{ "vocabulary": ["w1","w2","w3","w4","w5"], "grammar": "string", "target_phonics": "string", "interests": "string", "specific_needs": "string" }`;
      const { data, error } = await supabase.functions.invoke('generate-gemini', {
        body: { prompt, system, responseMimeType: 'application/json', temperature: 0.7 },
      });
      if (error) throw error;
      const parsed = (data?.json ?? data) as any;
      if (isPreA1) {
        const list = Array.isArray(parsed?.vocabulary) ? parsed.vocabulary.slice(0, 4) : [];
        const padded = ensureFive(list); // we still keep 5 slots; teacher can leave extras blank
        setVocab(padded);
        setGrammar('');
      } else {
        setVocab(ensureFive(parsed?.vocabulary));
        setGrammar(String(parsed?.grammar || '').trim());
      }
      setPhonics(String(parsed?.target_phonics || '').trim());
      // Don't overwrite if teacher already typed something
      if (!interests.trim()) setInterests(String(parsed?.interests || '').trim());
      if (!needs.trim()) setNeeds(String(parsed?.specific_needs || '').trim());
      setExpanded(true);
      toast.success('Blueprint suggested — review and edit before generating.');
    } catch (e: any) {
      console.error('Auto-fill failed', e);
      const msg = e?.message || 'Auto-fill failed';
      toast.error(msg);
    } finally {
      setAutoFillBusy(false);
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    await onGenerate({
      topic: topic.trim(),
      level,
      vocabulary: vocab.map((v) => v.trim()).filter((v) => v.length > 0),
      grammar: grammar.trim(),
      target_phonics: phonics.trim(),
      interests: interests.trim(),
      specific_needs: needs.trim(),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center p-4"
        >
          <div className={`bg-white rounded-3xl w-full max-w-lg shadow-2xl ${theme.border} overflow-hidden`}>
            <div className={`bg-gradient-to-r ${theme.headerGrad} p-5 text-white`}>
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-xl font-extrabold">{theme.title}</h3>
              </div>
              <p className="text-sm opacity-90 mt-1">{theme.subtitle}</p>
            </div>

            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Topic + Auto-Fill */}
              <div>
                <span className={labelCls}>Topic</span>
                <div className="mt-1 flex flex-col sm:flex-row gap-2">
                  <input
                    autoFocus
                    className={`${inputCls} mt-0 flex-1`}
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Animals, Colors, Greetings"
                    disabled={busy || autoFillBusy}
                  />
                  <button
                    type="button"
                    onClick={handleAutoFill}
                    disabled={!topic.trim() || autoFillBusy || busy}
                    className={`inline-flex items-center justify-center gap-2 px-3 py-2 rounded-xl border-2 border-slate-200 text-sm font-bold ${theme.chipText} hover:bg-slate-50 disabled:opacity-50 whitespace-nowrap`}
                    title="Let AI suggest vocab, grammar and phonics"
                  >
                    {autoFillBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    Auto-Fill
                  </button>
                </div>
              </div>

              {/* CEFR */}
              <label className="block">
                <span className={labelCls}>CEFR Level</span>
                <select
                  className={inputCls}
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  disabled={busy}
                >
                  {theme.levels.map((l) => (
                    <option key={l} value={l}>
                      {l === 'Pre-A1' ? 'Pre-A1 — Ages 4-5 (Phonics)' : l}
                    </option>
                  ))}
                </select>
              </label>

              {/* Blueprint Details (collapsible) */}
              <div className="rounded-2xl border-2 border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded((x) => !x)}
                  className={`w-full flex items-center justify-between px-4 py-3 ${theme.chipBg} ${theme.chipText} font-bold text-sm`}
                >
                  <span>Blueprint Details {canGenerate ? '✓' : '(auto-filled by AI)'}</span>
                  {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expanded && (
                  <div className="p-4 space-y-4 bg-white">
                    <div>
                      <span className={labelCls}>
                        {isPreA1 ? 'Target Vocabulary (3-4 CVC words)' : 'Target Vocabulary (5 words)'}
                      </span>
                      <div className="mt-1 grid grid-cols-2 sm:grid-cols-5 gap-2">
                        {vocab.map((w, i) => (
                          <input
                            key={i}
                            className={smallInputCls}
                            value={w}
                            onChange={(e) => {
                              const next = [...vocab];
                              next[i] = e.target.value;
                              setVocab(next);
                            }}
                            placeholder={isPreA1 && i >= 4 ? '(optional)' : `Word ${i + 1}`}
                            disabled={busy}
                          />
                        ))}
                      </div>
                    </div>
                    {!isPreA1 && (
                      <label className="block">
                        <span className={labelCls}>Grammar Focus</span>
                        <input
                          className={inputCls}
                          value={grammar}
                          onChange={(e) => setGrammar(e.target.value)}
                          placeholder="e.g. Present simple"
                          disabled={busy}
                        />
                      </label>
                    )}
                    <label className="block">
                      <span className={labelCls}>
                        {hub === 'success'
                          ? '🎙 Pronunciation / Intonation Focus'
                          : hub === 'academy'
                          ? '🔊 Pronunciation Focus'
                          : '🔊 Target Phonics / Sound'}
                      </span>
                      <input
                        className={inputCls}
                        value={phonics}
                        onChange={(e) => setPhonics(e.target.value)}
                        placeholder={isPreA1 ? 'e.g. Short A: /æ/, Consonant M: /m/' : 'e.g. Short /a/, Word stress'}
                        disabled={busy}
                      />
                    </label>
                    <label className="block">
                      <span className={labelCls}>🎯 Student Interests (creative anchor)</span>
                      <input
                        className={inputCls}
                        value={interests}
                        onChange={(e) => setInterests(e.target.value)}
                        placeholder="e.g. football, Pokemon, dinosaurs"
                        disabled={busy}
                      />
                    </label>
                    <label className="block">
                      <span className={labelCls}>🛠 Specific Needs / Goals</span>
                      <input
                        className={inputCls}
                        value={needs}
                        onChange={(e) => setNeeds(e.target.value)}
                        placeholder="e.g. shy speaker, exam prep, dyslexic"
                        disabled={busy}
                      />
                    </label>
                  </div>
                )}
              </div>

              {!canGenerate && !busy && (
                <p className="text-xs text-slate-500">
                  Click <strong>Auto-Fill</strong> or fill in {isPreA1 ? '3 CVC words plus a phonics focus' : 'all 5 vocabulary words and a grammar focus'} to generate slides.
                </p>
              )}
            </div>

            <div className={`p-4 ${theme.footerBg} border-t ${theme.footerBorder} flex justify-end gap-2`}>
              <button
                disabled={busy}
                onClick={onClose}
                className="px-4 py-2 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={!canGenerate}
                onClick={handleGenerate}
                className={`px-5 py-2 rounded-xl ${theme.primaryBtn} text-white font-bold shadow-md disabled:opacity-50 inline-flex items-center gap-2`}
              >
                {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</> : <><Sparkles className="w-4 h-4" /> Generate Slides</>}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
