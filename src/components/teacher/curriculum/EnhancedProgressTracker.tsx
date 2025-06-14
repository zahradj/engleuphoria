
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CURRICULUM_PHASES } from "@/data/curriculumPhases";
import { progressTrackingService } from "@/services/progressTrackingService";
import { BookOpen, Target, TrendingUp, Award, Clock, Zap } from "lucide-react";

interface EnhancedProgressTrackerProps {
  studentId: string;
  currentPhase: number;
  weekProgress: number;
  sentenceBuildingLevel: number;
  comprehensionSpeed: number; // words per minute
  skillsMastered: string[];
  xpTotal: number;
  timeSpentLearning: number; // minutes this week
}

export function EnhancedProgressTracker({
  studentId,
  currentPhase,
  weekProgress,
  sentenceBuildingLevel,
  comprehensionSpeed,
  skillsMastered,
  xpTotal,
  timeSpentLearning
}: EnhancedProgressTrackerProps) {
  const phaseData = progressTrackingService.getPhaseProgress(studentId, currentPhase);
  const currentPhaseData = phaseData.currentPhase;
  const nextPhaseData = phaseData.nextPhase;

  const getPhaseColor = (phaseId: number) => {
    switch (phaseId) {
      case 1: return "text-green-600 bg-green-50";
      case 2: return "text-blue-600 bg-blue-50";
      case 3: return "text-purple-600 bg-purple-50";
      case 4: return "text-orange-600 bg-orange-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getSentenceLevelDescription = (level: number) => {
    if (level <= 1) return "Foundation Sentences";
    if (level <= 2) return "Enhanced Sentences";
    if (level <= 3) return "Complex Sentences";
    return "Advanced Communication";
  };

  const getComprehensionLevel = (speed: number) => {
    if (speed < 100) return { level: "Developing", color: "text-yellow-600" };
    if (speed < 150) return { level: "Good", color: "text-blue-600" };
    if (speed < 200) return { level: "Excellent", color: "text-green-600" };
    return { level: "Advanced", color: "text-purple-600" };
  };

  const comprehensionLevel = getComprehensionLevel(comprehensionSpeed);

  return (
    <div className="space-y-6">
      {/* Current Phase Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Enhanced Curriculum Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${getPhaseColor(currentPhase)}`}>
              <h3 className="font-bold text-lg">{currentPhaseData.name}</h3>
              <p className="text-sm opacity-80">{currentPhaseData.description}</p>
              <div className="mt-2">
                <Badge variant="outline">
                  Week {weekProgress} of {currentPhaseData.duration}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{currentPhase}/4</div>
                <div className="text-sm text-gray-600">Phases Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{weekProgress}</div>
                <div className="text-sm text-gray-600">Weeks in Phase</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{skillsMastered.length}</div>
                <div className="text-sm text-gray-600">Skills Mastered</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sentence Building Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Sentence Building Mastery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Current Level</span>
              <Badge className="bg-green-100 text-green-800">
                {getSentenceLevelDescription(sentenceBuildingLevel)}
              </Badge>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Sentence Complexity Progress</span>
                <span>Level {sentenceBuildingLevel}/4</span>
              </div>
              <Progress value={(sentenceBuildingLevel / 4) * 100} className="h-2" />
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Next Milestone</h4>
              <p className="text-sm text-green-700">
                {sentenceBuildingLevel < 4 
                  ? `Master ${getSentenceLevelDescription(sentenceBuildingLevel + 1)} patterns`
                  : "All sentence building levels completed!"
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehension Speed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            Rapid Comprehension Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${comprehensionLevel.color}`}>
                {comprehensionSpeed} WPM
              </div>
              <div className="text-sm text-gray-600">Reading Comprehension Speed</div>
              <Badge className={`mt-1 ${comprehensionLevel.color.replace('text-', 'bg-').replace('600', '100')} ${comprehensionLevel.color.replace('600', '800')}`}>
                {comprehensionLevel.level}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-blue-600">{timeSpentLearning}</div>
                <div className="text-gray-600">Minutes This Week</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-purple-600">{xpTotal}</div>
                <div className="text-gray-600">Total XP Earned</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Mastery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-600" />
            Skills Mastery Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Current Phase Skills</h4>
              <div className="grid grid-cols-2 gap-2">
                {currentPhaseData.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant={skillsMastered.includes(skill) ? "default" : "outline"}
                    className="justify-center"
                  >
                    {skillsMastered.includes(skill) && "✓ "}
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            {nextPhaseData && (
              <div>
                <h4 className="font-medium mb-2">Next Phase: {nextPhaseData.name}</h4>
                <div className="grid grid-cols-2 gap-2">
                  {nextPhaseData.skills.slice(0, 4).map((skill, index) => (
                    <Badge key={index} variant="outline" className="justify-center opacity-60">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Learning Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Overall Progress</span>
              <span className="text-sm font-medium">{Math.round(phaseData.progressPercentage)}%</span>
            </div>
            <Progress value={phaseData.progressPercentage} className="h-2" />
            
            <div className="grid grid-cols-2 gap-4 text-sm mt-4">
              <div>
                <span className="text-gray-600">Avg. Session Time</span>
                <div className="font-medium">{Math.round(timeSpentLearning / 7)} min/day</div>
              </div>
              <div>
                <span className="text-gray-600">Learning Efficiency</span>
                <div className="font-medium text-green-600">High</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
