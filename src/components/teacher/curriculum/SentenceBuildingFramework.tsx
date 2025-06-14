
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
      case 1: return "bg-green-100 text-green-800 border-green-300";
      case 2: return "bg-blue-100 text-blue-800 border-blue-300";
      case 3: return "bg-purple-100 text-purple-800 border-purple-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Blocks className="h-5 w-5 text-blue-600" />
            Systematic Sentence Building Framework
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress: {completedTemplates.length}/{availableTemplates.length} templates mastered</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
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
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isSelected ? 'ring-2 ring-blue-500' : ''
                  } ${isCompleted ? 'bg-green-50' : ''}`}
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
                        <h4 className="font-medium text-gray-900 mb-1">
                          {template.pattern}
                        </h4>
                        <p className="text-sm text-gray-600 italic">
                          "{template.example}"
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="h-3 w-3" />
                        {template.visualAid}
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        {template.practiceExercises.length} practice exercises
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Template Details: {selectedTemplate.pattern}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Example Sentence</h4>
                <p className="text-lg italic text-blue-700 bg-blue-50 p-3 rounded-lg">
                  "{selectedTemplate.example}"
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Visual Learning Aid</h4>
                <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
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
