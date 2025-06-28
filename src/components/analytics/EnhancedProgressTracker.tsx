
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Target, BarChart3, Clock, Zap, Trophy, Star } from "lucide-react";
import { progressAnalyticsService, ProgressSummary } from "@/services/progressAnalyticsService";
import { useToast } from "@/hooks/use-toast";

interface EnhancedProgressTrackerProps {
  studentId: string;
  studentName?: string;
}

export function EnhancedProgressTracker({ studentId, studentName = "Student" }: EnhancedProgressTrackerProps) {
  const [progressSummary, setProgressSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadProgressData();
  }, [studentId]);

  const loadProgressData = async () => {
    try {
      setLoading(true);
      const summary = await progressAnalyticsService.getProgressSummary(studentId);
      setProgressSummary(summary);
    } catch (error) {
      console.error('Error loading progress data:', error);
      toast({
        title: "Error",
        description: "Failed to load progress data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!progressSummary) {
    return (
      <div className="text-center py-8">
        <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No progress data available yet. Start learning to see your progress!</p>
      </div>
    );
  }

  const getSkillColor = (skill: string) => {
    const colors: Record<string, string> = {
      listening: "bg-blue-500",
      speaking: "bg-green-500",
      reading: "bg-purple-500",
      writing: "bg-orange-500",
      grammar: "bg-red-500",
      vocabulary: "bg-yellow-500"
    };
    return colors[skill] || "bg-gray-500";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Progress Analytics</h1>
        <Button onClick={loadProgressData} variant="outline" size="sm">
          <TrendingUp className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total XP</p>
                <p className="text-2xl font-bold text-blue-900">{progressSummary.totalXP.toLocaleString()}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Current Level</p>
                <p className="text-2xl font-bold text-green-900">{progressSummary.currentLevel}</p>
              </div>
              <Trophy className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Achievements</p>
                <p className="text-2xl font-bold text-purple-900">
                  {progressSummary.achievementsEarned}/{progressSummary.totalAchievements}
                </p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Weekly Minutes</p>
                <p className="text-2xl font-bold text-orange-900">{progressSummary.weeklyActivity}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="progress">Level Progress</TabsTrigger>
          <TabsTrigger value="skills">Skills Breakdown</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Level {progressSummary.currentLevel} Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">XP Progress to Next Level</span>
                    <span className="text-sm text-gray-500">{progressSummary.xpProgress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressSummary.xpProgress} className="h-4" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{progressSummary.currentLevel}</div>
                    <div className="text-sm text-blue-600">Current Level</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{progressSummary.currentLevel + 1}</div>
                    <div className="text-sm text-green-600">Next Level</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Skills Breakdown (XP Earned)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(progressSummary.skillBreakdown).map(([skill, xp]) => (
                  <div key={skill} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium capitalize">{skill}</span>
                      <span className="text-sm text-gray-500">{xp} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${getSkillColor(skill)}`}></div>
                      <Progress 
                        value={Math.min(100, (xp / Math.max(...Object.values(progressSummary.skillBreakdown))) * 100)} 
                        className="flex-1 h-2" 
                      />
                    </div>
                  </div>
                ))}
                
                {Object.keys(progressSummary.skillBreakdown).length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No skill data available yet. Complete lessons to see your progress!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressSummary.recentAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-2xl">{achievement.achievement?.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-yellow-900">{achievement.achievement?.name}</h4>
                      <p className="text-sm text-yellow-700">{achievement.achievement?.description}</p>
                      <p className="text-xs text-yellow-600 mt-1">
                        Earned {new Date(achievement.earned_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                      +{achievement.achievement?.xp_reward} XP
                    </Badge>
                  </div>
                ))}
                
                {progressSummary.recentAchievements.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No achievements earned yet. Keep learning to unlock your first achievement!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                Learning Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium">Achievement Progress</h4>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(progressSummary.achievementsEarned / progressSummary.totalAchievements) * 100} 
                      className="flex-1 h-2" 
                    />
                    <span className="text-sm text-gray-500">
                      {Math.round((progressSummary.achievementsEarned / progressSummary.totalAchievements) * 100)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Weekly Activity Goal</h4>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={Math.min(100, (progressSummary.weeklyActivity / 300) * 100)} // 300 minutes weekly goal
                      className="flex-1 h-2" 
                    />
                    <span className="text-sm text-gray-500">
                      {progressSummary.weeklyActivity}/300 min
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Performance Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <Star className="h-6 w-6 mx-auto text-blue-500 mb-1" />
                    <div className="text-sm font-medium">Consistency</div>
                    <div className="text-xs text-gray-600">
                      {progressSummary.weeklyActivity > 0 ? "Active" : "Inactive"} this week
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded">
                    <Trophy className="h-6 w-6 mx-auto text-green-500 mb-1" />
                    <div className="text-sm font-medium">Achievements</div>
                    <div className="text-xs text-gray-600">
                      {progressSummary.achievementsEarned > 0 ? "Great progress!" : "Get started!"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
