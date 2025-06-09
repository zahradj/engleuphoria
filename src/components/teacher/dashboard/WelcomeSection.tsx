
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Star, Video, DollarSign } from "lucide-react";

interface WelcomeSectionProps {
  teacherName: string;
  onJoinClassroom: () => void;
  weeklyEarnings: number;
}

export const WelcomeSection = ({ teacherName, onJoinClassroom, weeklyEarnings }: WelcomeSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-teal-500 to-indigo-500 rounded-xl p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">Welcome back, {teacherName}! 🌟</h1>
      <p className="opacity-90 mb-4">You have 3 classes scheduled today and 5 homework submissions to review.</p>
      <div className="flex gap-4 flex-wrap">
        <div className="bg-white/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <span className="font-semibold">12 Active Students</span>
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 fill-current" />
            <span className="font-semibold">4.9 Rating</span>
          </div>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span className="font-semibold">${weeklyEarnings} This Week</span>
          </div>
        </div>
        <Button 
          onClick={onJoinClassroom}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          size="sm"
        >
          <Video className="h-4 w-4 mr-2" />
          Enter Classroom
        </Button>
      </div>
    </div>
  );
};
