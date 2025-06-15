
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Award, 
  Star, 
  Target, 
  TrendingUp,
  Crown,
  Medal,
  Zap
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  achievement_type: string;
  achievement_name: string;
  achievement_description: string;
  earned_at: string;
  points_awarded: number;
}

interface TeacherLevel {
  current_level: string;
  points: number;
  next_level: string;
  points_to_next: number;
  progress_percentage: number;
}

export function TeacherGamification() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [teacherLevel, setTeacherLevel] = useState<TeacherLevel>({
    current_level: 'Bronze',
    points: 0,
    next_level: 'Silver',
    points_to_next: 1000,
    progress_percentage: 0
  });
  const [recentAchievements, setRecentAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    loadAchievements();
    loadTeacherLevel();
  }, []);

  const loadAchievements = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('teacher_achievements')
        .select('*')
        .eq('teacher_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error loading achievements:', error);
        return;
      }

      setAchievements(data || []);
      setRecentAchievements((data || []).slice(0, 3));
    } catch (error) {
      console.error('Error loading achievements:', error);
    }
  };

  const loadTeacherLevel = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('users')
        .select('teacher_level, teacher_points')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error loading teacher level:', error);
        return;
      }

      const currentPoints = data?.teacher_points || 0;
      const currentLevel = data?.teacher_level || 'Bronze';
      
      const levelThresholds = {
        'Bronze': { next: 'Silver', threshold: 1000 },
        'Silver': { next: 'Gold', threshold: 2500 },
        'Gold': { next: 'Platinum', threshold: 5000 },
        'Platinum': { next: 'Master', threshold: 10000 }
      };

      const levelInfo = levelThresholds[currentLevel as keyof typeof levelThresholds];
      const pointsToNext = levelInfo ? levelInfo.threshold - currentPoints : 0;
      const progressPercentage = levelInfo ? (currentPoints / levelInfo.threshold) * 100 : 100;

      setTeacherLevel({
        current_level: currentLevel,
        points: currentPoints,
        next_level: levelInfo?.next || 'Master',
        points_to_next: Math.max(0, pointsToNext),
        progress_percentage: Math.min(100, progressPercentage)
      });
    } catch (error) {
      console.error('Error loading teacher level:', error);
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Bronze': return Medal;
      case 'Silver': return Award;
      case 'Gold': return Trophy;
      case 'Platinum': return Star;
      case 'Master': return Crown;
      default: return Medal;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'from-amber-600 to-amber-800';
      case 'Silver': return 'from-gray-400 to-gray-600';
      case 'Gold': return 'from-yellow-400 to-yellow-600';
      case 'Platinum': return 'from-blue-400 to-purple-600';
      case 'Master': return 'from-purple-600 to-pink-600';
      default: return 'from-amber-600 to-amber-800';
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'badge': return Award;
      case 'milestone': return Target;
      case 'streak': return Zap;
      default: return Star;
    }
  };

  const mockAchievements = [
    {
      id: '1',
      achievement_type: 'badge',
      achievement_name: 'Feedback Champion',
      achievement_description: 'Submitted feedback for 10 consecutive lessons',
      earned_at: '2024-01-15T10:00:00Z',
      points_awarded: 100
    },
    {
      id: '2',
      achievement_type: 'milestone',
      achievement_name: 'Perfect Week',
      achievement_description: 'Completed all lessons with 5-star ratings',
      earned_at: '2024-01-10T15:30:00Z',
      points_awarded: 200
    },
    {
      id: '3',
      achievement_type: 'streak',
      achievement_name: 'On-Time Master',
      achievement_description: 'Started 20 lessons exactly on time',
      earned_at: '2024-01-05T09:00:00Z',
      points_awarded: 150
    }
  ];

  const LevelIcon = getLevelIcon(teacherLevel.current_level);

  return (
    <div className="space-y-6">
      {/* Teacher Level Card */}
      <Card className={`bg-gradient-to-r ${getLevelColor(teacherLevel.current_level)} text-white`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LevelIcon size={24} />
            {teacherLevel.current_level} Teacher
            <Badge className="bg-white/20 text-white border-white/30">
              {teacherLevel.points} points
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>Progress to {teacherLevel.next_level}</span>
              <span className="text-sm">{teacherLevel.points_to_next} points to go</span>
            </div>
            <Progress 
              value={teacherLevel.progress_percentage} 
              className="h-3 bg-white/20"
            />
            <p className="text-sm opacity-90">
              Keep up the great work! Complete more feedback submissions to level up.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="text-yellow-500" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockAchievements.length > 0 ? (
            <div className="space-y-3">
              {mockAchievements.map((achievement) => {
                const AchievementIcon = getAchievementIcon(achievement.achievement_type);
                return (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AchievementIcon size={20} className="text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-800">{achievement.achievement_name}</h4>
                      <p className="text-sm text-yellow-600">{achievement.achievement_description}</p>
                    </div>
                    <Badge className="bg-yellow-200 text-yellow-800">
                      +{achievement.points_awarded} pts
                    </Badge>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <Award className="mx-auto mb-3 text-gray-400" size={48} />
              <p className="text-gray-600">No achievements yet. Complete lessons to start earning badges!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="text-blue-500" />
            Achievement Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="text-orange-500" size={20} />
                <h4 className="font-medium">Feedback Streak</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">Submit feedback for 7 days in a row</p>
              <Progress value={57} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">4/7 days completed</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="text-purple-500" size={20} />
                <h4 className="font-medium">Quality Master</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">Achieve 4.8+ rating for 10 lessons</p>
              <Progress value={80} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">8/10 lessons completed</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-500" size={20} />
                <h4 className="font-medium">Student Progress</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">Help 5 students improve by 20%</p>
              <Progress value={40} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">2/5 students achieved</p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="text-blue-500" size={20} />
                <h4 className="font-medium">Communication Expert</h4>
              </div>
              <p className="text-sm text-gray-600 mb-2">Respond to all messages within 1 hour</p>
              <Progress value={25} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">5/20 messages on time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
