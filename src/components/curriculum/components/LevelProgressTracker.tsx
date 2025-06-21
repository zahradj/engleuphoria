
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ESLLevel } from "@/types/eslCurriculum";
import { CurriculumMaterial } from "@/services/enhancedESLCurriculumService";
import { TrendingUp, Award, Clock, Target, Calendar, BarChart3 } from "lucide-react";

interface LevelProgressTrackerProps {
  level: ESLLevel;
  materials: CurriculumMaterial[];
}

export function LevelProgressTracker({ level, materials }: LevelProgressTrackerProps) {
  const calculateOverallProgress = () => {
    if (materials.length === 0) return 0;
    const completedMaterials = materials.filter(m => m.views > 0).length;
    return Math.round((completedMaterials / materials.length) * 100);
  };

  const calculateXPEarned = () => {
    return materials
      .filter(m => m.views > 0)
      .reduce((sum, m) => sum + m.xpReward, 0);
  };

  const calculateTimeSpent = () => {
    return materials
      .filter(m => m.views > 0)
      .reduce((sum, m) => sum + m.duration, 0);
  };

  const getProgressByType = () => {
    const types = Array.from(new Set(materials.map(m => m.type)));
    return types.map(type => {
      const typeMaterials = materials.filter(m => m.type === type);
      const completed = typeMaterials.filter(m => m.views > 0).length;
      const progress = typeMaterials.length > 0 ? (completed / typeMaterials.length) * 100 : 0;
      
      return {
        type,
        total: typeMaterials.length,
        completed,
        progress: Math.round(progress)
      };
    });
  };

  const getWeeklyActivity = () => {
    // Mock data for weekly activity - in real app this would come from analytics
    return [
      { week: 'Week 1', materials: 3, xp: 150 },
      { week: 'Week 2', materials: 5, xp: 250 },
      { week: 'Week 3', materials: 2, xp: 100 },
      { week: 'Week 4', materials: 4, xp: 200 },
    ];
  };

  const overallProgress = calculateOverallProgress();
  const xpEarned = calculateXPEarned();
  const timeSpent = calculateTimeSpent();
  const progressByType = getProgressByType();
  const weeklyActivity = getWeeklyActivity();

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{overallProgress}%</div>
                <div className="text-sm text-gray-600">Overall Progress</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{xpEarned}</div>
                <div className="text-sm text-gray-600">XP Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{timeSpent}</div>
                <div className="text-sm text-gray-600">Minutes Spent</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{materials.filter(m => m.views > 0).length}</div>
                <div className="text-sm text-gray-600">Materials Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={20} />
            Level Completion Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress towards {level.name} completion</span>
                <span>{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">
                  {materials.filter(m => m.views > 0).length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {materials.filter(m => m.views === 0).length}
                </div>
                <div className="text-sm text-blue-700">Remaining</div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-xl font-bold text-purple-600">
                  {level.xpRequired}
                </div>
                <div className="text-sm text-purple-700">XP Target</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress by Material Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            Progress by Material Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {progressByType.map((typeData) => (
              <div key={typeData.type} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {typeData.type}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      {typeData.completed} / {typeData.total} completed
                    </span>
                  </div>
                  <span className="text-sm font-medium">{typeData.progress}%</span>
                </div>
                <Progress value={typeData.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar size={20} />
            Weekly Activity Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {weeklyActivity.map((week) => (
              <div key={week.week} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{week.week}</div>
                  <div className="text-sm text-gray-600">
                    {week.materials} materials • {week.xp} XP earned
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{week.xp} XP</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {overallProgress < 25 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-800">Getting Started</div>
                <div className="text-sm text-blue-700">
                  Focus on completing basic materials to build foundation knowledge.
                </div>
              </div>
            )}
            
            {overallProgress >= 25 && overallProgress < 50 && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium text-green-800">Building Momentum</div>
                <div className="text-sm text-green-700">
                  Great progress! Try interactive activities and games to reinforce learning.
                </div>
              </div>
            )}
            
            {overallProgress >= 50 && overallProgress < 75 && (
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="font-medium text-orange-800">Halfway There</div>
                <div className="text-sm text-orange-700">
                  Focus on assessment materials to test your knowledge and identify areas for improvement.
                </div>
              </div>
            )}
            
            {overallProgress >= 75 && overallProgress < 100 && (
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium text-purple-800">Final Push</div>
                <div className="text-sm text-purple-700">
                  You're almost there! Complete remaining materials and consider moving to the next level.
                </div>
              </div>
            )}
            
            {overallProgress === 100 && (
              <div className="p-3 bg-emerald-50 rounded-lg">
                <div className="font-medium text-emerald-800">Level Complete!</div>
                <div className="text-sm text-emerald-700">
                  Congratulations! You've completed {level.name}. Ready for the next level?
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
