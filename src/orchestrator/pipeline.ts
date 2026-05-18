// Master Curriculum Orchestration Engine — pipeline.
// Single entry point for end-to-end lesson generation.

import { generateLessonPlan } from '@/planning/lessonPlanner';
import { runAdaptation } from '@/adaptive';
import { runPronunciation } from '@/pronunciation/pronunciationRunner';
import { runGamification } from '@/gamification/orchestrator';
import { classifyMotivation } from '@/gamification/motivation/motivationProfiler';
import { buildLearnerProfile } from '@/adaptive/profile/profileBuilder';
import { generateActivities } from '@/activities/generation/activityGenerator';
import { runQualityControl } from '@/qa';
import type { QALesson } from '@/qa/types';

import { runStage } from './stageRunner';
import { composePromptChain } from './promptChain';
import {
  ORCHESTRATOR_VERSION,
  type LessonContext,
  type OrchestrationInput,
  type OrchestrationResult,
  type StageReport,
} from './types';

function stateHash(s: unknown): string {
  const str = JSON.stringify(s);
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return `ctx_${(h >>> 0).toString(16)}`;
}

/** Adapter: planning/governance use lowercase hub; adaptive/qa use Capitalized. */
function capitalizeHub(h: 'playground' | 'academy' | 'success') {
  return (h.charAt(0).toUpperCase() + h.slice(1)) as 'Playground' | 'Academy' | 'Success';
}

/**
 * runLessonGeneration — THE single pipeline for lesson generation.
 *
 *   1. Curriculum selection (caller supplies unit + lesson)
 *   2. Blueprint creation
 *   3. LessonState (governance contract)
 *   4. Pedagogical flow planning (+ hard-gate validation)
 *   5. Adaptive personalization
 *   6. Pronunciation injection
 *   7. Gamification layering
 *   8. Activity generation (with composed prompt chain)
 *   9. Quality validation
 *  10. Publish gate
 *
 * No engine outside this pipeline is allowed to be called directly during
 * lesson generation. See mem://index.md > Orchestration.
 */
