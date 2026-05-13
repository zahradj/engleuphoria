/**
 * Hub Configuration Dictionary
 * ---------------------------------------------------------------
 * Single source of truth for age-locked UI + AI persona rules.
 * Consumed by the generation pipeline (useUnifiedLessonGenerator)
 * AND by Creator wrapper components to instantly re-skin the UI.
 */

export type HubType = 'playground' | 'academy' | 'success';

export interface HubConfig {
  /** Tailwind class string applied to wrapper containers */
  ui_theme: string;
  /** Strict prompt fragment injected into the Gemini system prompt */
  ai_persona: string;
  /** Human-readable label */
  label: string;
  /** Default CEFR floor/ceiling for sanity checks */
  cefrRange: { min: string; max: string };
  /** Default lesson duration (minutes) */
  defaultDuration: number;
  /** Hub-specific phonics/pronunciation progression rule injected into the AI prompt */
  phonics_rule: string;
}

export const HUB_CONFIGS: Record<HubType, HubConfig> = {
  playground: {
    label: 'Playground',
    ui_theme: 'rounded-3xl shadow-soft font-comic bg-pastel-green',
    ai_persona:
      'Target audience: Kids aged 4-9. Tone must be highly enthusiastic, magical, and simple. ' +
      'Use strictly CEFR Pre-A1 to A2 vocabulary. Sentences must be short (max 7 words). ' +
      'No complex grammar. Topics: Animals, magic, toys, family. ' +
      'Never use abstract concepts, business themes, or words above A2 level.',
    cefrRange: { min: 'Pre-A1', max: 'A2' },
    defaultDuration: 30,
  },
  academy: {
    label: 'Academy',
    ui_theme: 'rounded-xl shadow-md font-sans bg-cyan-50',
    ai_persona:
      'Target audience: Teenagers aged 10-15. Tone must be engaging, relevant, and slightly informal. ' +
      'Use CEFR A2 to B2 vocabulary. ' +
      'Topics: Technology, sports, school drama, pop culture, future careers. ' +
      'Avoid babyish themes (no toys, no nursery rhymes) and avoid corporate/IELTS topics.',
    cefrRange: { min: 'A2', max: 'B2' },
    defaultDuration: 60,
  },
  success: {
    label: 'Success',
    ui_theme: 'rounded-sm shadow-sm font-serif bg-slate-50 border border-slate-200',
    ai_persona:
      'Target audience: Adult professionals. Tone must be highly formal, sophisticated, and business-oriented. ' +
      'Use CEFR B1 to C2 vocabulary. ' +
      'Topics: Corporate negotiations, global travel, IELTS prep, networking. ' +
      'Use complex sentence structures and idioms. Never use childish themes or cartoon metaphors.',
    cefrRange: { min: 'B1', max: 'C2' },
    defaultDuration: 60,
  },
};

export const getHubConfig = (hub: HubType | string | undefined | null): HubConfig => {
  const key = (hub ?? 'academy').toLowerCase() as HubType;
  return HUB_CONFIGS[key] ?? HUB_CONFIGS.academy;
};
