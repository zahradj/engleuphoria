// Unified Lesson Generator — single hub-aware authoring page for all 3 creators.
// Wires the orchestrator + stabilization engine to the Content Creator surface.
// When opened from the Curriculum Blueprint, prefills + locks hub/CEFR and
// saves the resulting deck back to the exact same curriculum_lessons slot.

import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Loader2, Sparkles, ArrowLeft, Lock, Unlock, Save, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HUB_CONFIGS, getHubConfig } from '@/services/contentCreator/hubConfigurations';
import { browserGeminiAiClient } from '@/services/contentCreator/aiClient';
import {
  generateUnifiedLesson,
  saveUnifiedLessonToLibrary,
  type UnifiedLessonOutput,
} from '@/services/contentCreator/unifiedLessonGenerator';
import { PedagogicalHealthPanel } from '@/components/content-creator/PedagogicalHealthPanel';
import { CurriculumContextPanel } from '@/components/content-creator/CurriculumContextPanel';
import { useCreator } from '@/components/creator-studio/CreatorContext';
import type { Hub, Cefr } from '@/governance/types';
import {
  loadLessonBlueprintFromCurriculum,
  linkBlueprintToGenerator,
} from '@/services/contentCreator/curriculumBinding';
import { assertCurriculumSafe } from '@/services/contentCreator/curriculumSafety';
import {
  validateBlueprintIntegrity,
  type LessonBlueprint,
} from '@/services/contentCreator/lessonBlueprint';
import {
  ValidationWarningPanel,
  type ValidationIssue,
} from '@/components/content-creator/ValidationWarningPanel';

const CEFR_OPTIONS: Cefr[] = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1'];