export async function runLessonGeneration(
  input: OrchestrationInput,
): Promise<OrchestrationResult> {
  const reports: StageReport[] = [];
  const collect = <T,>(r: { value: T; report: StageReport }) => {
    reports.push(r.report);
    return r.value;
  };

  // 1 + 2 — Curriculum + Blueprint
  // We assume the caller resolved the unit/lesson identity; we pass overrides into planner.
  const overrides = input.blueprintOverrides ?? {};
  const blueprintInput = {
    hub: input.hub,
    cefr_level: input.cefr,
    lesson_title: overrides.lesson_title ?? `Lesson ${input.lessonId}`,
    theme: overrides.theme ?? 'everyday english',
    grammar_focus: overrides.grammar_focus ?? [],
    target_vocab: overrides.target_vocab ?? [],
    communication_goal:
      overrides.communication_goal ?? 'communicate clearly in a short real-world exchange',
    review_targets: overrides.review_targets ?? [],
  };

  // 3 + 4 — LessonState + Plan (hard gate)
  const planResult = collect(
    await runStage('flow_planning', () => generateLessonPlan(blueprintInput), {
      warnIf: (r) => r.validation.warnings.map((w) => `${w.code}: ${w.message}`),
    }),
  );
  if (!planResult.validation.passed) {
    throw new Error(
      `Pipeline aborted at flow_planning: ${planResult.validation.errors
        .map((e) => e.code)
        .join(', ')}`,
    );
  }
  const plan = planResult.plan;
  const lessonState = plan.lesson_state;

  // 5 — Adaptive personalization
  const adaptiveResult = collect(
    await runStage('adaptive_personalization', () => {
      const profile =
        input.learnerProfile ??
        buildLearnerProfile({
          student_id: input.studentId ?? 'anonymous',
          hub: capitalizeHub(input.hub),
          cefr_level: input.cefr,
        });
      return runAdaptation({
        profile,
        mastery: input.mastery ?? [],
        errors: input.errors ?? [],
        engagement:
          input.engagement ?? {
            confidence: 60,
            motivation: 70,
            frustration_risk: 20,
            speaking_turn_ratio: 0.5,
            completion_rate: 0.7,
            hesitation_latency_ms: 800,
          },
      });
    }),
  );

  // 6 — Pronunciation injection
  const pronunciation = collect(
    await runStage('pronunciation_injection', () =>
      runPronunciation({ plan, lessonKind: 'normal' }),
    ),
  );

  // 7 — Gamification layering
  const gamification = collect(
    await runStage('gamification_layering', () => {
      const motivationProfile =
        input.motivationProfile ??
        classifyMotivation({
          studentId: input.studentId ?? 'anonymous',
          hub: input.hub,
          signals: {},
        });
      return runGamification({
        studentId: input.studentId ?? 'anonymous',
        hub: input.hub,
        plan: {
          objective: plan.communication.goal,
          targetVocab: plan.blueprint.target_vocab,
          grammarFocus: plan.blueprint.grammar_focus,
        },
        motivationProfile,
        adaptiveContext: {
          masteryRising: adaptiveResult.context.engagement.confidence > 65,
          difficultyTier: adaptiveResult.context.difficulty.challenge_tier,
        },
      });
    }),
  );

  // Compose unified prompt chain
  const partialCtx: Omit<LessonContext, 'meta' | 'activities' | 'qa'> = {
    hub: input.hub,
    cefr: input.cefr,
    lessonState,
    plan,
    adaptive: adaptiveResult.context,
    pronunciation,
    gamification,
  };
  const { systemPrompt: chainPrompt, hash: promptChainHash } = composePromptChain(partialCtx);

  // 8 — Activity generation
  // We wrap the caller's AI client so every call carries the full prompt chain.
  const wrappedAi = async (args: { systemPrompt: string; userPrompt: string }) =>
    input.ai({
      systemPrompt: `${chainPrompt}\n\n${args.systemPrompt}`,
      userPrompt: args.userPrompt,
    });

  const activityResult = collect(
    await runStage('activity_generation', () => generateActivities({ plan, ai: wrappedAi })),
  );

  // 9 — Quality validation
  const qaLesson: QALesson = {
    id: input.lessonId,
    hub: capitalizeHub(input.hub),
    cefr: input.cefr,
    unit_id: input.unitId,
    title: plan.blueprint.lesson_title,
    communication_objective: plan.communication.goal,
    slides: activityResult.activities.map((a, i) => ({
      id: `slide_${i + 1}`,
      kind: a.purpose,
      title: `${a.type} — ${a.stage}`,
      activities: [
        {
          id: a.id,
          type: a.type,
          purpose: a.purpose,
          stage: a.stage,
          modalities: a.modalities,
          target_vocab_used: a.target_vocab_used,
          grammar_targets_used: a.grammar_targets_used,
          narrative_anchor: a.narrative_anchor,
          content: a.content,
        },
      ],
    })),
  };

  const qaOutcome = collect(
    await runStage('quality_validation', () => runQualityControl({ lesson: qaLesson })),
  );

  // 10 — Publish gate
  const verdict = qaOutcome.decision.verdict;
  reports.push({
    stage: 'publish_gate',
    status: verdict === 'publish' ? 'ok' : verdict === 'repair' ? 'warning' : 'error',
    durationMs: 0,
    notes: [`verdict=${verdict}`],
  });

  const context: LessonContext = {
    ...partialCtx,
    activities: activityResult.activities,
    qa: qaOutcome.report,
    meta: {
      stateHash: stateHash({ plan, lessonState, adaptive: adaptiveResult.context }),
      generatedAt: new Date().toISOString(),
      orchestratorVersion: ORCHESTRATOR_VERSION,
      promptChainHash,
    },
  };

  return {
    context,
    stageReports: reports,
    verdict,
    passed: verdict === 'publish',
    conflicts: [],
  };
}
