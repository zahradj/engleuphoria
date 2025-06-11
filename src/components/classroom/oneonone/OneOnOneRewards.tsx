
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, History } from "lucide-react";
import { RewardSystem } from "./rewards/RewardSystem";
import { RewardHistory } from "./rewards/RewardHistory";
import { useEnhancedRewards } from "@/hooks/useEnhancedRewards";

interface OneOnOneRewardsProps {
  studentXP: number;
  onAwardPoints: () => void;
  showRewardPopup: boolean;
}

export function OneOnOneRewards({ studentXP, onAwardPoints, showRewardPopup }: OneOnOneRewardsProps) {
  const {
    currentXP,
    badges,
    rewardHistory,
    showRewardHistory,
    setShowRewardHistory,
    awardStar,
    awardTask,
    currentLevel,
    xpInCurrentLevel,
    xpToNextLevel
  } = useEnhancedRewards(studentXP);

  const handleAwardStar = () => {
    awardStar();
    onAwardPoints(); // Keep existing functionality
  };

  const handleQuickAward = (type: 'WORKSHEET' | 'VOCABULARY' | 'SPEAKING_PRACTICE') => {
    awardTask(type);
  };

  return (
    <div className="space-y-4">
      {/* Enhanced Reward System */}
      <RewardSystem
        currentXP={currentXP}
        badges={badges}
        showProgress={true}
      />

      {/* Quick Award Buttons */}
      <Card className="p-3">
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Star className="text-yellow-600" size={14} />
          Quick Awards
        </h4>
        
        <div className="space-y-2">
          <Button 
            size="sm" 
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-xs"
            onClick={handleAwardStar}
          >
            <Star size={12} className="mr-1" />
            Award Star (+50 XP)
          </Button>
          
          <div className="grid grid-cols-2 gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAward('WORKSHEET')}
              className="text-xs"
            >
              Worksheet (+20)
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleQuickAward('VOCABULARY')}
              className="text-xs"
            >
              Vocab (+10)
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAward('SPEAKING_PRACTICE')}
            className="w-full text-xs"
          >
            Speaking (+15)
          </Button>
        </div>
      </Card>

      {/* Reward History Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowRewardHistory(true)}
        className="w-full text-xs"
      >
        <History size={12} className="mr-1" />
        View Reward History ({rewardHistory.length})
      </Button>

      {/* Today's Goals */}
      <Card className="p-3">
        <h4 className="text-sm font-medium mb-2">Today's Goals</h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Learn 5 new words ✓</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Practice pronunciation ✓</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <span>Complete worksheet</span>
          </div>
        </div>
      </Card>

      {/* Reward History Modal */}
      <RewardHistory
        history={rewardHistory}
        isVisible={showRewardHistory}
        onClose={() => setShowRewardHistory(false)}
      />
    </div>
  );
}
