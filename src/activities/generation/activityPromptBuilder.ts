// Per-activity-type prompt builder. The full prompt chain is composed in activityGenerator.

import type { ActivityPurpose, ActivityType, GenerationContext } from '../types';
import type { SelectedSlot } from '../selection/activitySelector';

const SCHEMA_HINTS: Record<ActivityType, string> = {
  warmup: '{ "type": "warmup", "title": string, "prompt": string, "voice"?: { "text": string } }',
  poll: '{ "type": "poll", "question": string, "options": string[] (2-4) }',
  opinion: '{ "type": "opinion", "prompt": string, "scaffolds"?: string[] }',
  matching: '{ "type": "matching", "instruction": string, "pairs": [{ "left": string, "right": string }] }',
  drag_drop: '{ "type": "drag_drop", "instruction": string, "categories": [{ "label": string, "items": string[] }] }',
  fill_blank: '{ "type": "fill_blank", "sentences": [{ "text": string (with ___), "answers": string[] }] }',
  sentence_builder: '{ "type": "sentence_builder", "items": [{ "tokens": string[], "answer": string }] }',
  pronunciation: '{ "type": "pronunciation", "items": [{ "text": string, "ipa"?: string, "tip"?: string }] }',
  reading: '{ "type": "reading", "passage": string, "questions": [{ "q": string, "options": string[], "answer": string }] }',
  listening: '{ "type": "listening", "transcript": string, "audio_prompt": string, "questions": [{ "q": string, "options": string[], "answer": string }] }',
  roleplay: '{ "type": "roleplay", "scene": string, "roles": [{ "name": string, "goal": string }], "starter_lines": string[] }',
  debate: '{ "type": "debate", "motion": string, "for_points": string[], "against_points": string[] }',
  speaking_mission: '{ "type": "speaking_mission", "mission": string, "success_criteria": string[] }',
  storytelling: '{ "type": "storytelling", "prompt": string, "story_anchors": string[] }',
  collaborative: '{ "type": "collaborative", "goal": string, "steps": string[] }',
  reflection: '{ "type": "reflection", "prompt": string }',
  retrieval: '{ "type": "retrieval", "items": [{ "cue": string, "answer": string }] }',
  review_challenge: '{ "type": "review_challenge", "challenge": string, "criteria": string[] }',
};

export function buildActivityPrompt(
  slot: SelectedSlot,
  ctx: GenerationContext,
  vocabDirectives: string,
  grammarDirectives: string,
): string {
  const schema = SCHEMA_HINTS[slot.type];
  return [
    `## ACTIVITY REQUEST`,
    `Generate ONE activity.`,
    `- type: ${slot.type}`,
    `- pedagogical purpose: ${slot.purpose}`,
    `- stage: ${slot.stage}`,
    `- expected modalities: ${slot.stageSpec.modalities.join(', ')}`,
    ``,
    vocabDirectives,
    ``,
    grammarDirectives,
    ``,
    `Return STRICT JSON only matching this shape (no commentary):`,
    schema,
    ``,
    `Also include alongside the type-specific fields:`,
    `  "target_vocab_used": string[]  // target words actually used`,
    `  "grammar_targets_used": string[] // target structures actually used`,
    `  "narrative_anchor": { "characters": string[], "setting": string, "scene": string }`,
  ].join('\n');
}

export function purposeForStage(stage: SelectedSlot['stage']): ActivityPurpose {
  switch (stage) {
    case 'hook': return 'hook';
    case 'context':
    case 'input': return 'input';
    case 'discovery': return 'discovery';
    case 'controlled': return 'controlled';
    case 'communicative': return 'communicative';
    case 'production': return 'production';
    case 'reflection': return 'reflection';
  }
}
