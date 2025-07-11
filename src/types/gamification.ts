// Gamification system types

export interface LearningCurrency {
  id: string;
  student_id: string;
  total_coins: number;
  coins_spent: number;
  streak_bonus_coins: number;
  achievement_bonus_coins: number;
  created_at: string;
  updated_at: string;
}

export interface LearningChallenge {
  id: string;
  title: string;
  description: string;
  challenge_type: 'daily' | 'weekly' | 'monthly' | 'seasonal';
  difficulty_level: number;
  requirements: Record<string, any>;
  rewards: Record<string, any>;
  start_date: string;
  end_date: string;
  max_participants?: number;
  current_participants: number;
  is_active: boolean;
  created_at: string;
}

export interface StudentChallengeProgress {
  id: string;
  student_id: string;
  challenge_id: string;
  progress_data: Record<string, any>;
  completion_percentage: number;
  is_completed: boolean;
  completed_at?: string;
  started_at: string;
  updated_at: string;
  challenge?: LearningChallenge;
}

export interface AchievementTier {
  id: string;
  achievement_id: string;
  tier_level: number; // 1=Bronze, 2=Silver, 3=Gold, 4=Platinum
  tier_name: string;
  requirements: Record<string, any>;
  xp_reward: number;
  coin_reward: number;
  unlock_requirements: Record<string, any>;
  created_at: string;
}

export interface StudentAchievementTier {
  id: string;
  student_id: string;
  achievement_tier_id: string;
  progress_data: Record<string, any>;
  unlocked_at?: string;
  is_unlocked: boolean;
  created_at: string;
  achievement_tier?: AchievementTier;
}

export interface StudentLearningStreak {
  id: string;
  student_id: string;
  streak_type: 'daily' | 'weekly' | 'monthly';
  current_streak: number;
  longest_streak: number;
  last_activity_date: string;
  streak_multiplier: number;
  bonus_coins_earned: number;
  created_at: string;
  updated_at: string;
}

export interface VirtualReward {
  id: string;
  name: string;
  description: string;
  category: 'avatar' | 'theme' | 'feature_unlock' | 'boost';
  cost_coins: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  metadata: Record<string, any>;
  is_available: boolean;
  limited_quantity?: number;
  purchased_count: number;
  created_at: string;
}

export interface StudentRewardPurchase {
  id: string;
  student_id: string;
  reward_id: string;
  coins_spent: number;
  purchased_at: string;
  is_active: boolean;
  reward?: VirtualReward;
}

export interface Leaderboard {
  id: string;
  leaderboard_type: 'global' | 'community' | 'weekly' | 'monthly';
  scope_identifier?: string;
  calculation_period: 'current' | 'weekly' | 'monthly' | 'all_time';
  created_at: string;
  updated_at: string;
}

export interface LeaderboardEntry {
  id: string;
  leaderboard_id: string;
  student_id: string;
  score: number;
  rank_position: number;
  additional_data: Record<string, any>;
  recorded_at: string;
}

export interface AchievementShare {
  id: string;
  student_id: string;
  achievement_id: string;
  achievement_tier_id?: string;
  share_platform: 'community' | 'social_media';
  share_message?: string;
  likes_count: number;
  comments_count: number;
  shared_at: string;
}

export interface SeasonalEvent {
  id: string;
  name: string;
  description: string;
  theme_data: Record<string, any>;
  start_date: string;
  end_date: string;
  special_rewards: Record<string, any>;
  participation_requirements: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

// Enhanced achievement types
export interface EnhancedAchievementBadge {
  id: string;
  name: string;
  description: string;
  icon: string | React.ReactNode;
  category: string;
  tier_level: number;
  tier_name: string;
  unlocked: boolean;
  progress?: { current: number; total: number };
  xp_reward: number;
  coin_reward: number;
  unlocked_at?: string;
  className?: string;
}

// Gamification dashboard stats
export interface GamificationStats {
  total_coins: number;
  coins_spent: number;
  current_daily_streak: number;
  longest_streak: number;
  completed_challenges: number;
  active_challenges: number;
  unlocked_achievements: number;
  total_achievements: number;
  global_rank?: number;
  weekly_rank?: number;
  level: number;
  xp: number;
  next_level_xp: number;
}