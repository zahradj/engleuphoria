export type SystemId = 'kids' | 'teen' | 'adult';

export interface CurriculumLesson {
  id: string;
  title: string;
  description: string | null;
  target_system: SystemId;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  duration_minutes: number;
  thumbnail_url: string | null;
  content: Record<string, unknown>;
  xp_reward: number;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SystemTheme {
  id: SystemId;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
  };
  borderRadius: string;
  fontFamily: string;
}

export const SYSTEM_THEMES: Record<SystemId, SystemTheme> = {
  kids: {
    id: 'kids',
    name: 'The Playground',
    colors: {
      primary: '330 85% 65%', // Pink
      secondary: '165 85% 55%', // Teal
      accent: '45 95% 55%', // Yellow
      background: '45 100% 97%', // Warm cream
      foreground: '280 30% 25%', // Purple-brown
      card: '0 0% 100%',
      cardForeground: '280 30% 25%',
    },
    borderRadius: '1.5rem',
    fontFamily: "'Fredoka', 'Comic Neue', cursive",
  },
  teen: {
    id: 'teen',
    name: 'The Academy',
    colors: {
      primary: '265 85% 60%', // Purple
      secondary: '190 90% 50%', // Cyan
      accent: '35 95% 55%', // Orange
      background: '240 10% 10%', // Dark
      foreground: '0 0% 95%', // Light
      card: '240 10% 15%',
      cardForeground: '0 0% 95%',
    },
    borderRadius: '0.75rem',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
  adult: {
    id: 'adult',
    name: 'The Hub',
    colors: {
      primary: '220 75% 50%', // Blue
      secondary: '160 70% 45%', // Green
      accent: '245 60% 60%', // Indigo
      background: '0 0% 100%', // White
      foreground: '220 20% 20%', // Dark gray
      card: '0 0% 98%',
      cardForeground: '220 20% 20%',
    },
    borderRadius: '0.5rem',
    fontFamily: "'Inter', system-ui, sans-serif",
  },
};

export interface StudentWithSystem {
  id: string;
  display_name: string;
  system_id: SystemId;
  avatar_url?: string | null;
  current_level?: number;
  total_xp?: number;
}
