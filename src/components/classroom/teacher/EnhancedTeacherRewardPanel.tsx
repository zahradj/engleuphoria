
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Award, Target, Book, MessageCircle, Zap, Gift } from "lucide-react";
import { useEnhancedRewards } from "@/hooks/useEnhancedRewards";
import { useToast } from "@/hooks/use-toast";

interface EnhancedTeacherRewardPanelProps {
  studentXP: number;
  onAwardPoints: () => void;
  showRewardPopup: boolean;
  studentName?: string;
}

export function EnhancedTeacherRewardPanel({
  studentXP,
  onAwardPoints,
  showRewardPopup,
  studentName = "Student"
}: EnhancedTeacherRewardPanelProps) {
  const { toast } = useToast();
  const {
    currentXP,
    badges,
    rewardHistory,
    awardStar,
    awardTask,
    currentLevel,
    xpInCurrentLevel,
    xpToNextLevel
  } = useEnhancedRewards(studentXP);

  const handleQuickReward = (type: 'STAR' | 'WORKSHEET' | 'VOCABULARY' | 'SPEAKING_PRACTICE', message: string) => {
    if (type === 'STAR') {
      awardStar();
    } else {
      awardTask(type);
    }
    onAwardPoints(); // Trigger existing reward popup
    
    toast({
      title: "🎉 Reward Awarded!",
      description: `${studentName} earned points for ${message}`,
      duration: 3000,
    });
  };

  const unlockedBadges = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-4">
      {/* Student Progress Overview */}
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-gray-800">{studentName}'s Progress</h3>
          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
            Level {currentLevel}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>XP Progress</span>
              <span>{xpInCurrentLevel}/100</span>
            </div>
            <Progress value={xpInCurrentLevel} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              {xpToNextLevel} XP to next level
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-yellow-600" />
              <span className="text-gray-600">Badges:</span>
            </div>
            <span className="font-semibold text-gray-800">{unlockedBadges}/{badges.length}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-gray-600">Total XP:</span>
            </div>
            <span className="font-semibold text-gray-800">{currentXP}</span>
          </div>
        </div>
      </Card>

      {/* Quick Reward Actions */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Gift className="h-4 w-4 text-purple-600" />
          Quick Rewards
        </h4>
        
        <div className="space-y-2">
          {/* Star Award - Primary */}
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-md"
            onClick={() => handleQuickReward('STAR', 'excellent work')}
          >
            <Star size={14} className="mr-2" />
            Award Star (+50 XP)
          </Button>
          
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickReward('WORKSHEET', 'completing worksheet')}
              className="text-xs flex items-center gap-1"
            >
              <Book size={12} />
              Worksheet (+20)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickReward('VOCABULARY', 'learning vocabulary')}
              className="text-xs flex items-center gap-1"
            >
              <Target size={12} />
              Vocab (+10)
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickReward('SPEAKING_PRACTICE', 'speaking practice')}
            className="w-full text-xs flex items-center gap-1"
          >
            <MessageCircle size={12} />
            Speaking Practice (+15)
          </Button>
        </div>
      </Card>

      {/* Custom Reward */}
      <Card className="p-4">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-blue-600" />
          Motivational Actions
        </h4>
        
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toast({
                title: "👏 Great Job!",
                description: `Encouraging ${studentName} to keep up the excellent work!`,
                duration: 3000,
              });
            }}
            className="w-full text-xs justify-start"
          >
            👏 Encourage Student
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toast({
                title: "🎯 Focus Reminder",
                description: `Gentle reminder sent to ${studentName} to stay focused.`,
                duration: 3000,
              });
            }}
            className="w-full text-xs justify-start"
          >
            🎯 Focus Reminder
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              toast({
                title: "💪 Motivation Boost",
                description: `Motivational message sent to ${studentName}!`,
                duration: 3000,
              });
            }}
            className="w-full text-xs justify-start"
          >
            💪 Motivate Student
          </Button>
        </div>
      </Card>

      {/* Recent Activity */}
      {rewardHistory.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-sm mb-3">Recent Rewards</h4>
          <div className="space-y-2">
            {rewardHistory.slice(0, 3).map((reward) => (
              <div key={reward.id} className="flex items-center justify-between text-xs">
                <span className="text-gray-600 truncate flex-1 mr-2">{reward.reason}</span>
                <Badge variant="secondary" className="text-xs">
                  +{reward.xpAmount} XP
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
