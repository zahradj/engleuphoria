
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, Target, Award, Clock } from "lucide-react";
import type { RewardHistory, XP_VALUES } from "./RewardSystem";

interface RewardHistoryProps {
  history: RewardHistory[];
  isVisible: boolean;
  onClose: () => void;
}

const getRewardIcon = (type: string, reason: string) => {
  if (reason.includes('star') || type === 'star') return Star;
  if (reason.includes('vocabulary') || reason.includes('word')) return BookOpen;
  if (reason.includes('speaking') || reason.includes('pronunciation')) return Target;
  if (reason.includes('milestone') || type === 'milestone') return Award;
  return Clock;
};

const getRewardColor = (xpAmount: number) => {
  if (xpAmount >= 50) return 'text-yellow-600 bg-yellow-50';
  if (xpAmount >= 25) return 'text-purple-600 bg-purple-50';
  if (xpAmount >= 15) return 'text-blue-600 bg-blue-50';
  return 'text-green-600 bg-green-50';
};

export function RewardHistory({ history, isVisible, onClose }: RewardHistoryProps) {
  if (!isVisible) return null;

  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalXP = history.reduce((sum, reward) => sum + reward.xpAmount, 0);
  const todayRewards = history.filter(reward => 
    new Date(reward.createdAt).toDateString() === new Date().toDateString()
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="text-yellow-600" size={20} />
              Reward History
            </CardTitle>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-yellow-600" />
              <span className="font-medium">{totalXP} Total XP</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} className="text-blue-600" />
              <span className="font-medium">{todayRewards.length} Today</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-96">
          <div className="space-y-3">
            {sortedHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Award size={32} className="mx-auto mb-2 opacity-50" />
                <p>No rewards earned yet!</p>
                <p className="text-xs">Complete activities to earn XP</p>
              </div>
            ) : (
              sortedHistory.map((reward) => {
                const IconComponent = getRewardIcon(reward.type, reward.reason);
                const colorClass = getRewardColor(reward.xpAmount);
                
                return (
                  <div
                    key={reward.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={`p-2 rounded-full ${colorClass}`}>
                      <IconComponent size={16} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {reward.reason}
                      </div>
                      <div className="text-xs text-gray-500">
                        by {reward.awardedBy} • {new Date(reward.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                      +{reward.xpAmount} XP
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
