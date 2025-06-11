
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Award, Crown, BookOpen, Target } from "lucide-react";

export interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  xpRequired: number;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

export interface RewardHistory {
  id: string;
  xpAmount: number;
  reason: string;
  awardedBy: string;
  createdAt: Date;
  type: 'task' | 'star' | 'bonus' | 'milestone';
}

export const XP_VALUES = {
  WORKSHEET: 20,
  VOCABULARY: 10,
  STAR: 50,
  SPEAKING_PRACTICE: 15,
  HOMEWORK_COMPLETION: 25,
  PERFECT_QUIZ: 30,
  PARTICIPATION: 5
} as const;

export const BADGE_MILESTONES: BadgeType[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: Star,
    xpRequired: 50,
    color: 'text-yellow-500',
    unlocked: true
  },
  {
    id: 'word_learner',
    name: 'Word Learner',
    description: 'Learn 20 new vocabulary words',
    icon: BookOpen,
    xpRequired: 200,
    color: 'text-blue-500',
    unlocked: false
  },
  {
    id: 'word_master',
    name: 'Word Master',
    description: 'Master vocabulary skills',
    icon: Trophy,
    xpRequired: 500,
    color: 'text-purple-500',
    unlocked: false
  },
  {
    id: 'grammar_pro',
    name: 'Grammar Pro',
    description: 'Excel at grammar exercises',
    icon: Award,
    xpRequired: 750,
    color: 'text-green-500',
    unlocked: false
  },
  {
    id: 'speaking_star',
    name: 'Speaking Star',
    description: 'Outstanding speaking practice',
    icon: Target,
    xpRequired: 1000,
    color: 'text-orange-500',
    unlocked: false
  },
  {
    id: 'english_champion',
    name: 'English Champion',
    description: 'Reach the highest level',
    icon: Crown,
    xpRequired: 1500,
    color: 'text-red-500',
    unlocked: false
  }
];

interface RewardSystemProps {
  currentXP: number;
  badges: BadgeType[];
  onBadgeClick?: (badge: BadgeType) => void;
  showProgress?: boolean;
}

export function RewardSystem({ 
  currentXP, 
  badges, 
  onBadgeClick, 
  showProgress = true 
}: RewardSystemProps) {
  const currentLevel = Math.floor(currentXP / 100);
  const xpInCurrentLevel = currentXP % 100;
  const xpToNextLevel = 100 - xpInCurrentLevel;

  const unlockedBadges = badges.filter(badge => badge.unlocked);
  const nextBadge = badges.find(badge => !badge.unlocked && currentXP < badge.xpRequired);

  return (
    <div className="space-y-4">
      {showProgress && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Level {currentLevel}</span>
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
              {currentXP} XP
            </Badge>
          </div>
          <Progress value={xpInCurrentLevel} className="mb-1" />
          <div className="text-xs text-gray-500">
            {xpToNextLevel} XP to next level
          </div>
        </div>
      )}

      {/* Current Badges */}
      <div>
        <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
          <Trophy size={14} className="text-yellow-600" />
          Achievements ({unlockedBadges.length}/{badges.length})
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {badges.slice(0, 6).map((badge) => {
            const IconComponent = badge.icon;
            return (
              <div
                key={badge.id}
                className={`text-center p-2 rounded-lg cursor-pointer transition-all ${
                  badge.unlocked 
                    ? 'bg-yellow-50 hover:bg-yellow-100' 
                    : 'bg-gray-50 opacity-50'
                }`}
                onClick={() => onBadgeClick?.(badge)}
              >
                <IconComponent 
                  size={16} 
                  className={badge.unlocked ? badge.color : 'text-gray-300'} 
                />
                <div className="text-xs font-medium mt-1">{badge.name}</div>
                {badge.unlocked && (
                  <div className="text-xs text-green-600">✓</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Next Badge Goal */}
      {nextBadge && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <nextBadge.icon size={14} className="text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Next Goal</span>
          </div>
          <div className="text-xs text-blue-600 mb-2">{nextBadge.name}</div>
          <Progress 
            value={(currentXP / nextBadge.xpRequired) * 100} 
            className="h-2"
          />
          <div className="text-xs text-blue-600 mt-1">
            {nextBadge.xpRequired - currentXP} XP needed
          </div>
        </div>
      )}
    </div>
  );
}
