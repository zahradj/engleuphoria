
import React from "react";
import { Button } from "@/components/ui/button";
import { Users, Star, Video, DollarSign, Clock, TrendingUp } from "lucide-react";

interface WelcomeSectionProps {
  teacherName: string;
  onJoinClassroom: () => void;
  weeklyEarnings: number;
}

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

export const WelcomeSection = ({ teacherName, onJoinClassroom, weeklyEarnings }: WelcomeSectionProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-teacher via-teacher-accent to-teacher-dark rounded-2xl p-8 text-white shadow-2xl">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse-subtle"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 animate-float"></div>
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 animate-fade-in">{getGreeting()}, {teacherName}! ✨</h1>
            <p className="text-white/90 text-lg animate-fade-in animation-delay-300">Ready to inspire your students today?</p>
          </div>
          <Button 
            onClick={onJoinClassroom}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 hover:scale-105 transition-all duration-300 shadow-lg"
            size="lg"
          >
            <Video className="h-5 w-5 mr-2" />
            Quick Join Classroom
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in animation-delay-500">
          <div className="glass-enhanced rounded-xl p-4 hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Active Students</p>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-white/60 text-xs">+2 this week</p>
              </div>
            </div>
          </div>
          
          <div className="glass-enhanced rounded-xl p-4 hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <Star className="h-6 w-6 text-white fill-current" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">Rating</p>
                <p className="text-2xl font-bold text-white">4.9</p>
                <p className="text-white/60 text-xs">From 47 reviews</p>
              </div>
            </div>
          </div>
          
          <div className="glass-enhanced rounded-xl p-4 hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-white/80 text-sm font-medium">This Week</p>
                <p className="text-2xl font-bold text-white">${weeklyEarnings}</p>
                <p className="text-white/60 text-xs flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15% from last week
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
