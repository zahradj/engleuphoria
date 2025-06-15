
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Target, 
  Brain, 
  Users, 
  Gamepad2, 
  Play,
  Clock,
  Star,
  CheckCircle,
  Lightbulb,
  Headphones,
  MessageCircle,
  PenTool,
  Trophy
} from 'lucide-react';
import { CurriculumUnitViewer } from './CurriculumUnitViewer';
import { LessonPlanGenerator } from './LessonPlanGenerator';
import { A1_CURRICULUM, A2_CURRICULUM } from '@/data/buildAndUseCurriculum';

interface BuildAndUseCurriculumLibraryProps {
  onSelectUnit: (unit: any) => void;
  onGenerateLesson: (unit: any) => void;
}

export function BuildAndUseCurriculumLibrary({ 
  onSelectUnit, 
  onGenerateLesson 
}: BuildAndUseCurriculumLibraryProps) {
  const [selectedLevel, setSelectedLevel] = useState<'A1' | 'A2'>('A1');
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [showGenerator, setShowGenerator] = useState(false);

  const getCurrentCurriculum = () => {
    return selectedLevel === 'A1' ? A1_CURRICULUM : A2_CURRICULUM;
  };

  const getSkillIcon = (skill: string) => {
    switch (skill.toLowerCase()) {
      case 'listening': return Headphones;
      case 'speaking': return MessageCircle;
      case 'reading': return BookOpen;
      case 'writing': return PenTool;
      case 'grammar': return Brain;
      case 'vocabulary': return Target;
      default: return Star;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Build & Use Curriculum Library</h2>
              <p className="text-gray-600 mt-1">Systematic English learning for rapid comprehension & sentence confidence</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white/80">
              <CardContent className="p-4 text-center">
                <Brain className="mx-auto mb-2 text-blue-500" size={24} />
                <h4 className="font-semibold">Rapid Comprehension</h4>
                <p className="text-sm text-gray-600">Fast understanding through visual cues</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80">
              <CardContent className="p-4 text-center">
                <Target className="mx-auto mb-2 text-green-500" size={24} />
                <h4 className="font-semibold">Sentence Building</h4>
                <p className="text-sm text-gray-600">Step-by-step confidence building</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80">
              <CardContent className="p-4 text-center">
                <Users className="mx-auto mb-2 text-purple-500" size={24} />
                <h4 className="font-semibold">4 Core Skills</h4>
                <p className="text-sm text-gray-600">Integrated speaking, listening, reading, writing</p>
              </CardContent>
            </Card>
            <Card className="bg-white/80">
              <CardContent className="p-4 text-center">
                <Gamepad2 className="mx-auto mb-2 text-orange-500" size={24} />
                <h4 className="font-semibold">Creative Flow</h4>
                <p className="text-sm text-gray-600">Gamified & project-based learning</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Level Selection */}
      <div className="flex gap-4 items-center">
        <h3 className="text-lg font-semibold">Select Level:</h3>
        <div className="flex gap-2">
          <Button
            variant={selectedLevel === 'A1' ? 'default' : 'outline'}
            onClick={() => setSelectedLevel('A1')}
            className="flex items-center gap-2"
          >
            <Trophy size={16} />
            A1 Foundation (12 Units)
          </Button>
          <Button
            variant={selectedLevel === 'A2' ? 'default' : 'outline'}
            onClick={() => setSelectedLevel('A2')}
            className="flex items-center gap-2"
          >
            <Star size={16} />
            A2 Communication (10 Units)
          </Button>
        </div>
        <Button
          onClick={() => setShowGenerator(true)}
          className="ml-auto bg-gradient-to-r from-green-500 to-emerald-500"
        >
          <Lightbulb size={16} className="mr-2" />
          Generate Lesson Plan
        </Button>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="units" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="units">Curriculum Units</TabsTrigger>
          <TabsTrigger value="overview">Level Overview</TabsTrigger>
          <TabsTrigger value="resources">Teaching Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="units" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getCurrentCurriculum().map((unit, index) => (
              <Card 
                key={unit.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-blue-500"
                onClick={() => setSelectedUnit(unit)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      Unit {index + 1}
                    </Badge>
                    <Clock size={16} className="text-gray-500" />
                  </div>
                  <CardTitle className="text-lg">{unit.theme}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Grammar Focus:</p>
                    <Badge variant="secondary" className="text-xs">{unit.grammar}</Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Skills Integration:</p>
                    <div className="flex gap-1 flex-wrap">
                      {unit.skills.map((skill, idx) => {
                        const IconComponent = getSkillIcon(skill);
                        return (
                          <div key={idx} className="flex items-center gap-1 bg-gray-100 rounded px-2 py-1">
                            <IconComponent size={12} />
                            <span className="text-xs">{skill}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">{unit.objectives}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectUnit(unit);
                      }}
                      className="flex-1"
                    >
                      <Play size={14} className="mr-1" />
                      View Unit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        onGenerateLesson(unit);
                      }}
                    >
                      <Lightbulb size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedLevel} Level Overview - {selectedLevel === 'A1' ? 'Foundational English' : 'Communicative English'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="text-green-500" size={20} />
                    Learning Objectives
                  </h4>
                  <ul className="space-y-2 text-sm">
                    {selectedLevel === 'A1' ? (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          Master basic sentence construction with confidence
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          Build core vocabulary (500+ high-frequency words)
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          Develop listening comprehension for everyday topics
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          Express personal information and preferences
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          Communicate about past, present, and future events
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          Use complex sentence structures with confidence
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          Express opinions and give advice
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle size={16} className="text-green-500" />
                          Handle real-world communication scenarios
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Brain className="text-blue-500" size={20} />
                    Teaching Methodology
                  </h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Lightbulb size={16} className="text-yellow-500" />
                      <strong>Build:</strong> Systematic grammar progression
                    </li>
                    <li className="flex items-center gap-2">
                      <Users size={16} className="text-purple-500" />
                      <strong>Use:</strong> Immediate meaningful application
                    </li>
                    <li className="flex items-center gap-2">
                      <Gamepad2 size={16} className="text-orange-500" />
                      <strong>Gamify:</strong> Interactive and project-based learning
                    </li>
                    <li className="flex items-center gap-2">
                      <Target size={16} className="text-green-500" />
                      <strong>Assess:</strong> Continuous progress tracking
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-blue-800">Final Project</h4>
                <p className="text-blue-700">
                  {selectedLevel === 'A1' 
                    ? '"All About Me" interactive portfolio with writing, voice recordings, and image slides'
                    : 'Create a comic strip or short story about your life (past, present, and future)'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="text-purple-500" />
                  Interactive Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2" size={16} />
                  Sentence Building Constructor
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Brain className="mr-2" size={16} />
                  Rapid Comprehension Checker
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2" size={16} />
                  Speaking Confidence Builder
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Gamepad2 className="mr-2" size={16} />
                  Grammar Pattern Games
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="text-blue-500" />
                  Assessment Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="mr-2" size={16} />
                  Unit Progress Tracker
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Star className="mr-2" size={16} />
                  Skills Mastery Chart
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="mr-2" size={16} />
                  Achievement Badges
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2" size={16} />
                  Lesson Time Tracker
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Unit Viewer Modal */}
      {selectedUnit && (
        <CurriculumUnitViewer
          unit={selectedUnit}
          onClose={() => setSelectedUnit(null)}
          onGenerateLesson={() => setShowGenerator(true)}
        />
      )}

      {/* Lesson Plan Generator Modal */}
      {showGenerator && (
        <LessonPlanGenerator
          unit={selectedUnit}
          onClose={() => setShowGenerator(false)}
          level={selectedLevel}
        />
      )}
    </div>
  );
}
