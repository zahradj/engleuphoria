
export interface ESLLevel {
  id: string;
  name: string;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  description: string;
  skills: ESLSkill[];
  xpRequired: number;
  estimatedHours: number;
}

export interface ESLSkill {
  id: string;
  name: string;
  category: 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'vocabulary' | 'pronunciation';
  description: string;
  canStudentPractice: boolean;
}

export interface ESLCollection {
  id: string;
  name: string;
  description: string;
  level: ESLLevel;
  skills: ESLSkill[];
  materials: ESLMaterial[];
  gamificationRules: GamificationRule[];
  aiGenerationTemplates: AITemplate[];
}

export interface ESLMaterial {
  id: string;
  title: string;
  description: string;
  type: 'worksheet' | 'activity' | 'lesson_plan' | 'assessment' | 'game' | 'video' | 'audio' | 'reading';
  level: ESLLevel;
  skills: ESLSkill[];
  duration: number;
  xpReward: number;
  difficultyRating: number;
  isAIGenerated: boolean;
  gamificationElements: GameElement[];
  content: any;
  createdAt: Date;
  lastModified: Date;
}

export interface GamificationRule {
  id: string;
  name: string;
  type: 'xp_bonus' | 'badge_unlock' | 'streak_reward' | 'completion_bonus';
  condition: string;
  reward: number;
  description: string;
}

export interface GameElement {
  id: string;
  type: 'points' | 'badge' | 'achievement' | 'leaderboard' | 'progress_bar' | 'mini_game';
  name: string;
  description: string;
  value: number;
  unlockCondition?: string;
}

export interface AITemplate {
  id: string;
  name: string;
  type: 'worksheet' | 'activity' | 'quiz' | 'lesson_plan' | 'dialogue' | 'story';
  prompt: string;
  parameters: AIParameter[];
  outputFormat: string;
  estimatedGenerationTime: number;
}

export interface AIParameter {
  name: string;
  type: 'text' | 'select' | 'number' | 'boolean';
  required: boolean;
  options?: string[];
  defaultValue?: any;
  description: string;
}

export interface StudentProgress {
  studentId: string;
  currentLevel: ESLLevel;
  totalXP: number;
  skillProgress: SkillProgress[];
  badges: Badge[];
  streakDays: number;
  lastActivityDate: Date;
  completedMaterials: string[];
}

export interface SkillProgress {
  skill: ESLSkill;
  currentXP: number;
  masteryLevel: number; // 0-100%
  lastPracticed: Date;
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'skill_mastery' | 'streak' | 'completion' | 'special_achievement';
  xpValue: number;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
