
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { eslCurriculumService } from "@/services/eslCurriculumService";
import { AITemplate, ESLMaterial } from "@/types/eslCurriculum";
import { Sparkles, Loader2, FileText, Users, Clock, Zap, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ESLAIGeneratorProps {
  onContentGenerated: () => void;
}

export function ESLAIGenerator({ onContentGenerated }: ESLAIGeneratorProps) {
  const { toast } = useToast();
  const [templates] = useState<AITemplate[]>(eslCurriculumService.getAITemplates());
  const [selectedTemplate, setSelectedTemplate] = useState<AITemplate | null>(null);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMaterials, setGeneratedMaterials] = useState<ESLMaterial[]>([]);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setSelectedTemplate(template || null);
    setParameters({});
  };

  const handleParameterChange = (paramName: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const validateParameters = (): boolean => {
    if (!selectedTemplate) return false;
    
    for (const param of selectedTemplate.parameters) {
      if (param.required && (!parameters[param.name] && !param.defaultValue)) {
        toast({
          title: "Missing Parameter",
          description: `Please provide a value for ${param.name}`,
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !validateParameters()) return;

    setIsGenerating(true);
    try {
      const material = await eslCurriculumService.generateAIContent(
        selectedTemplate.id, 
        parameters
      );
      
      setGeneratedMaterials(prev => [material, ...prev]);
      onContentGenerated();
      
      toast({
        title: "Content Generated Successfully!",
        description: `Created "${material.title}" with ${material.xpReward} XP reward`,
      });
      
      // Reset form
      setSelectedTemplate(null);
      setParameters({});
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getTemplateIcon = (type: string) => {
    const icons = {
      'worksheet': FileText,
      'activity': Users,
      'quiz': BookOpen,
      'lesson_plan': BookOpen,
      'dialogue': Users
    };
    return icons[type] || FileText;
  };

  return (
    <div className="space-y-6">
      {/* AI Templates Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            AI Content Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => {
              const Icon = getTemplateIcon(template.type);
              return (
                <Card 
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedTemplate?.id === template.id ? 'ring-2 ring-purple-500 bg-purple-50' : ''
                  }`}
                  onClick={() => handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-5 w-5 text-purple-600" />
                      <Badge variant="outline" className="capitalize">
                        {template.type.replace('_', ' ')}
                      </Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{template.name}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {template.estimatedGenerationTime}s
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        {template.parameters.length} params
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Parameter Configuration */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Configure {selectedTemplate.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedTemplate.parameters.map((param) => (
              <div key={param.name} className="space-y-2">
                <Label htmlFor={param.name} className="flex items-center gap-2">
                  {param.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {param.required && <span className="text-red-500">*</span>}
                </Label>
                
                {param.type === 'text' && (
                  <Input
                    id={param.name}
                    placeholder={param.description}
                    value={parameters[param.name] || ''}
                    onChange={(e) => handleParameterChange(param.name, e.target.value)}
                  />
                )}
                
                {param.type === 'select' && param.options && (
                  <Select 
                    value={parameters[param.name] || ''} 
                    onValueChange={(value) => handleParameterChange(param.name, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={param.description} />
                    </SelectTrigger>
                    <SelectContent>
                      {param.options.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                {param.type === 'number' && (
                  <Input
                    id={param.name}
                    type="number"
                    placeholder={param.description}
                    value={parameters[param.name] || param.defaultValue || ''}
                    onChange={(e) => handleParameterChange(param.name, parseInt(e.target.value))}
                  />
                )}
                
                <p className="text-xs text-gray-500">{param.description}</p>
              </div>
            ))}
            
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating... ({selectedTemplate.estimatedGenerationTime}s)
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Generated Materials */}
      {generatedMaterials.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Generated Materials</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedMaterials.slice(0, 5).map((material) => (
                <Card key={material.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{material.title}</h4>
                        <p className="text-xs text-gray-600">{material.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {material.level.cefrLevel}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            +{material.xpReward} XP
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {material.duration} min
                          </span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      Use Material
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
