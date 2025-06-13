
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NLEFP_MODULES } from "@/services/nlefpCurriculumService";
import { Brain, Trophy, Star, Target, Eye } from "lucide-react";

interface NLEFPProgressTrackerProps {
  studentId: string;
  currentModule: number;
  progressWeeksCompleted: number;
  completedModules: number[];
  xpTotal: number;
  badges: string[];
}

export function NLEFPProgressTracker({ 
  studentId, 
  currentModule, 
  progressWeeksCompleted,
  completedModules,
  xpTotal,
  badges 
}: NLEFPProgressTrackerProps) {
  const currentModuleData = NLEFP_MODULES.find(m => m.id === currentModule);
  const progressPercentage = (completedModules.length / NLEFP_MODULES.length) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            NLEFP Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{completedModules.length}/12</div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{progressWeeksCompleted}</div>
              <div className="text-sm text-gray-600">Progress Weeks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{xpTotal}</div>
              <div className="text-sm text-gray-600">Total XP</div>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Progress</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {currentModuleData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Current Module: {currentModuleData.theme}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">Focus: {currentModuleData.coreFocus}</Badge>
                <Badge variant="secondary">Thinking: {currentModuleData.thinkingSkill}</Badge>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">NLP Anchor</span>
                </div>
                <p className="text-sm text-blue-800">{currentModuleData.nlpAnchor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            NLEFP Badges Earned
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="justify-center">
                  <Star className="h-3 w-3 mr-1" />
                  {badge}
                </Badge>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center py-4">
                No badges earned yet. Complete lessons to earn your first badge!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Module Progress Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {NLEFP_MODULES.map((module) => {
              const isCompleted = completedModules.includes(module.id);
              const isCurrent = module.id === currentModule;
              
              return (
                <div
                  key={module.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isCompleted 
                      ? 'border-green-500 bg-green-50' 
                      : isCurrent 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted 
                        ? 'bg-green-500 text-white' 
                        : isCurrent 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {module.id}
                    </div>
                    {isCompleted && <Trophy className="h-4 w-4 text-green-600" />}
                  </div>
                  <h4 className="text-sm font-medium mb-1">{module.theme}</h4>
                  <p className="text-xs text-gray-600">{module.thinkingSkill}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
