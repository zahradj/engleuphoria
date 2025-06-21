import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ESLLevel } from "@/types/eslCurriculum";
import { CurriculumMaterial } from "@/services/enhancedESLCurriculumService";
import { Calendar, Clock, Target, Award, TrendingUp } from "lucide-react";

interface LevelProgressTrackerProps {
  level: ESLLevel;
  materials: CurriculumMaterial[];
}

export function LevelProgressTracker({ level, materials }: LevelProgressTrackerProps) {
  const calculateSkillProgress = (skillId: string) => {
    const skillMaterials = materials.filter(m => 
      m.skillFocus && m.skillFocus.includes(skillId)
    );
    if (skillMaterials.length === 0) return 0;
    
    const completedMaterials = skillMaterials.filter(m => m.views > 0).length;
    return Math.round((completedMaterials / skillMaterials.length) * 100);
  };

  const getOverallProgress = () => {
    if (materials.length === 0) return 0;
    const completedMaterials = materials.filter(m => m.views > 0).length;
    return Math.round((completedMaterials / materials.length) * 100);
  };

  const getTimeSpent = () => {
    return materials
      .filter(m => m.views > 0)
      .reduce((total, material) => total + material.duration, 0);
  };

  const getXPEarned = () => {
    return materials
      .filter(m => m.views > 0)
      .reduce((total, material) => total + material.xpReward, 0);
  };

  const overallProgress = getOverallProgress();
  const timeSpent = getTimeSpent();
  const xpEarned = getXPEarned();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview for {level.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">{overallProgress}%</div>
              <div className="text-sm text-blue-700">Overall Progress</div>
              <Progress value={overallProgress} className="mt-2 h-2" />
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600 mb-2">{timeSpent}</div>
              <div className="text-sm text-green-700">Minutes Studied</div>
              <div className="text-xs text-green-600 mt-1">
                Target: {level.estimatedHours * 60} min
              </div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600 mb-2">{xpEarned}</div>
              <div className="text-sm text-purple-700">XP Earned</div>
              <div className="text-xs text-purple-600 mt-1">
                Target: {level.xpRequired} XP
              </div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {materials.filter(m => m.views > 0).length}
              </div>
              <div className="text-sm text-orange-700">Materials Completed</div>
              <div className="text-xs text-orange-600 mt-1">
                Total: {materials.length} materials
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Skills Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {level.skills && level.skills.length > 0 ? (
              level.skills.map((skill: any, index: number) => {
                const progress = calculateSkillProgress(skill.id || skill.name);
                const materialsForSkill = materials.filter(m => 
                  m.skillFocus && m.skillFocus.includes(skill.id || skill.name)
                ).length;
                
                return (
                  <div key={skill.id || index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">
                          {skill.category}
                        </Badge>
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{materialsForSkill} materials</span>
                        <span>•</span>
                        <span>{progress}%</span>
                      </div>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target size={48} className="mx-auto mb-4 opacity-50" />
                <p>No skills defined for this level yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Learning Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-gray-600" />
                <div>
                  <div className="font-medium">Estimated Completion</div>
                  <div className="text-sm text-gray-600">
                    Based on {level.estimatedHours} hours of study
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">
                  {Math.max(0, level.estimatedHours - Math.floor(timeSpent / 60))} hours
                </div>
                <div className="text-sm text-gray-600">remaining</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Award size={20} className="text-gray-600" />
                <div>
                  <div className="font-medium">XP to Next Level</div>
                  <div className="text-sm text-gray-600">
                    Experience points needed
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">
                  {Math.max(0, level.xpRequired - xpEarned)} XP
                </div>
                <div className="text-sm text-gray-600">remaining</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
