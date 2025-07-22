
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

interface DailyChallengeProps {
  todaysSpeakingTime: number;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ todaysSpeakingTime }) => {
  const targetTime = 300; // 5 minutes in seconds
  const progressPercentage = Math.min((todaysSpeakingTime / targetTime) * 100, 100);
  const isCompleted = progressPercentage >= 100;

  return (
    <Card className={`relative overflow-hidden transition-all duration-500 ${
      isCompleted 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg' 
        : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:border-orange-300 hover:shadow-lg'
    }`}>
      {/* Animated background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-pulse" />
      
      <CardHeader className="relative">
        <CardTitle className={`flex items-center gap-3 text-xl ${
          isCompleted ? 'text-green-700' : 'text-orange-700'
        }`}>
          <div className={`p-2 rounded-full ${
            isCompleted ? 'bg-green-100' : 'bg-orange-100'
          }`}>
            <Trophy className={`h-6 w-6 ${
              isCompleted ? 'text-green-600 animate-bounce' : 'text-orange-600'
            }`} />
          </div>
          Daily Speaking Challenge
          {isCompleted && (
            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
              ✨ Complete!
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="space-y-4">
          <div>
            <p className={`font-medium ${
              isCompleted 
                ? 'text-green-700' 
                : 'text-gray-700'
            }`}>
              {isCompleted 
                ? '🎉 Amazing! You\'ve completed today\'s challenge!' 
                : '🎯 Speak for 5 minutes today to earn bonus XP!'
              }
            </p>
            
            <div className="flex items-center gap-3 mt-4">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progress</span>
                  <span className={`font-medium ${
                    isCompleted ? 'text-green-600' : 'text-orange-600'
                  }`}>
                    {Math.floor(todaysSpeakingTime / 60)}m / 5m
                  </span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className={`h-3 transition-all duration-700 ${
                    isCompleted ? '[&>div]:bg-green-500' : '[&>div]:bg-orange-500'
                  }`}
                />
              </div>
              
              <div className="text-center flex-shrink-0">
                <div className={`text-2xl font-bold ${
                  isCompleted ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {isCompleted ? '✅' : '+50'} 
                  {!isCompleted && <span className="text-sm ml-1">XP</span>}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isCompleted ? 'Earned!' : 'Bonus Reward'}
                </div>
              </div>
            </div>
          </div>
          
          {isCompleted && (
            <div className="bg-green-100 p-3 rounded-lg animate-fade-in">
              <p className="text-sm text-green-700 text-center">
                🎊 Great job! Come back tomorrow for a new challenge!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};