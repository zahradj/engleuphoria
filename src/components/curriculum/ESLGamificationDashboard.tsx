
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { eslCurriculumService } from "@/services/eslCurriculumService";
import { Trophy, Star, Zap, Target, Award, TrendingUp, Users, Calendar } from "lucide-react";

interface ESLGamificationDashboardProps {
  refreshTrigger: number;
}

export function ESLGamificationDashboard({ refreshTrigger }: ESLGamificationDashboardProps) {
  const [badgeSystem, setBadgeSystem] = useState<any>(null);
  const [studentStats, setStudentStats] = useState({
    totalXP: 1350,
    currentLevel: 'A2',
    streakDays: 7,
    completedMaterials: 23,
    badgesEarned: 5,
    rank: 12
  });

  useEffect(() => {
    setBadgeSystem(eslCurriculumService.getBadgeSystem());
  }, [refreshTrigger]);

  // Remove mock leaderboard data - in production this would come from Supabase
  const mockLeaderboard: any[] = [];

  if (!badgeSystem) return <div>Loading gamification data...</div>;

  return (
    <div className="space-y-6">
      {/* Student Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{studentStats.totalXP}</div>
            <div className="text-sm text-gray-600">Total XP</div>
            <div className="text-xs text-gray-500 mt-1">Level {studentStats.currentLevel}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{studentStats.streakDays}</div>
            <div className="text-sm text-gray-600">Day Streak</div>
            <div className="text-xs text-gray-500 mt-1">Keep it up!</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-600">{studentStats.completedMaterials}</div>
            <div className="text-sm text-gray-600">Materials Done</div>
            <div className="text-xs text-gray-500 mt-1">This month</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Trophy className="h-8 w-8 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{studentStats.badgesEarned}</div>
            <div className="text-sm text-gray-600">Badges Earned</div>
            <div className="text-xs text-gray-500 mt-1">Rank #{studentStats.rank}</div>
          </CardContent>
        </Card>
      </div>

      {/* Badge System */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievement Badge System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Skill Mastery Badges */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                Skill Mastery Badges
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {badgeSystem.skillMasteryBadges.map((badge: any) => (
                  <Card key={badge.id} className="p-3 border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white text-xl">
                        🏆
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{badge.name}</h5>
                        <p className="text-xs text-gray-600">{badge.description}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          +{badge.xpValue} XP
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Streak Badges */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-orange-500" />
                Streak Badges
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badgeSystem.streakBadges.map((badge: any) => (
                  <Card key={badge.id} className="p-3 border-orange-200 bg-orange-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white text-xl">
                        🔥
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{badge.name}</h5>
                        <p className="text-xs text-gray-600">{badge.description}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          +{badge.xpValue} XP
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Completion Badges */}
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-purple-500" />
                Completion Badges
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badgeSystem.completionBadges.map((badge: any) => (
                  <Card key={badge.id} className="p-3 border-purple-200 bg-purple-50">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white text-xl">
                        🎯
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{badge.name}</h5>
                        <p className="text-xs text-gray-600">{badge.description}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          +{badge.xpValue} XP
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard - No mock data in production */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Class Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-2">No leaderboard data available</p>
            <p className="text-sm text-gray-400">Complete lessons to see your ranking</p>
          </div>
        </CardContent>
      </Card>

      {/* Progress to Next Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress to Next Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-semibold">A2 → B1</div>
              <div className="text-sm text-gray-600">1,150 more XP needed</div>
            </div>
            <Progress value={54} className="h-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Current: 1,350 XP</span>
              <span>Target: 2,500 XP</span>
            </div>
            <div className="text-center">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                View Learning Plan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
