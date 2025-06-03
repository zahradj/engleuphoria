
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Award, Gift } from "lucide-react";

interface OneOnOneRewardsProps {
  studentXP: number;
  onAwardPoints: () => void;
  showRewardPopup: boolean;
}

export function OneOnOneRewards({ studentXP, onAwardPoints, showRewardPopup }: OneOnOneRewardsProps) {
  const currentLevel = Math.floor(studentXP / 100);
  const xpInCurrentLevel = studentXP % 100;
  const xpToNextLevel = 100 - xpInCurrentLevel;

  const badges = [
    { name: "First Steps", icon: Star, earned: true, color: "text-yellow-500" },
    { name: "Word Master", icon: Trophy, earned: true, color: "text-blue-500" },
    { name: "Speaker", icon: Award, earned: false, color: "text-gray-300" },
    { name: "Grammar Pro", icon: Gift, earned: false, color: "text-gray-300" }
  ];

  return (
    <div className="space-y-4">
      {/* XP Progress */}
      <Card className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Level {currentLevel}</span>
          <Badge variant="secondary">{studentXP} XP</Badge>
        </div>
        <Progress value={xpInCurrentLevel} className="mb-1" />
        <div className="text-xs text-gray-500">
          {xpToNextLevel} XP to next level
        </div>
      </Card>

      {/* Quick Award Button */}
      <Button 
        size="sm" 
        className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
        onClick={onAwardPoints}
      >
        <Star size={16} className="mr-1" />
        Award Star (+50 XP)
      </Button>

      {/* Badges */}
      <Card className="p-3">
        <h4 className="text-sm font-medium mb-3">Achievements</h4>
        <div className="grid grid-cols-2 gap-2">
          {badges.map((badge, index) => {
            const IconComponent = badge.icon;
            return (
              <div 
                key={index}
                className={`text-center p-2 rounded-lg ${
                  badge.earned ? 'bg-yellow-50' : 'bg-gray-50'
                }`}
              >
                <IconComponent size={20} className={`mx-auto mb-1 ${badge.color}`} />
                <div className="text-xs font-medium">{badge.name}</div>
              </div>
            );
          })}
        </div>
      </Card>

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
    </div>
  );
}
