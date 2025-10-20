export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'special' | 'completion';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpValue: number;
  unlockCondition: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'unit_completion' | 'skill_mastery' | 'streak' | 'creative_project';
  requirements: string[];
  rewards: {
    xp: number;
    badges: string[];
    unlocks: string[];
  };
  progress?: number;
  total?: number;
}

export interface XPRule {
  action: string;
  baseXP: number;
  multipliers?: {
    streak?: number;
    perfectScore?: number;
    firstTime?: number;
  };
}

export interface ProgressTracker {
  totalXP: number;
  level: number;
  badges: Badge[];
  activeQuests: Quest[];
  streakDays: number;
  lastActivity: Date;
}
