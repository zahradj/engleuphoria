
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SpeakingProgress } from '@/types/speaking';
import { Flame, Trophy, Clock, Star, Award } from 'lucide-react';

interface SpeakingStatsProps {
  progress: SpeakingProgress | null;
  todaysSpeakingTime: number;
}

export const SpeakingStats: React.FC<SpeakingStatsProps> = ({ progress, todaysSpeakingTime }) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getBadgeDisplay = (badge: string) => {
    const badgeMap: Record<string, { icon: string; name: string; color: string }> = {
      'first_words': { icon: '🎯', name: 'First Words', color: 'bg-blue-100 text-blue-800' },
      'speaking_streak': { icon: '🔥', name: 'Speaking Streak', color: 'bg-orange-100 text-orange-800' },
      'confident_speaker': { icon: '🎖️', name: 'Confident Speaker', color: 'bg-purple-100 text-purple-800' },
      'conversation_master': { icon: '💬', name: 'Conversation Master', color: 'bg-green-100 text-green-800' }
    };

    const badgeInfo = badgeMap[badge] || { icon: '⭐', name: badge, color: 'bg-gray-100 text-gray-800' };
    return (
      <Badge key={badge} className={`${badgeInfo.color} border-0`}>
        {badgeInfo.icon} {badgeInfo.name}
      </Badge>
    );
  };

  if (!progress) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Start practicing to see your progress!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Current Streak */}
      <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-orange-700">
            <Flame className="h-4 w-4" />
            Speaking Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">
            {progress.current_streak}
          </div>
          <p className="text-xs text-orange-600 mt-1">
            {progress.current_streak === 1 ? 'day' : 'days'} in a row
          </p>
        </CardContent>
      </Card>

      {/* Total Speaking Time */}
      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700">
            <Clock className="h-4 w-4" />
            Total Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">
            {formatTime(progress.total_speaking_time)}
          </div>
          <p className="text-xs text-blue-600 mt-1">
            {progress.total_sessions} sessions
          </p>
        </CardContent>
      </Card>

      {/* Speaking XP */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700">
            <Star className="h-4 w-4" />
            Speaking XP
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">
            {progress.speaking_xp}
          </div>
          <p className="text-xs text-purple-600 mt-1">
            Level {progress.current_cefr_level}
          </p>
        </CardContent>
      </Card>

      {/* Today's Practice */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700">
            <Trophy className="h-4 w-4" />
            Today's Practice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatTime(todaysSpeakingTime)}
          </div>
          <p className="text-xs text-green-600 mt-1">
            Keep it up!
          </p>
        </CardContent>
      </Card>

      {/* Badges Section */}
      {progress.badges_earned && progress.badges_earned.length > 0 && (
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Your Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {progress.badges_earned.map(badge => getBadgeDisplay(badge))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
