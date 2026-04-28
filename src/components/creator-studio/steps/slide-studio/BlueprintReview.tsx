import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, X, Sparkles, Loader2, BookOpen, GraduationCap, Target, RefreshCw, ArrowLeft, Brain } from 'lucide-react';
import type { LessonBlueprint, PedagogicalFramework } from './blueprintTypes';
import { isBlueprintReady, FRAMEWORK_DEFAULTS, FRAMEWORK_LABELS, FRAMEWORK_BLURBS } from './blueprintTypes';

interface BlueprintReviewProps {
  blueprint: LessonBlueprint;
  onChange: (next: LessonBlueprint) => void;
  onApprove: () => void | Promise<void>;
  onRegenerate: () => void | Promise<void>;
  onBack: () => void;
  approving?: boolean;
  regenerating?: boolean;
}

export const BlueprintReview: React.FC<BlueprintReviewProps> = ({
  blueprint,
  onChange,
  onApprove,
  onRegenerate,
  onBack,
  approving,
  regenerating,
}) => {
  const [newWord, setNewWord] = useState('');
  const ready = isBlueprintReady(blueprint);

  const updateVocabAt = (idx: number, patch: Partial<LessonBlueprint['target_vocabulary'][number]>) => {
    const next = blueprint.target_vocabulary.map((v, i) => (i === idx ? { ...v, ...patch } : v));
    onChange({ ...blueprint, target_vocabulary: next });
  };

  const removeVocab = (idx: number) => {
    onChange({
      ...blueprint,
      target_vocabulary: blueprint.target_vocabulary.filter((_, i) => i !== idx),
    });
  };

  const addVocab = () => {
    const word = newWord.trim();
    if (!word) return;
    if (blueprint.target_vocabulary.length >= 10) return;
    onChange({
      ...blueprint,
      target_vocabulary: [
        ...blueprint.target_vocabulary,
        { word, definition: '', example: '' },
      ],
    });
    setNewWord('');
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              <Sparkles className="h-3 w-3" /> Step 2 of 2 · Blueprint Review
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 mt-1">
              Review the lesson plan
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Edit anything below — vocabulary, grammar, reading direction, final mission.
              The AI will use this as the ground-truth blueprint for all 20 slides.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-500 shrink-0">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>

        {/* Lesson title */}
        <Card title="Lesson title" icon={<BookOpen className="h-4 w-4" />}>
          <Input
            value={blueprint.lesson_title}
            onChange={(e) => onChange({ ...blueprint, lesson_title: e.target.value })}
            placeholder="e.g. A Trip to Remember"
            className="text-base font-bold"
          />
        </Card>

        {/* Vocabulary chips */}
        <Card
          title={`Target vocabulary (${blueprint.target_vocabulary.length})`}
          icon={<Sparkles className="h-4 w-4" />}
          subtitle="3–10 words. Each will be taught in Phase 1 and reused in the reading passage."
        >
          <div className="space-y-2">
            {blueprint.target_vocabulary.map((v, i) => (
              <div
                key={i}
                className="flex items-start gap-2 p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-800/40"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    value={v.word}
                    onChange={(e) => updateVocabAt(i, { word: e.target.value })}
                    placeholder="word"
                    className="font-bold"
                  />
                  <Input
                    value={v.definition}
                    onChange={(e) => updateVocabAt(i, { definition: e.target.value })}
                    placeholder="short definition"
                    className="sm:col-span-2 text-sm"
                  />
                  <Input
                    value={v.example}
                    onChange={(e) => updateVocabAt(i, { example: e.target.value })}
                    placeholder="example sentence"
                    className="sm:col-span-3 text-sm italic"
                  />
                </div>
                <button
                  onClick={() => removeVocab(i)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  aria-label="Remove word"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add new */}
          {blueprint.target_vocabulary.length < 10 && (
            <div className="mt-3 flex gap-2">
              <Input
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addVocab();
                  }
                }}
                placeholder="Add a new word and press Enter"
              />
              <Button onClick={addVocab} variant="outline" size="default" disabled={!newWord.trim()}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
          )}
        </Card>

        {/* Grammar */}
        <Card
          title="Target grammar rule"
          icon={<GraduationCap className="h-4 w-4" />}
          subtitle="One focused structure that Phase 4 will teach explicitly."
        >
          <Input
            value={blueprint.target_grammar_rule}
            onChange={(e) => onChange({ ...blueprint, target_grammar_rule: e.target.value })}
            placeholder="e.g. Past Simple regular verbs"
            className="font-bold"
          />
          <Textarea
            value={blueprint.grammar_explanation}
            onChange={(e) => onChange({ ...blueprint, grammar_explanation: e.target.value })}
            placeholder="Brief teacher-facing rationale (when/why students use this)…"
            className="mt-2 min-h-[70px] text-sm"
          />
        </Card>

        {/* Reading direction */}
        <Card
          title="Reading passage direction"
          icon={<BookOpen className="h-4 w-4" />}
          subtitle="2–4 sentences describing the Phase-2 passage (genre, scenario, characters)."
        >
          <Textarea
            value={blueprint.reading_passage_summary}
            onChange={(e) => onChange({ ...blueprint, reading_passage_summary: e.target.value })}
            placeholder="A short email between two friends planning a weekend trip…"
            className="min-h-[90px] text-sm"
          />
        </Card>

        {/* Final mission */}
        <Card
          title="Final speaking mission"
          icon={<Target className="h-4 w-4" />}
          subtitle="The Phase-5 production task. Must require both the lexicon and the grammar rule."
        >
          <Textarea
            value={blueprint.final_speaking_mission}
            onChange={(e) => onChange({ ...blueprint, final_speaking_mission: e.target.value })}
            placeholder="Tell your partner about your last trip using at least three new words…"
            className="min-h-[80px] text-sm"
          />
        </Card>

        {/* Sticky CTA bar */}
        <div className="sticky bottom-0 -mx-6 mt-6 px-6 py-4 bg-gradient-to-t from-white via-white/95 to-white/70 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-950/70 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={onRegenerate}
            disabled={!!regenerating || !!approving}
            className="gap-1.5"
          >
            {regenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Regenerate Blueprint
          </Button>

          <div className="flex items-center gap-3">
            {!ready && (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                Need 3+ words and grammar/reading/mission filled in.
              </span>
            )}
            <Button
              size="lg"
              onClick={onApprove}
              disabled={!ready || !!approving || !!regenerating}
              className="h-12 px-6 text-base font-bold gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:opacity-95 text-white border-0 shadow-lg shadow-emerald-500/30"
            >
              {approving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Generating 20 slides…
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Approve & Generate 1-Hour Lesson
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Card: React.FC<{
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ title, subtitle, icon, children }) => (
  <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-5">
    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
      {icon} {title}
    </div>
    {subtitle && <p className="text-xs text-slate-400 mb-3">{subtitle}</p>}
    {children}
  </div>
);
