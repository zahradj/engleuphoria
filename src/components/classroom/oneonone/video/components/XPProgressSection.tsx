
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star } from "lucide-react";

interface Props {
  studentXP: number;
  showRewardPopup: boolean;
}

export function XPProgressSection({ studentXP, showRewardPopup }: Props) {
  return (
    <div className="p-4 flex flex-col items-center">
      <div className="w-full flex items-center justify-between">
        <div>
          <span className="font-semibold text-md text-gray-800">
            XP Progress
          </span>
          <span className="ml-2 font-bold text-orange-600 text-lg">{studentXP % 100}/100</span>
        </div>
        <Badge className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white border-0 shadow-xl px-4 py-2 rounded-full flex items-center gap-2">
          <Star size={18} className="mr-1" />
          Level {Math.floor(studentXP/100)}
        </Badge>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mt-3 relative overflow-hidden">
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-3 rounded-full transition-all duration-700 ease-out shadow-md"
          style={{width: `${studentXP % 100}%`}} />
        {showRewardPopup && (
          <div className="absolute right-0 -top-8 text-green-600 font-bold text-sm animate-bounce-in bg-gradient-to-r from-green-50 to-emerald-50 px-4 py-2 rounded-xl shadow-lg border border-green-200">
            <Sparkles className="inline h-3 w-3 mr-1" /> +50 XP ✨
          </div>
        )}
      </div>
    </div>
  );
}
