
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SENTENCE_TEMPLATES, SentenceTemplate } from "@/services/enhancedCurriculumService";
import { Blocks, Eye, Target, CheckCircle, ArrowRight } from "lucide-react";

interface SentenceBuildingFrameworkProps {
  studentLevel: number;
  onTemplateSelect: (template: SentenceTemplate) => void;
  completedTemplates?: string[];
}

export function SentenceBuildingFramework({ 
  studentLevel, 
  onTemplateSelect,
  completedTemplates = []
}: SentenceBuildingFrameworkProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<SentenceTemplate | null>(null);
  
  const availableTemplates = SENTENCE_TEMPLATES.filter(template => template.level <= studentLevel);
  const progressPercentage = (completedTemplates.length / availableTemplates.length) * 100;

  const handleTemplateClick = (template: SentenceTemplate) => {
    setSelectedTemplate(template);
    onTemplateSelect(template);
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-gradient-to-r from-green-100 to-green-50 text-green-800 border-green-300";
      case 2: return "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-blue-300";
      case 3: return "bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border-purple-300";
      default: return "bg-gradient-to-r from-gray-100 to-gray-50 text-gray-800 border-gray-300";
    }
  };

  const getLevelName = (level: number) => {
    switch (level) {
      case 1: return "Foundation";
      case 2: return "Enhanced";
      case 3: return "Complex";
      default: return "Basic";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-blue-950/50 border-purple-200/50 dark:border-purple-700/50 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
            <Blocks className="h-5 w-5 text-purple-600" />
            🔤 Systematic Sentence Building Framework
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-purple-700 dark:text-purple-300">
              <span>✨ Progress: {completedTemplates.length}/{availableTemplates.length} templates mastered</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2 bg-purple-100 dark:bg-purple-900/50" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableTemplates.map((template) => {
              const isCompleted = completedTemplates.includes(template.id);
              const isSelected = selectedTemplate?.id === template.id;
              
              return (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    isSelected ? 'ring-2 ring-purple-500 shadow-lg' : ''
                  } ${isCompleted ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30' : 'bg-white dark:bg-gray-900'}`}
                  onClick={() => handleTemplateClick(template)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getLevelColor(template.level)}>
                          {getLevelName(template.level)} Level
                        </Badge>
                        {isCompleted && <CheckCircle className="h-4 w-4 text-green-600" />}
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-1">
                          {template.pattern}
                        </h4>
                        <p className="text-sm text-purple-600 dark:text-purple-400 italic">
                          💬 "{template.example}"
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-purple-500 dark:text-purple-400">
                        <Eye className="h-3 w-3" />
                        {template.visualAid}
                      </div>
                      
                      <div className="text-xs text-purple-500 dark:text-purple-400">
                        📝 {template.practiceExercises.length} practice exercises
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {selectedTemplate && (
        <Card className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-blue-950/50 border-purple-200/50 dark:border-purple-700/50 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
              <Target className="h-5 w-5 text-purple-600" />
              🎯 Template Details: {selectedTemplate.pattern}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">💬 Example Sentence</h4>
                <p className="text-lg italic text-blue-700 dark:text-blue-300 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/50 dark:to-blue-800/50 p-3 rounded-lg border border-blue-200/50">
                  "{selectedTemplate.example}"
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">👁️ Visual Learning Aid</h4>
                <p className="text-sm text-purple-600 dark:text-purple-300 bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/50 dark:to-yellow-800/50 p-3 rounded-lg border border-yellow-200/50">
                  {selectedTemplate.visualAid}
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Practice Exercises</h4>
                <div className="space-y-2">
                  {selectedTemplate.practiceExercises.map((exercise, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                      {exercise}
                    </div>
                  ))}
                </div>
              </div>
              
              <Button className="w-full">
                Start Practice Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
