
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Users, BookOpen, Zap, Gift, Target } from "lucide-react";
import { useStudentHandlers } from "@/hooks/useStudentHandlers";

export const StudentQuickActions = () => {
  const handlers = useStudentHandlers();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Gamified Quick Actions */}
      <Card className="lg:col-span-2 border-2 border-purple-200 shadow-xl bg-gradient-to-br from-white to-purple-50">
        <CardHeader className="border-b border-purple-100">
          <CardTitle className="flex items-center gap-3 text-purple-800">
            <div className="bg-purple-500 p-3 rounded-2xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            Quick Learning Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handlers.handleJoinClass} 
              className="h-24 flex flex-col gap-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Users className="h-8 w-8" />
              <span className="font-bold">Join Next Class</span>
              <span className="text-xs opacity-80">+20 points</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handlers.handlePracticeVocabulary} 
              className="h-24 flex flex-col gap-2 border-2 border-purple-300 hover:bg-purple-50 text-purple-700 hover:border-purple-400"
            >
              <BookOpen className="h-8 w-8" />
              <span className="font-bold">Practice Vocabulary</span>
              <span className="text-xs opacity-80">+10 points</span>
            </Button>
          </div>
          <div className="mt-4 p-4 bg-yellow-100 rounded-xl border-2 border-yellow-300">
            <div className="flex items-center gap-3">
              <Gift className="h-6 w-6 text-yellow-600" />
              <div>
                <p className="font-bold text-yellow-800">Daily Challenge</p>
                <p className="text-sm text-yellow-700">Complete 3 vocabulary exercises for 50 bonus points!</p>
              </div>
            </div>
            <Progress value={33} className="mt-2 h-3" />
            <p className="text-xs text-yellow-600 mt-1">1 of 3 completed</p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Progress - Gamified */}
      <Card className="border-2 border-green-200 shadow-xl bg-gradient-to-br from-white to-green-50">
        <CardHeader className="border-b border-green-100">
          <CardTitle className="text-lg flex items-center gap-3 text-green-800">
            <div className="bg-green-500 p-2 rounded-xl">
              <Target className="h-5 w-5 text-white" />
            </div>
            Today's Goals
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-green-700">Study Time</span>
            <span className="font-bold text-green-800">45 min</span>
          </div>
          <Progress value={75} className="h-3" />
          <div className="text-xs text-green-600">Goal: 60 minutes</div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-green-700">Vocabulary</span>
            <span className="font-bold text-green-800">8/10</span>
          </div>
          <Progress value={80} className="h-3" />
          
          <div className="p-3 bg-green-100 rounded-lg border border-green-200">
            <p className="text-sm font-bold text-green-800">🎯 Almost there!</p>
            <p className="text-xs text-green-700">15 more minutes to reach your daily goal!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
