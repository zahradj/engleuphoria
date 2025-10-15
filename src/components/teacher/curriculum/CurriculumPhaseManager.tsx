
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
            <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-blue-950/50 border-purple-200/50 dark:border-purple-700/50 shadow-md">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">📚 Curriculum Phase Overview</CardTitle>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  ✨ Systematic progression through enhanced English learning phases
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {CURRICULUM_PHASES.map((phase) => (
                    <Card 
                      key={phase.id}
                      className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 bg-white dark:bg-gray-900 ${
                        phase.id === currentPhase ? 'ring-2 ring-purple-500 shadow-lg' : ''
                      }`}
                      onClick={() => onPhaseChange(phase.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge className={getPhaseColor(phase.id, phase.id === currentPhase)}>
                              🎯 Phase {phase.id}
                            </Badge>
                            {phase.id === currentPhase && (
                              <Badge variant="outline" className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-300">⭐ Current</Badge>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-sm text-purple-900 dark:text-purple-100">{phase.name}</h4>
                            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">{phase.description}</p>
                          </div>
                          
                          <div className="text-xs text-purple-500 dark:text-purple-400">
                            <div>⏱️ Duration: {phase.duration} weeks</div>
                            <div>🎯 Focus: {phase.focus}</div>
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
            <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-blue-950/50 border-purple-200/50 dark:border-purple-700/50 shadow-md">
              <CardHeader>
                <CardTitle className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">🎯 Current Phase: {getPhaseDescription(currentPhase)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">📅 Week {studentData.weekProgress}</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Current Week</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">✅ {studentData.skillsMastered.length}</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">Skills Mastered</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">⭐ {studentData.xpTotal}</div>
                      <div className="text-sm text-purple-600 dark:text-purple-400">XP Earned</div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 dark:from-purple-900/50 dark:via-pink-900/50 dark:to-blue-900/50 p-4 rounded-lg border border-purple-200/50">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">🎯 Phase Objectives</h4>
                    <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                      {CURRICULUM_PHASES.find(p => p.id === currentPhase)?.skills.map((skill, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            studentData.skillsMastered.includes(skill) ? 'bg-green-500' : 'bg-purple-300'
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
      <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-blue-950/50 border-purple-200/50 dark:border-purple-700/50 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === 'overview' ? 'default' : 'outline'}
              onClick={() => setActiveTab('overview')}
              className={activeTab === 'overview' ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-md flex items-center gap-2' : 'text-purple-600 border-purple-300 hover:bg-purple-100/50 dark:text-purple-400 dark:border-purple-700 flex items-center gap-2'}
            >
              <BookOpen className="h-4 w-4" />
              📚 Overview
            </Button>
            <Button
              variant={activeTab === 'sentences' ? 'default' : 'outline'}
              onClick={() => setActiveTab('sentences')}
              className={activeTab === 'sentences' ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-md flex items-center gap-2' : 'text-purple-600 border-purple-300 hover:bg-purple-100/50 dark:text-purple-400 dark:border-purple-700 flex items-center gap-2'}
            >
              <Layers className="h-4 w-4" />
              🔤 Sentence Building
            </Button>
            <Button
              variant={activeTab === 'comprehension' ? 'default' : 'outline'}
              onClick={() => setActiveTab('comprehension')}
              className={activeTab === 'comprehension' ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-md flex items-center gap-2' : 'text-purple-600 border-purple-300 hover:bg-purple-100/50 dark:text-purple-400 dark:border-purple-700 flex items-center gap-2'}
            >
              <Zap className="h-4 w-4" />
              ⚡ Comprehension
            </Button>
            <Button
              variant={activeTab === 'progress' ? 'default' : 'outline'}
              onClick={() => setActiveTab('progress')}
              className={activeTab === 'progress' ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-md flex items-center gap-2' : 'text-purple-600 border-purple-300 hover:bg-purple-100/50 dark:text-purple-400 dark:border-purple-700 flex items-center gap-2'}
            >
              <BarChart3 className="h-4 w-4" />
              📊 Progress
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}
