
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface StudentProgressProps {
  studentXP: number;
  studentName?: string;
  showRewardPopup?: boolean;
}

export function StudentProgress({ 
  studentXP, 
  studentName = "Student",
  showRewardPopup = false 
}: StudentProgressProps) {
  const currentLevel = Math.floor(studentXP / 100);
  const xpInCurrentLevel = studentXP % 100;

  return (
    <Card className="p-3">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{studentName}</span>
          <Badge className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 flex items-center gap-1">
            <Star size={12} />
            Level {currentLevel}
          </Badge>
        </div>
        
        <div>
          <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
            <span>XP Progress</span>
            <span>{xpInCurrentLevel}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${xpInCurrentLevel}%` }}
            />
          </div>
          {showRewardPopup && (
            <div className="text-center mt-2">
              <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded">
                +50 XP!
              </span>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-600">{studentXP}</div>
          <div className="text-xs text-gray-500">Total XP</div>
        </div>
      </div>
    </Card>
  );
}
