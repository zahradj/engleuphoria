
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CURRICULUM_PHASES } from "@/data/curriculumPhases";
import { SentenceBuildingFramework } from "./SentenceBuildingFramework";
import { RapidComprehensionStrategies } from "./RapidComprehensionStrategies";
import { EnhancedProgressTracker } from "./EnhancedProgressTracker";
import { BookOpen, Layers, Zap, BarChart3, Settings } from "lucide-react";

interface CurriculumPhaseManagerProps {
  studentId: string;
  currentPhase: number;
  onPhaseChange: (newPhase: number) => void;
}

export function CurriculumPhaseManager({ 
  studentId, 
  currentPhase, 
  onPhaseChange 
}: CurriculumPhaseManagerProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'sentences' | 'comprehension' | 'progress'>('overview');
  
  // Mock student data - in real app, this would come from props or API
  const studentData = {
    weekProgress: 2,
    sentenceBuildingLevel: currentPhase,
    comprehensionSpeed: 120,
    skillsMastered: ['Subject-Verb construction', 'Basic word order', 'Present simple'],
    xpTotal: 1250,
    timeSpentLearning: 180,
    completedTemplates: ['foundation_1', 'foundation_2'],
    activeStrategies: ['visual_anchoring', 'pattern_games']
  };

  const getPhaseDescription = (phase: number) => {
    const phaseData = CURRICULUM_PHASES.find(p => p.id === phase);
    return phaseData ? `${phaseData.name}: ${phaseData.description}` : 'Unknown Phase';
  };

  const getPhaseColor = (phaseId: number, isCurrent: boolean) => {
    const baseColors = {
      1: isCurrent ? "bg-green-500 text-white" : "bg-green-100 text-green-800",
      2: isCurrent ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-800", 
      3: isCurrent ? "bg-purple-500 text-white" : "bg-purple-100 text-purple-800",
      4: isCurrent ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-800"
    };
    return baseColors[phaseId] || "bg-gray-100 text-gray-800";
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sentences':
        return (
          <SentenceBuildingFramework 
            studentLevel={currentPhase}
            onTemplateSelect={(template) => console.log('Selected template:', template)}
            completedTemplates={studentData.completedTemplates}
          />
        );
      case 'comprehension':
        return (
          <RapidComprehensionStrategies 
            onStrategySelect={(strategy) => console.log('Selected strategy:', strategy)}
            activeStrategies={studentData.activeStrategies}
          />
        );
      case 'progress':
        return (
          <EnhancedProgressTracker 
            studentId={studentId}
            currentPhase={currentPhase}
            weekProgress={studentData.weekProgress}
            sentenceBuildingLevel={studentData.sentenceBuildingLevel}
            comprehensionSpeed={studentData.comprehensionSpeed}
            skillsMastered={studentData.skillsMastered}
            xpTotal={studentData.xpTotal}
            timeSpentLearning={studentData.timeSpentLearning}
          />
        );
      default:
        return (
          <div className="space-y-6">
            {/* Phase Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Curriculum Phase Overview</CardTitle>
                <p className="text-sm text-gray-600">
                  Systematic progression through enhanced English learning phases
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {CURRICULUM_PHASES.map((phase) => (
                    <Card 
                      key={phase.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        phase.id === currentPhase ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => onPhaseChange(phase.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge className={getPhaseColor(phase.id, phase.id === currentPhase)}>
                              Phase {phase.id}
                            </Badge>
                            {phase.id === currentPhase && (
                              <Badge variant="outline" className="text-xs">Current</Badge>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm">{phase.name}</h4>
                            <p className="text-xs text-gray-600 mt-1">{phase.description}</p>
                          </div>
                          
                          <div className="text-xs text-gray-500">
                            <div>Duration: {phase.duration} weeks</div>
                            <div>Focus: {phase.focus}</div>
                          </div>
                          
                          <div className="flex flex-wrap gap-1">
                            {phase.skills.slice(0, 2).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {phase.skills.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{phase.skills.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Phase Details */}
            <Card>
              <CardHeader>
                <CardTitle>Current Phase: {getPhaseDescription(currentPhase)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">Week {studentData.weekProgress}</div>
                      <div className="text-sm text-gray-600">Current Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{studentData.skillsMastered.length}</div>
                      <div className="text-sm text-gray-600">Skills Mastered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{studentData.xpTotal}</div>
                      <div className="text-sm text-gray-600">XP Earned</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Phase Objectives</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {CURRICULUM_PHASES.find(p => p.id === currentPhase)?.skills.map((skill, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            studentData.skillsMastered.includes(skill) ? 'bg-green-500' : 'bg-gray-300'
                          }`}></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveTab('overview')}
              className="flex items-center gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Overview
            </Button>
            <Button
              variant={activeTab === 'sentences' ? 'default' : 'outline'}
              onClick={() => setActiveTab('sentences')}
              className="flex items-center gap-2"
            >
              <Layers className="h-4 w-4" />
              Sentence Building
            </Button>
            <Button
              variant={activeTab === 'comprehension' ? 'default' : 'outline'}
              onClick={() => setActiveTab('comprehension')}
              className="flex items-center gap-2"
            >
              <Zap className="h-4 w-4" />
              Comprehension
            </Button>
            <Button
              variant={activeTab === 'progress' ? 'default' : 'outline'}
              onClick={() => setActiveTab('progress')}
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Progress
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
