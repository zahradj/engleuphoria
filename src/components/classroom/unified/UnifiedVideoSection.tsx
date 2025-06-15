
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trophy, Target, Award } from "lucide-react";

interface UserProfile {
  id: string;
  name: string;
  role: 'teacher' | 'student';
  avatar?: string;
}

interface UnifiedVideoSectionProps {
  enhancedClassroom: any;
  currentUser: UserProfile;
  studentXP?: number;
  onAwardPoints?: () => void;
  showRewardPopup?: boolean;
}

export function UnifiedVideoSection({
  enhancedClassroom,
  currentUser,
  studentXP = 1250,
  onAwardPoints,
  showRewardPopup = false
}: UnifiedVideoSectionProps) {
  const isTeacher = currentUser.role === 'teacher';
  const studentLevel = Math.floor(studentXP / 100);

  // Achievement badges
  const achievements = [
    { id: 'first-steps', name: 'First Steps', icon: Target, earned: true, color: 'bg-green-100 text-green-700' },
    { id: 'word-master', name: 'Word Master', icon: Trophy, earned: true, color: 'bg-blue-100 text-blue-700' },
    { id: 'speaker', name: 'Speaker', icon: Star, earned: true, color: 'bg-purple-100 text-purple-700' },
    { id: 'grammar-pro', name: 'Grammar Pro', icon: Award, earned: false, color: 'bg-gray-100 text-gray-400' }
  ];

  const todaysGoals = [
    { task: 'Learn 5 new words', completed: true },
    { task: 'Practice pronunciation', completed: true },
    { task: 'Complete worksheet', completed: false }
  ];

  return (
    <div className="h-full flex flex-col gap-4">
      {/* Teacher Video - Simple and Clean */}
      <Card className="p-4">
        <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center relative overflow-hidden">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-white">T</span>
            </div>
            <p className="font-medium text-gray-700">Teacher Sarah</p>
            <Badge className="mt-2 bg-green-100 text-green-700">Online</Badge>
          </div>
        </div>
      </Card>

      {/* Student Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-700">Student Progress</h3>
          <Badge className="bg-yellow-100 text-yellow-700">Level {studentLevel}</Badge>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
            <span>XP Progress</span>
            <span>{studentXP % 100}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${(studentXP % 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Teacher Award Button */}
        {isTeacher && onAwardPoints && (
          <Button 
            onClick={onAwardPoints}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
          >
            <Star size={16} className="mr-2" />
            Award Star (+50 XP)
          </Button>
        )}
      </Card>

      {/* Achievement Badges */}
      <Card className="p-4">
        <h3 className="font-medium text-gray-700 mb-3">Achievements</h3>
        <div className="grid grid-cols-2 gap-2">
          {achievements.map((achievement) => {
            const IconComponent = achievement.icon;
            return (
              <div
                key={achievement.id}
                className={`p-2 rounded-lg text-center ${achievement.color} ${
                  achievement.earned ? '' : 'opacity-50'
                }`}
              >
                <IconComponent size={16} className="mx-auto mb-1" />
                <p className="text-xs font-medium">{achievement.name}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Today's Goals */}
      <Card className="p-4">
        <h3 className="font-medium text-gray-700 mb-3">Today's Goals</h3>
        <div className="space-y-2">
          {todaysGoals.map((goal, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                goal.completed ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <span className={`text-sm ${
                goal.completed ? 'text-gray-700 line-through' : 'text-gray-600'
              }`}>
                {goal.task}
              </span>
              {goal.completed && <span className="text-xs">✓</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
