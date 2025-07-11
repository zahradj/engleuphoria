import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { StudentLearningStreak } from "@/types/gamification";
import { Flame, Calendar, Award, TrendingUp } from "lucide-react";

interface StreakCardProps {
  streaks: StudentLearningStreak[];
  onUpdateStreak: (streakType: 'daily' | 'weekly' | 'monthly') => Promise<any>;
}

export function StreakCard({ streaks, onUpdateStreak }: StreakCardProps) {
  const dailyStreak = streaks.find(s => s.streak_type === 'daily');
  const weeklyStreak = streaks.find(s => s.streak_type === 'weekly');
  const monthlyStreak = streaks.find(s => s.streak_type === 'monthly');

  const getStreakReward = (streak: number) => {
    if (streak >= 30) return { coins: 50, level: 'epic' };
    if (streak >= 14) return { coins: 25, level: 'rare' };
    if (streak >= 7) return { coins: 10, level: 'uncommon' };
    if (streak >= 3) return { coins: 5, level: 'common' };
    return { coins: 0, level: 'none' };
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'from-purple-500 to-pink-500';
    if (streak >= 14) return 'from-blue-500 to-purple-500';
    if (streak >= 7) return 'from-green-500 to-blue-500';
    if (streak >= 3) return 'from-yellow-500 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const isToday = (dateString: string) => {
    const today = new Date().toDateString();
    const streakDate = new Date(dateString).toDateString();
    return today === streakDate;
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <Flame className="h-5 w-5" />
          Learning Streaks
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily Streak */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getStreakColor(dailyStreak?.current_streak || 0)} flex items-center justify-center`}>
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="font-medium">Daily Streak</p>
                <p className="text-sm text-muted-foreground">
                  Current: {dailyStreak?.current_streak || 0} days
                </p>
              </div>
            </div>
            <div className="text-right">
              <Badge variant={dailyStreak?.current_streak && dailyStreak.current_streak > 0 ? "default" : "secondary"}>
                🔥 {dailyStreak?.current_streak || 0}
              </Badge>
              {dailyStreak && getStreakReward(dailyStreak.current_streak).coins > 0 && (
                <p className="text-xs text-yellow-600 mt-1">
                  +{getStreakReward(dailyStreak.current_streak).coins} coins
                </p>
              )}
            </div>
          </div>

          {dailyStreak && !isToday(dailyStreak.last_activity_date) && (
            <Button 
              onClick={() => onUpdateStreak('daily')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Continue Streak
            </Button>
          )}

          {dailyStreak && isToday(dailyStreak.last_activity_date) && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-700 flex items-center gap-1">
                <Award className="h-4 w-4" />
                Streak updated today! Keep it up tomorrow.
              </p>
            </div>
          )}
        </div>

        {/* Progress to next milestone */}
        {dailyStreak && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to next reward</span>
              <span>
                {dailyStreak.current_streak >= 30 ? 'Max reward!' : 
                 dailyStreak.current_streak >= 14 ? `${30 - dailyStreak.current_streak} days to epic` :
                 dailyStreak.current_streak >= 7 ? `${14 - dailyStreak.current_streak} days to rare` :
                 dailyStreak.current_streak >= 3 ? `${7 - dailyStreak.current_streak} days to uncommon` :
                 `${3 - dailyStreak.current_streak} days to first reward`}
              </span>
            </div>
            <Progress 
              value={dailyStreak.current_streak >= 30 ? 100 : 
                     dailyStreak.current_streak >= 14 ? ((dailyStreak.current_streak - 14) / 16) * 100 :
                     dailyStreak.current_streak >= 7 ? ((dailyStreak.current_streak - 7) / 7) * 100 :
                     dailyStreak.current_streak >= 3 ? ((dailyStreak.current_streak - 3) / 4) * 100 :
                     (dailyStreak.current_streak / 3) * 100}
              className="h-2"
            />
          </div>
        )}

        {/* Longest Streak Achievement */}
        {dailyStreak && dailyStreak.longest_streak > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-700 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Your longest streak: {dailyStreak.longest_streak} days
            </p>
          </div>
        )}

        {/* Weekly and Monthly Streaks */}
        <div className="grid grid-cols-2 gap-3 pt-2 border-t">
          <div className="text-center">
            <p className="text-sm font-medium">Weekly</p>
            <p className="text-lg font-bold text-blue-600">{weeklyStreak?.current_streak || 0}</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Monthly</p>
            <p className="text-lg font-bold text-purple-600">{monthlyStreak?.current_streak || 0}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}