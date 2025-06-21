
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy } from 'lucide-react';

interface DailyChallengeProps {
  todaysSpeakingTime: number;
}

export const DailyChallenge: React.FC<DailyChallengeProps> = ({ todaysSpeakingTime }) => {
  return (
    <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Trophy className="h-5 w-5" />
          Daily Speaking Challenge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700">Speak for 5 minutes today to earn bonus XP!</p>
            <div className="flex items-center gap-2 mt-2">
              <Progress 
                value={Math.min((todaysSpeakingTime / 300) * 100, 100)} 
                className="w-48" 
              />
              <span className="text-sm text-gray-600">
                {Math.floor(todaysSpeakingTime / 60)}m / 5m
              </span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">+50 XP</div>
            <div className="text-sm text-gray-600">Bonus Reward</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