function csv(s: string): string[] {
  return s
    .split(/[,\n]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function UnifiedLessonGeneratorPage() {
  const navigate = useNavigate();
  const { activeBlueprintContext, setActiveBlueprintContext, setCurrentStep, curriculumData } =
    useCreator();
  const fromBlueprint = !!activeBlueprintContext;

  // Resolve the canonical LessonBlueprint from curriculum (source of truth).
  const resolvedBlueprint: LessonBlueprint | null = useMemo(() => {
    if (!activeBlueprintContext || !curriculumData) return null;
    const unitIdx = curriculumData.units.findIndex(
      (u, i) => (u.unit_number ?? i + 1) === activeBlueprintContext.unit_number,
    );
    if (unitIdx < 0) return null;
    const lessonIdx = curriculumData.units[unitIdx].lessons.findIndex(
      (l, i) => (l.lesson_number ?? i + 1) === activeBlueprintContext.lesson_number,
    );
    if (lessonIdx < 0) return null;
    return loadLessonBlueprintFromCurriculum({
      curriculum: curriculumData,
      unitIdx,
      lessonIdx,
    });
  }, [activeBlueprintContext, curriculumData]);

  const [hub, setHub] = useState<Hub>((activeBlueprintContext?.hub as Hub) ?? 'academy');
  const cfg = useMemo(() => getHubConfig(hub), [hub]);

  const [cefr, setCefr] = useState<Cefr>(
    (activeBlueprintContext?.cefr_level as Cefr) ?? cfg.defaultCefr,
  );
  const [title, setTitle] = useState(activeBlueprintContext?.lesson_title ?? 'My new lesson');
  const [theme, setTheme] = useState(activeBlueprintContext?.unit_theme ?? 'everyday english');
  const [vocab, setVocab] = useState('');
  const [grammar, setGrammar] = useState(activeBlueprintContext?.skill_focus ?? 'present simple');
  const [goal, setGoal] = useState(
    activeBlueprintContext?.objective ?? 'greet someone and ask how they are',
  );
  const [review, setReview] = useState(
    (activeBlueprintContext?.previous_lesson_titles ?? []).join(', '),
  );

  // ── Mode: Curriculum (blueprint-bound) vs Manual (free authoring) ─────
  // Curriculum mode requires both an active blueprint context AND a successful
  // blueprint resolution. If either is missing, auto-fall back to manual mode
  // (the generator must NEVER fail silently when curriculum data is absent).
  const [manualOverride, setManualOverride] = useState(false);
  const mode: 'curriculum' | 'manual' =
    fromBlueprint && resolvedBlueprint && !manualOverride ? 'curriculum' : 'manual';

  // When arriving from blueprint, hub/CEFR are constrained — but unlockable.
  const [hubLocked, setHubLocked] = useState(fromBlueprint);
  const [cefrLocked, setCefrLocked] = useState(fromBlueprint);
  const lessonLocked = mode === 'curriculum'; // locks title/grammar/goal inputs

  const [busy, setBusy] = useState(false);
  const [saving, setSaving] = useState(false);
  const [output, setOutput] = useState<UnifiedLessonOutput | null>(null);
  const [savedLessonId, setSavedLessonId] = useState<string | null>(null);

  // Auto-fall-back warning when the user opened a blueprint but the lesson
  // failed to resolve (stale state, corrupted curriculum, etc.).
  useEffect(() => {
    if (fromBlueprint && !resolvedBlueprint) {
      toast.warning(
        'Could not resolve lesson blueprint from curriculum — switched to Manual Mode.',
      );
    }
  }, [fromBlueprint, resolvedBlueprint]);

  // If the user navigated here standalone (no blueprint), keep CEFR defaulting
  // to whatever hub they pick. Skip when locked from a blueprint.
  useEffect(() => {
    if (!fromBlueprint) {
      setCefr(getHubConfig(hub).defaultCefr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hub]);

  function onHubChange(next: Hub) {
    if (hubLocked) return;
    setHub(next);
    setOutput(null);
    setSavedLessonId(null);
  }

  // ── Pre-flight validation ───────────────────────────────────────────────
  const validationIssues: ValidationIssue[] = useMemo(() => {
    const issues: ValidationIssue[] = [];
    if (mode === 'curriculum' && resolvedBlueprint) {
      // Probe the blueprint as it WILL be sent (with user-editable overrides).
      const probe: LessonBlueprint = {
        ...resolvedBlueprint,
        hub,
        cefr_level: cefr,
        lesson_title: title,
        communication_goal: goal,
        grammar_focus: csv(grammar),
        vocabulary_focus: csv(vocab),
        review_targets: csv(review),
        story_state: { ...resolvedBlueprint.story_state, theme },
      };
      const report = validateBlueprintIntegrity(probe);
      report.issues.forEach((i) =>
        issues.push({ code: i.code, severity: i.severity, message: i.message }),
      );
    } else {
      // Manual mode — lightweight required-field check.
      if (!title.trim())
        issues.push({ code: 'missing_title', severity: 'block', message: 'Lesson title is required.' });
      if (!cefr)
        issues.push({ code: 'missing_cefr', severity: 'block', message: 'CEFR level is required.' });
      if (!goal.trim())
        issues.push({
          code: 'missing_goal',
          severity: 'block',
          message: 'Communication goal is required.',
        });
      if (!csv(grammar).length && !csv(vocab).length)
        issues.push({
          code: 'missing_scope',
          severity: 'warn',
          message: 'No grammar or vocabulary scope — lesson may drift off-target.',
        });
    }
    return issues;
  }, [mode, resolvedBlueprint, hub, cefr, title, goal, grammar, vocab, review, theme]);

  const hasBlocker = validationIssues.some((i) => i.severity === 'block');


  async function handleGenerate() {
    setBusy(true);
    setOutput(null);
    setSavedLessonId(null);
    try {
      // Curriculum-bound path: derive input from the blueprint + safety gate.
      if (fromBlueprint && resolvedBlueprint && !hubLocked === false && !cefrLocked === false) {
        // ^ no-op guard; we always run safety when fromBlueprint, regardless of unlocks.
      }
      if (fromBlueprint && resolvedBlueprint) {
        const safety = await assertCurriculumSafe({
          ...resolvedBlueprint,
          // Apply user-editable overrides into the safety probe so duplication
          // checks reflect what the user is about to generate.
          lesson_title: title,
          communication_goal: goal,
          grammar_focus: csv(grammar),
          vocabulary_focus: csv(vocab),
          review_targets: csv(review),
          story_state: { ...resolvedBlueprint.story_state, theme },
          hub,
          cefr_level: cefr,
        });
        if (!safety.ok) {
          const blocks = safety.issues.filter((i) => i.severity === 'block');
          toast.error(
            `Curriculum safety blocked generation: ${blocks.map((b) => b.message).join(' · ')}`,
          );
          return;
        }
        safety.issues
          .filter((i) => i.severity === 'warn')
          .forEach((w) => toast.warning(w.message));

        const input = linkBlueprintToGenerator(
          {
            ...resolvedBlueprint,
            hub,
            cefr_level: cefr,
            lesson_title: title,
          },
          browserGeminiAiClient,
          {
            title,
            theme,
            grammarFocus: csv(grammar),
            targetVocab: csv(vocab),
            communicationGoal: goal,
            reviewTargets: csv(review),
          },
        );
        input.stage = activeBlueprintContext?.stage ?? 'all';
        const result = await generateUnifiedLesson(input);
        setOutput(result);
        const v = result.validation_report.verdict;
        if (v === 'publish') toast.success('Lesson generated and validated.');
        else if (v === 'repair') toast.warning('Lesson generated with repair flags. Review before publishing.');
        else toast.error('Lesson blocked by validation. See report below.');
        return;
      }

      // Standalone path (no blueprint context).
      const result = await generateUnifiedLesson({
        hub,
        cefr,
        unitId: `unit_${Date.now()}`,
        lessonId: `lesson_${Date.now()}`,
        ai: browserGeminiAiClient,
        blueprint: {
          title,
          theme,
          grammarFocus: csv(grammar),
          targetVocab: csv(vocab),
          communicationGoal: goal,
          reviewTargets: csv(review),
        },
      });
      setOutput(result);
      const v = result.validation_report.verdict;
      if (v === 'publish') toast.success('Lesson generated and validated.');
      else if (v === 'repair') toast.warning('Lesson generated with repair flags.');
      else toast.error('Lesson blocked by validation.');
    } catch (e: any) {
      toast.error(`Generation failed: ${e?.message ?? e}`);
    } finally {
      setBusy(false);
    }
  }

  // Auto-run when navigated from a curriculum action that requested it.
  const autoRanRef = useRef(false);
  useEffect(() => {
    if (autoRanRef.current) return;
    if (fromBlueprint && activeBlueprintContext?.autoRun && resolvedBlueprint && !busy && !output) {
      autoRanRef.current = true;
      void handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromBlueprint, resolvedBlueprint, activeBlueprintContext?.autoRun]);

  async function handleSaveToLibrary() {
    if (!output || !activeBlueprintContext) return;
    setSaving(true);
    try {
      const res = await saveUnifiedLessonToLibrary({
        output,
        unitNumber: activeBlueprintContext.unit_number,
        lessonNumber: activeBlueprintContext.lesson_number,
        unitTitle: activeBlueprintContext.unit_title,
        curriculumTitle: activeBlueprintContext.curriculum_title,
      });
      if (res.ok) {
        setSavedLessonId(res.lessonId ?? null);
        window.dispatchEvent(new CustomEvent('unified-lesson-saved', { detail: { lessonId: res.lessonId } }));
        toast.success(
          output.validation_report.verdict === 'publish'
            ? '✅ Saved & published to your library.'
            : '✅ Saved as draft (review repair flags before publishing).',
        );
      } else {
        toast.error(res.error ?? 'Save failed.');
      }
    } finally {
      setSaving(false);
    }
  }

  function backToBlueprint() {
    setActiveBlueprintContext(null);
    setCurrentStep('blueprint');
    navigate('/content-creator/blueprint');
  }

  return (
    <div className="mx-auto w-full max-w-6xl p-4 md:p-6">
      <div className="mb-4 flex items-center gap-2 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          onClick={fromBlueprint ? backToBlueprint : () => navigate('/content-creator')}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          {fromBlueprint ? 'Back to blueprint' : 'Back'}
        </Button>
        <h1 className="text-2xl font-semibold">Unified Lesson Generator</h1>
        <Badge variant="outline" className="ml-auto">
          orchestrator + stabilization
        </Badge>
      </div>

      {!fromBlueprint && (
        <Card className="mb-4 border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/20">
          <CardContent className="py-3 text-sm flex items-center justify-between gap-3 flex-wrap">
            <span className="text-amber-900 dark:text-amber-200">
              ⚠ No curriculum blueprint loaded. The Unified Generator is curriculum-driven —
              open a lesson from the blueprint for full pedagogical integrity.
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setCurrentStep('blueprint');
                navigate('/content-creator/blueprint');
              }}
            >
              Open Curriculum Blueprint →
            </Button>
          </CardContent>
        </Card>
      )}

      {fromBlueprint && resolvedBlueprint && (
        <div className="mb-4">
          <CurriculumContextPanel blueprint={resolvedBlueprint} />
        </div>
      )}

      {fromBlueprint && (
        <Card className="mb-4 border-sky-200 bg-sky-50/60 dark:border-sky-900/50 dark:bg-sky-950/30">
          <CardContent className="flex items-center gap-3 py-3 text-sm flex-wrap">
            <BookOpen className="h-4 w-4 text-sky-600 shrink-0" />
            <span className="text-sky-900 dark:text-sky-200">
              From blueprint · <strong>{activeBlueprintContext!.curriculum_title}</strong> · Unit{' '}
              {activeBlueprintContext!.unit_number} ({activeBlueprintContext!.unit_title}) ·
              Lesson {activeBlueprintContext!.lesson_number}
              {activeBlueprintContext!.stage && activeBlueprintContext!.stage !== 'all' && (
                <Badge variant="secondary" className="ml-2 text-[10px]">
                  stage: {activeBlueprintContext!.stage}
                </Badge>
              )}
            </span>
          </CardContent>
        </Card>
      )}

      <Tabs value={hub} onValueChange={(v) => onHubChange(v as Hub)} className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          {(['playground', 'academy', 'success'] as Hub[]).map((h) => (
            <TabsTrigger key={h} value={h} disabled={hubLocked && h !== hub}>
              {HUB_CONFIGS[h].label}
            </TabsTrigger>
          ))}
        </TabsList>
        {(['playground', 'academy', 'success'] as Hub[]).map((h) => (
          <TabsContent key={h} value={h}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">{HUB_CONFIGS[h].label} — configuration</CardTitle>
                {fromBlueprint && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setHubLocked((v) => !v)}
                    className="h-7"
                  >
                    {hubLocked ? <Lock className="h-3.5 w-3.5 mr-1" /> : <Unlock className="h-3.5 w-3.5 mr-1" />}
                    {hubLocked ? 'Locked' : 'Unlocked'}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                <Badge variant="secondary">tone: {HUB_CONFIGS[h].tone}</Badge>
                <Badge variant="secondary">load: {HUB_CONFIGS[h].cognitiveLoad}</Badge>
                <Badge variant="secondary">sentence: {HUB_CONFIGS[h].sentenceLength}</Badge>
                <Badge variant="secondary">grammar: {HUB_CONFIGS[h].grammar}</Badge>
                <Badge variant="secondary">phonics: {HUB_CONFIGS[h].phonicsPriority}</Badge>
                <Badge variant="secondary">visuals: {HUB_CONFIGS[h].visualDependency}</Badge>
                <Badge variant="secondary">slides: {HUB_CONFIGS[h].slideAesthetic}</Badge>
                <Badge variant="secondary">produce: {HUB_CONFIGS[h].productionStyle}</Badge>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-base">Lesson blueprint</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="cefr" className="flex items-center gap-2">
              CEFR
              {fromBlueprint && (
                <button
                  type="button"
                  onClick={() => setCefrLocked((v) => !v)}
                  className="text-[10px] text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
                >
                  {cefrLocked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                  {cefrLocked ? 'locked' : 'unlocked'}
                </button>
              )}
            </Label>
            <Select value={cefr} onValueChange={(v) => setCefr(v as Cefr)} disabled={cefrLocked}>
              <SelectTrigger id="cefr"><SelectValue /></SelectTrigger>
              <SelectContent>
                {CEFR_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="theme">Theme</Label>
            <Input id="theme" value={theme} onChange={(e) => setTheme(e.target.value)} />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="vocab">Target vocab (comma-separated)</Label>
            <Textarea
              id="vocab"
              rows={2}
              value={vocab}
              onChange={(e) => setVocab(e.target.value)}
              placeholder="hello, goodbye, please, thank you"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="grammar" className="flex items-center gap-1">
              Grammar focus {lessonLocked && <Lock className="h-3 w-3 text-slate-400" />}
            </Label>
            <Input id="grammar" value={grammar} onChange={(e) => setGrammar(e.target.value)} disabled={lessonLocked} title={lessonLocked ? 'Locked by curriculum' : undefined} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="review">Review targets</Label>
            <Input
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="(prev lesson titles)"
            />
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="goal" className="flex items-center gap-1">
              Communication goal {lessonLocked && <Lock className="h-3 w-3 text-slate-400" />}
            </Label>
            <Input id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} disabled={lessonLocked} title={lessonLocked ? 'Locked by curriculum' : undefined} />
          </div>
          <div className="md:col-span-2">
            <Button onClick={handleGenerate} disabled={busy} className="w-full">
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate {cfg.label.split(' (')[0]} lesson
            </Button>
          </div>
        </CardContent>
      </Card>

      {output ? (
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Result</CardTitle>
              <Badge variant={output.validation_report.passed ? 'default' : 'destructive'}>
                {output.validation_report.verdict.toUpperCase()}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <strong>{output.slides.length}</strong> slides compiled · state hash{' '}
                <code className="text-xs">{output.lesson_metadata.state_hash}</code>
              </p>

              {fromBlueprint && output.validation_report.verdict !== 'block' && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={handleSaveToLibrary}
                    disabled={saving || !!savedLessonId}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {savedLessonId
                      ? '✅ Saved to library'
                      : output.validation_report.verdict === 'publish'
                      ? 'Save & publish to library'
                      : 'Save as draft to library'}
                  </Button>
                  {savedLessonId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setCurrentStep('library');
                        navigate('/content-creator/library');
                      }}
                    >
                      Open library →
                    </Button>
                  )}
                </div>
              )}

              <details>
                <summary className="cursor-pointer text-sm font-medium">Slide list</summary>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs">
                  {output.slides.map((s) => (
                    <li key={s.id}>
                      <span className="font-mono">{s.type}</span>
                      {s.interaction_type ? ` · ${s.interaction_type}` : ''}
                    </li>
                  ))}
                </ol>
              </details>
              <details>
                <summary className="cursor-pointer text-sm font-medium">Raw lesson object</summary>
                <pre className="mt-2 max-h-96 overflow-auto rounded bg-muted p-2 text-xs">
                  {JSON.stringify(output, null, 2)}
                </pre>
              </details>
            </CardContent>
          </Card>

          <PedagogicalHealthPanel lessonId={output.lesson_metadata.lesson_id} />
        </div>
      ) : null}
    </div>
  );
}
