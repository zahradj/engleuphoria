
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Play, 
  Clock, 
  Target, 
  Brain, 
  Lightbulb,
  Headphones,
  MessageCircle,
  BookOpen,
  PenTool,
  Gamepad2,
  CheckCircle
} from 'lucide-react';
import { CurriculumUnit } from '@/data/buildAndUseCurriculum';

interface CurriculumUnitViewerProps {
  unit: CurriculumUnit;
  onClose: () => void;
  onGenerateLesson: () => void;
}

export function CurriculumUnitViewer({ unit, onClose, onGenerateLesson }: CurriculumUnitViewerProps) {
  const getActivityIcon = (activity: string) => {
    switch (activity.toLowerCase()) {
      case 'listening': return Headphones;
      case 'speaking': return MessageCircle;
      case 'reading': return BookOpen;
      case 'writing': return PenTool;
      case 'game': return Gamepad2;
      default: return Target;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{unit.theme}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {unit.duration} minutes
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {unit.skills.length} skills integrated
                </Badge>
              </div>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X size={20} />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Grammar Focus */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="text-blue-500" size={20} />
              Grammar Focus
            </h3>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <p className="font-medium text-blue-800">{unit.grammar}</p>
              </CardContent>
            </Card>
          </div>

          {/* Learning Objectives */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="text-green-500" size={20} />
              Learning Objectives
            </h3>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <p className="text-green-800">{unit.objectives}</p>
              </CardContent>
            </Card>
          </div>

          {/* Vocabulary */}
          <div>
            <h3 className="font-semibold mb-3">Key Vocabulary</h3>
            <div className="flex gap-2 flex-wrap">
              {unit.vocabulary.map((word, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {word}
                </Badge>
              ))}
            </div>
          </div>

          {/* Build & Use Activities */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Lightbulb className="text-yellow-500" size={20} />
              Build & Use Activities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(unit.activities).map(([activityType, description]) => {
                const IconComponent = getActivityIcon(activityType);
                return (
                  <Card key={activityType} className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <IconComponent size={16} className="text-purple-600" />
                        <h4 className="font-medium capitalize">{activityType}</h4>
                      </div>
                      <p className="text-sm text-gray-600">{description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Rapid Comprehension Strategy */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Brain className="text-purple-500" size={20} />
              Rapid Comprehension Strategy
            </h3>
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <p className="text-purple-800">{unit.rapidComprehension}</p>
              </CardContent>
            </Card>
          </div>

          {/* Sentence Building Patterns */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Target className="text-orange-500" size={20} />
              Sentence Building Confidence
            </h3>
            <div className="space-y-2">
              {unit.sentenceBuilding.map((pattern, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <CheckCircle size={16} className="text-orange-500" />
                  <code className="font-mono text-orange-800">{pattern}</code>
                </div>
              ))}
            </div>
          </div>

          {/* Final Project (if exists) */}
          {unit.finalProject && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="text-yellow-500" size={20} />
                Final Project
              </h3>
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4">
                  <p className="text-yellow-800 font-medium">{unit.finalProject}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onGenerateLesson} className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
              <Lightbulb size={16} className="mr-2" />
              Generate Lesson Plan
            </Button>
            <Button variant="outline" className="flex-1">
              <Play size={16} className="mr-2" />
              Start Teaching This Unit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
