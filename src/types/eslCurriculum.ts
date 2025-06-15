
export interface ESLLevel {
  id: string;
  name: string;
  cefrLevel: 'Pre-A1' | 'A1' | 'A1+' | 'A2' | 'A2+' | 'B1' | 'B1+' | 'B2' | 'B2+' | 'C1' | 'C1+' | 'C2';
  ageGroup: string;
  description: string;
  skills: ESLSkill[];
  xpRequired: number;
  estimatedHours: number;
  levelOrder: number;
}

export interface ESLSkill {
  id: string;
  name: string;
  category: 'listening' | 'speaking' | 'reading' | 'writing' | 'grammar' | 'vocabulary' | 'pronunciation' | 'songs' | 'games' | 'exam_prep';
  description: string;
  canStudentPractice: boolean;
  ageAppropriate: boolean;
  grammarPoints?: string[];
  vocabularyThemes?: string[];
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
  type: 'worksheet' | 'activity' | 'lesson_plan' | 'assessment' | 'game' | 'video' | 'audio' | 'reading' | 'song' | 'story' | 'exam_prep';
  level: ESLLevel;
  skills: ESLSkill[];
  duration: number;
  xpReward: number;
  difficultyRating: number;
  isAIGenerated: boolean;
  ageAppropriate: boolean;
  gamificationElements: GameElement[];
  content: any;
  createdAt: Date;
  lastModified: Date;
}

export interface GamificationRule {
  id: string;
  name: string;
  type: 'xp_bonus' | 'badge_unlock' | 'streak_reward' | 'completion_bonus' | 'age_bonus';
  condition: string;
  reward: number;
  description: string;
  ageGroup?: string;
}

export interface GameElement {
  id: string;
  type: 'points' | 'badge' | 'achievement' | 'leaderboard' | 'progress_bar' | 'mini_game' | 'sticker' | 'certificate';
  name: string;
  description: string;
  value: number;
  unlockCondition?: string;
  ageAppropriate: boolean;
}

export interface AITemplate {
  id: string;
  name: string;
  type: 'worksheet' | 'activity' | 'quiz' | 'lesson_plan' | 'dialogue' | 'story' | 'song' | 'game' | 'exam_prep';
  prompt: string;
  parameters: AIParameter[];
  outputFormat: string;
  estimatedGenerationTime: number;
  ageGroups: string[];
  minAge: number;
  maxAge: number;
}

export interface AIParameter {
  name: string;
  type: 'text' | 'select' | 'number' | 'boolean';
  required: boolean;
  options?: string[];
  defaultValue?: any;
  description: string;
  ageDependent?: boolean;
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
  age?: number;
  preferredActivityTypes: string[];
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
  category: 'skill_mastery' | 'streak' | 'completion' | 'special_achievement' | 'age_milestone';
  xpValue: number;
  unlockedAt: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  ageGroup?: string;
}
