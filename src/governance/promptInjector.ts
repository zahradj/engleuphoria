// Builds the governance system-prompt block that MUST prepend every Gemini call
// involved in lesson/slide generation. Keep it concise — token budget matters.

import type { LessonState } from './types';
import { effectiveCaps, HUB_BANNED_REGISTERS } from './data/cefrCaps';

export function buildGovernanceSystemPrompt(state: LessonState): string {
  const caps = effectiveCaps(state.cefr, state.hub);
  const lines: string[] = [];

  lines.push('## CURRICULUM GOVERNANCE CONTRACT (binding)');
  lines.push(`Hub: ${state.hub} · CEFR: ${state.cefr}`);
  lines.push(`Theme: ${state.theme.theme}`);
  lines.push(`Characters: ${(state.theme.characters || []).join(', ') || '(none)'}`);
  lines.push(`Setting: ${state.theme.setting}`);
  lines.push(`Tone: ${state.theme.tone}`);
  lines.push(`Communication goal: ${state.theme.communication_goal}`);
  lines.push('');
  lines.push('### Grammar scope');
  lines.push(`- TARGET (use): ${state.grammar.target_grammar.join(', ') || '(none)'}`);
  lines.push(`- REVIEW (light recycle): ${state.grammar.review_grammar.join(', ') || '(none)'}`);
  lines.push(`- EXPOSURE only (minimal, non-essential): ${state.grammar.exposure_grammar.join(', ') || '(none)'}`);
  lines.push(`- BLOCKED (never): ${state.grammar.blocked_grammar.join(', ') || '(none)'}`);
  lines.push('');
  lines.push('### Vocabulary scope');
  lines.push(`- TARGET (recycle across activities): ${state.vocab.target_vocab.join(', ')}`);
  lines.push(`- SUPPORT (allowed): ${state.vocab.support_vocab.join(', ')}`);
  lines.push(`- FORBIDDEN CATEGORIES (never): ${state.vocab.forbidden_vocab_categories.join(', ') || '(none)'}`);
  lines.push('');
  lines.push('### CEFR caps');
  lines.push(`- Max sentence words: ${caps.maxSentenceWords}`);
  lines.push(`- Max clauses per sentence: ${caps.maxClausesPerSentence}`);
  lines.push(`- Max syllables per word: ${caps.maxSyllablesPerWord}`);
  lines.push(`- Abstract concepts allowed: ${caps.allowAbstract ? 'yes' : 'no'}`);
  lines.push(`- Banned constructs at this level: ${caps.bannedConstructs.join(', ') || '(none)'}`);
  lines.push('');
  lines.push('### Hub register');
  lines.push(`- Forbidden registers in ${state.hub}: ${HUB_BANNED_REGISTERS[state.hub].join(', ')}`);
  lines.push('');
  lines.push('### Hard rules');
  lines.push('1. NEVER use blocked grammar or above-level constructs.');
  lines.push('2. NEVER introduce vocabulary from forbidden categories.');
  lines.push('3. EVERY activity must stay inside the declared theme/characters/setting.');
  lines.push('4. NO placeholders ("lorem ipsum", "New sentence here.", "[insert ...]").');
  lines.push('5. Return complete, well-formed JSON only. No commentary outside the JSON.');
  lines.push('6. Alternate receptive (input) and productive (output) activities.');
  lines.push('');
  return lines.join('\n');
}
