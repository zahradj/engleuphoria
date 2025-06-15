
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, Target } from "lucide-react";

export function RewardsTabContent() {
  return (
    <div className="h-full flex flex-col">
      <h4 className="font-semibold mb-3 flex items-center gap-2">
        <Trophy size={16} />
        Recent Rewards
      </h4>
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
          <Star className="text-yellow-500" size={20} />
          <div className="flex-1">
            <div className="font-medium text-sm">Perfect Pronunciation!</div>
            <div className="text-xs text-gray-600">+25 XP</div>
          </div>
          <Badge variant="secondary" className="text-xs">2 min ago</Badge>
        </div>
        
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <Award className="text-blue-500" size={20} />
          <div className="flex-1">
            <div className="font-medium text-sm">Quick Learner</div>
            <div className="text-xs text-gray-600">+15 XP</div>
          </div>
          <Badge variant="secondary" className="text-xs">5 min ago</Badge>
        </div>

        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
          <Target className="text-green-500" size={20} />
          <div className="flex-1">
            <div className="font-medium text-sm">Lesson Complete</div>
            <div className="text-xs text-gray-600">+50 XP</div>
          </div>
          <Badge variant="secondary" className="text-xs">1 hour ago</Badge>
        </div>
      </div>
    </div>
  );
}
