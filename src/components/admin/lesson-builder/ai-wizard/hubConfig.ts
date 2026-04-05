import { HubType, MediaType, AnimationType, ActivityType } from './types';

export interface HubConfig {
  hub: HubType;
  label: string;
  emoji: string;
  tone: string;
  mediaType: MediaType;
  animations: AnimationType[];
  defaultAnimation: AnimationType;
  permittedActivities: ActivityType[];
  imageStyleSuffix: string;
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    highlight: string;
  };
  vocabularyCount: number;
  mascot?: { name: string; src: string; animation: string };
}

export const HUB_CONFIGS: Record<HubType, HubConfig> = {
  playground: {
    hub: 'playground',
    label: '🛝 Playground',
    emoji: '🛝',
    tone: 'Enthusiastic, magical, simple sentences, emoji-rich. Use fun exclamations and kid-friendly language.',
    mediaType: 'cartoon',
    animations: ['bounce', 'zoom_in', 'wiggle'],
    defaultAnimation: 'bounce',
    permittedActivities: ['drag_and_drop', 'match_pictures'],
    imageStyleSuffix: 'colorful cartoon illustration for kids, vibrant, playful, cute characters, rounded edges, child-friendly',
    colorPalette: {
      primary: '#FF9F1C',
      secondary: '#FFBF00',
      accent: '#7c3aed',
      background: '#FFF7ED',
      text: '#1a1a2e',
      highlight: '#fef3c7',
    },
    vocabularyCount: 4,
    mascot: { name: 'pip', src: '/pip-mascot.png', animation: 'bounce' },
  },
  academy: {
    hub: 'academy',
    label: '🏫 The Academy',
    emoji: '🏫',
    tone: 'Relatable, dynamic, trendy but educational. Use modern slang carefully, memes references, and engaging hooks.',
    mediaType: '3d_render',
    animations: ['smooth_slide', 'fade_up'],
    defaultAnimation: 'smooth_slide',
    permittedActivities: ['fill_in_blanks', 'match_terms', 'multiple_choice'],
    imageStyleSuffix: '3D render, modern cyber aesthetic, neon accents, dark background, futuristic educational, teen-friendly',
    colorPalette: {
      primary: '#6366f1',
      secondary: '#A855F7',
      accent: '#06b6d4',
      background: '#0f172a',
      text: '#e2e8f0',
      highlight: '#1e1b4b',
    },
    vocabularyCount: 5,
  },
  professional: {
    hub: 'professional',
    label: '🏢 The Hub',
    emoji: '🏢',
    tone: 'Executive, concise, high-stakes, corporate. Formal but clear. Business-focused examples.',
    mediaType: 'real_photography',
    animations: ['none'],
    defaultAnimation: 'none',
    permittedActivities: ['case_study_input', 'advanced_fill_blanks'],
    imageStyleSuffix: 'professional high-quality photography, corporate setting, clean, minimalist, business environment',
    colorPalette: {
      primary: '#059669',
      secondary: '#0d9488',
      accent: '#1e293b',
      background: '#f8fafc',
      text: '#1e293b',
      highlight: '#ecfdf5',
    },
    vocabularyCount: 5,
  },
};

export function resolveHub(ageGroup: string): HubType {
  switch (ageGroup) {
    case 'kids': return 'playground';
    case 'teens': return 'academy';
    case 'adults': return 'professional';
    default: return 'playground';
  }
}
