
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SoundButton } from "@/components/ui/sound-button";
import { Star, Trophy, History } from "lucide-react";
import { RewardSystem } from "./rewards/RewardSystem";
import { RewardHistory } from "./rewards/RewardHistory";
import { RewardAnimation } from "@/components/classroom/rewards/RewardAnimation";
import { useEnhancedRewards } from "@/hooks/useEnhancedRewards";

interface OneOnOneRewardsProps {
  studentXP: number;
  onAwardPoints: () => void;
  showRewardPopup: boolean;
}

export function OneOnOneRewards({ studentXP, onAwardPoints, showRewardPopup }: OneOnOneRewardsProps) {
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationType, setAnimationType] = useState<'star' | 'trophy' | 'award'>('star');
  const [animationPoints, setAnimationPoints] = useState(0);

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
    setAnimationType('star');
    setAnimationPoints(50);
    setShowAnimation(true);
    awardStar();
    onAwardPoints(); // Keep existing functionality
  };

  const handleQuickAward = (type: 'WORKSHEET' | 'VOCABULARY' | 'SPEAKING_PRACTICE') => {
    const points = type === 'WORKSHEET' ? 20 : type === 'VOCABULARY' ? 10 : 15;
    setAnimationType('award');
    setAnimationPoints(points);
    setShowAnimation(true);
    awardTask(type);
  };

  const handleAnimationComplete = () => {
    setShowAnimation(false);
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
          <SoundButton 
            size="sm" 
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white text-xs"
            onClick={handleAwardStar}
            soundType="reward"
          >
            <Star size={12} className="mr-1" />
            Award Star (+50 XP)
          </SoundButton>
          
          <div className="grid grid-cols-2 gap-1">
            <SoundButton
              variant="outline"
              size="sm"
              onClick={() => handleQuickAward('WORKSHEET')}
              className="text-xs"
              soundType="success"
            >
              Worksheet (+20)
            </SoundButton>
            <SoundButton
              variant="outline"
              size="sm"
              onClick={() => handleQuickAward('VOCABULARY')}
              className="text-xs"
              soundType="success"
            >
              Vocab (+10)
            </SoundButton>
          </div>
          
          <SoundButton
            variant="outline"
            size="sm"
            onClick={() => handleQuickAward('SPEAKING_PRACTICE')}
            className="w-full text-xs"
            soundType="success"
          >
            Speaking (+15)
          </SoundButton>
        </div>
      </Card>

      {/* Reward History Button */}
      <SoundButton
        variant="ghost"
        size="sm"
        onClick={() => setShowRewardHistory(true)}
        className="w-full text-xs"
      >
        <History size={12} className="mr-1" />
        View Reward History ({rewardHistory.length})
      </SoundButton>

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

      {/* Reward Animation */}
      <RewardAnimation
        show={showAnimation}
        type={animationType}
        points={animationPoints}
        onComplete={handleAnimationComplete}
      />
    </div>
  );
}
