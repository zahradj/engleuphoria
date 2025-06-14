
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Users, 
  Target, 
  Calendar,
  BarChart3,
  Lightbulb,
  Play,
  Settings,
  Download
} from "lucide-react";
import { CURRICULUM_PHASES } from "@/services/enhancedCurriculumService";
import { LessonContentViewer } from "./LessonContentViewer";
import { InteractiveMaterials } from "./InteractiveMaterials";
import { SentenceBuildingFramework } from "./SentenceBuildingFramework";
import { RapidComprehensionStrategies } from "./RapidComprehensionStrategies";
import { EnhancedProgressTracker } from "./EnhancedProgressTracker";

interface ComprehensiveCurriculumManagerProps {
  studentId?: string;
  currentPhase?: number;
  currentWeek?: number;
}

export function ComprehensiveCurriculumManager({ 
  studentId = "student_1", 
  currentPhase = 1, 
  currentWeek = 1 
}: ComprehensiveCurriculumManagerProps) {
  const [activePhase, setActivePhase] = useState(currentPhase);
  const [activeWeek, setActiveWeek] = useState(currentWeek);
  const [activeTab, setActiveTab] = useState("lessons");

  const currentPhaseData = CURRICULUM_PHASES.find(phase => phase.id === activePhase);
  const phaseProgress = (activeWeek / (currentPhaseData?.duration || 1)) * 100;

  // Mock interactive materials for demonstration
  const mockMaterials = [
    {
      id: 'sentence_builder_1',
      type: 'builder' as const,
      title: 'Sentence Building Blocks',
      description: 'Drag and drop words to create meaningful sentences',
      content: {
        words: ['I', 'You', 'We', 'study', 'play', 'read', 'English', 'books', 'games']
      },
      difficulty: 'easy' as const,
      estimatedTime: 10,
      instructions: [
        'Drag words from the word bank',
        'Drop them in the sentence area',
        'Create a complete sentence',
        'Check your grammar'
      ]
    },
    {
      id: 'pronunciation_1',
      type: 'pronunciation' as const,
      title: 'Pronunciation Practice',
      description: 'Practice speaking English sentences with proper pronunciation',
      content: {
        sentences: ['I study English every day', 'You speak very well', 'We learn together']
      },
      difficulty: 'medium' as const,
      estimatedTime: 15,
      instructions: [
        'Listen to the model sentence',
        'Record yourself speaking',
        'Compare with the model',
        'Try again if needed'
      ]
    },
    {
      id: 'drag_drop_1',
      type: 'drag-drop' as const,
      title: 'Parts of Speech Sorting',
      description: 'Sort words into the correct grammar categories',
      content: {
        items: [
          { id: 'word1', text: 'beautiful', category: 'adjective' },
          { id: 'word2', text: 'run', category: 'verb' },
          { id: 'word3', text: 'quickly', category: 'adverb' }
        ]
      },
      difficulty: 'hard' as const,
      estimatedTime: 12,
      instructions: [
        'Read each word carefully',
        'Identify its part of speech',
        'Drag it to the correct category',
        'Check your understanding'
      ]
    }
  ];

  const getPhaseColor = (phaseId: number) => {
    switch (phaseId) {
      case 1: return "bg-green-100 text-green-800 border-green-300";
      case 2: return "bg-blue-100 text-blue-800 border-blue-300";
      case 3: return "bg-purple-100 text-purple-800 border-purple-300";
      case 4: return "bg-orange-100 text-orange-800 border-orange-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Phase Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Comprehensive Curriculum Manager
          </CardTitle>
          <p className="text-gray-600">
            Complete lesson content system with interactive materials and assessments
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {CURRICULUM_PHASES.map((phase) => (
              <Card
                key={phase.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  activePhase === phase.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setActivePhase(phase.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Badge className={getPhaseColor(phase.id)}>
                      Phase {phase.id}
                    </Badge>
                    <h4 className="font-medium text-sm">{phase.name}</h4>
                    <p className="text-xs text-gray-600">{phase.description}</p>
                    <div className="text-xs text-gray-500">
                      {phase.duration} weeks • {phase.skills.length} skills
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Week Selection for Active Phase */}
          {currentPhaseData && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">
                  Current: {currentPhaseData.name} - Week {activeWeek}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Progress:</span>
                  <Progress value={phaseProgress} className="w-32 h-2" />
                  <span className="text-sm text-gray-600">{Math.round(phaseProgress)}%</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {Array.from({ length: currentPhaseData.duration }, (_, i) => i + 1).map((week) => (
                  <Button
                    key={week}
                    variant={activeWeek === week ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveWeek(week)}
                    className="h-8"
                  >
                    W{week}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="lessons" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Lessons
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-1">
            <Lightbulb className="h-4 w-4" />
            Materials
          </TabsTrigger>
          <TabsTrigger value="sentence" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            Sentence Building
          </TabsTrigger>
          <TabsTrigger value="comprehension" className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            Comprehension
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            Progress
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-6">
          <LessonContentViewer 
            phase={activePhase} 
            week={activeWeek}
            onLessonSelect={(lesson) => console.log('Selected lesson:', lesson)}
          />
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <InteractiveMaterials 
            materials={mockMaterials}
            onComplete={(materialId, score) => {
              console.log(`Material ${materialId} completed with score ${score}`);
            }}
          />
        </TabsContent>

        <TabsContent value="sentence" className="mt-6">
          <SentenceBuildingFramework
            studentLevel={activePhase}
            onTemplateSelect={(template) => console.log('Template selected:', template)}
            completedTemplates={['foundation_1', 'foundation_2']}
          />
        </TabsContent>

        <TabsContent value="comprehension" className="mt-6">
          <RapidComprehensionStrategies
            onStrategySelect={(strategy) => console.log('Strategy selected:', strategy)}
            activeStrategies={['visual_anchoring', 'pattern_games']}
          />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <EnhancedProgressTracker
            studentId={studentId}
            currentPhase={activePhase}
            weekProgress={activeWeek}
            sentenceBuildingLevel={Math.min(activePhase, 4)}
            comprehensionSpeed={120 + (activePhase * 20)}
            skillsMastered={currentPhaseData?.skills.slice(0, activeWeek) || []}
            xpTotal={1250 + (activePhase * 300) + (activeWeek * 50)}
            timeSpentLearning={180 + (activeWeek * 30)}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Curriculum Settings</CardTitle>
              <p className="text-gray-600">Configure curriculum parameters and preferences</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Curriculum Options</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Enable NLP anchors</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Include VAK activities</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked />
                        <span className="text-sm">Track metacognition</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" />
                        <span className="text-sm">Advanced assessment mode</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Export Options</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Current Phase
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Week Plan
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Export Assessment Data
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Curriculum Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="font-bold text-blue-700">96</div>
                      <div className="text-blue-600">Total Lessons</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-700">240+</div>
                      <div className="text-blue-600">Activities</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-700">150+</div>
                      <div className="text-blue-600">Assessments</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-700">80+</div>
                      <div className="text-blue-600">Interactive Materials</div>
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
