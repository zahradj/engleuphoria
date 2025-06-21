
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  FileText, 
  Gamepad2,
  BookOpen,
  Brain,
  Download,
  Copy,
  Loader2,
  AlertCircle,
  Library
} from "lucide-react";
import { useUnifiedAIContent } from "@/hooks/useUnifiedAIContent";
import { AIContentRequest } from "@/services/unifiedAIContentService";

interface UnifiedAIWorksheetGeneratorProps {
  onContentGenerated?: (content: any) => void;
  onInsertToWhiteboard?: (content: string) => void;
}

export function UnifiedAIWorksheetGenerator({ 
  onContentGenerated, 
  onInsertToWhiteboard 
}: UnifiedAIWorksheetGeneratorProps) {
  const [activeTab, setActiveTab] = useState<'generate' | 'library'>('generate');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [contentType, setContentType] = useState<'worksheet' | 'activity' | 'lesson_plan' | 'quiz' | 'flashcards'>('worksheet');
  const [duration, setDuration] = useState('30');
  const [specificRequirements, setSpecificRequirements] = useState('');
  const [learningObjectives, setLearningObjectives] = useState<string[]>([]);
  const [newObjective, setNewObjective] = useState('');

  const {
    isGenerating,
    contentLibrary,
    generateContent,
    clearContentLibrary,
    exportContent,
    isDemoMode
  } = useUnifiedAIContent();

  const contentTypes = [
    { value: 'worksheet', label: 'Worksheet', icon: FileText, description: 'Practice exercises and activities' },
    { value: 'activity', label: 'Interactive Activity', icon: Gamepad2, description: 'Engaging classroom activities' },
    { value: 'lesson_plan', label: 'Lesson Plan', icon: BookOpen, description: 'Complete lesson structure' },
    { value: 'quiz', label: 'Quiz', icon: Brain, description: 'Assessment questions' },
    { value: 'flashcards', label: 'Flashcards', icon: Library, description: 'Vocabulary cards' }
  ];

  const levels = [
    { value: 'beginner', label: 'Beginner (A1-A2)' },
    { value: 'intermediate', label: 'Intermediate (B1-B2)' },
    { value: 'advanced', label: 'Advanced (C1-C2)' }
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      return;
    }

    const request: AIContentRequest = {
      type: contentType,
      topic: topic.trim(),
      level,
      duration: parseInt(duration),
      specificRequirements: specificRequirements || undefined,
      learningObjectives: learningObjectives.length > 0 ? learningObjectives : undefined
    };

    const result = await generateContent(request);
    if (result && onContentGenerated) {
      onContentGenerated(result);
    }

    setActiveTab('library');
  };

  const addLearningObjective = () => {
    if (newObjective.trim() && !learningObjectives.includes(newObjective.trim())) {
      setLearningObjectives([...learningObjectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const removeLearningObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const insertToWhiteboard = (content: string) => {
    if (onInsertToWhiteboard) {
      onInsertToWhiteboard(content);
    }
  };

  const selectedContentType = contentTypes.find(type => type.value === contentType);

  return (
    <div className="h-full flex flex-col bg-white rounded-lg">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-600" size={24} />
          <h2 className="text-xl font-semibold">AI Content Generator</h2>
          {isDemoMode && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
              Demo Mode
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="px-4 pt-4 flex-shrink-0">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate" onClick={() => setActiveTab('generate')} className="flex items-center gap-2">
              <Sparkles size={16} />
              Generate
            </TabsTrigger>
            <TabsTrigger value="library" onClick={() => setActiveTab('library')} className="flex items-center gap-2">
              <Library size={16} />
              Library ({contentLibrary.length})
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="flex-1 min-h-0 p-4">
          {activeTab === 'generate' && (
            <div className="h-full overflow-y-auto">
              <div className="space-y-4">
                {isDemoMode && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-700">
                        <p className="font-medium">Demo Mode Active</p>
                        <p>Generated content will be enhanced mock data. Connect to Supabase for AI-powered generation.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Content Type Selection */}
                <div>
                  <Label className="text-sm font-medium">Content Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {contentTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <Button
                          key={type.value}
                          variant={contentType === type.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setContentType(type.value as any)}
                          className="h-auto p-3 flex flex-col items-center text-xs"
                        >
                          <IconComponent size={16} className="mb-1" />
                          <span className="font-medium">{type.label}</span>
                        </Button>
                      );
                    })}
                  </div>
                  {selectedContentType && (
                    <p className="text-xs text-gray-600 mt-1">{selectedContentType.description}</p>
                  )}
                </div>

                {/* Topic and Level */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="topic">Topic *</Label>
                    <Input
                      id="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Animals, Food, Travel"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Level *</Label>
                    <Select value={level} onValueChange={(value) => setLevel(value as any)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map((levelOption) => (
                          <SelectItem key={levelOption.value} value={levelOption.value}>
                            {levelOption.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="10"
                    max="120"
                  />
                </div>

                {/* Learning Objectives */}
                <div>
                  <Label>Learning Objectives</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={newObjective}
                      onChange={(e) => setNewObjective(e.target.value)}
                      placeholder="Add learning objective..."
                      onKeyPress={(e) => e.key === 'Enter' && addLearningObjective()}
                    />
                    <Button size="sm" onClick={addLearningObjective}>Add</Button>
                  </div>
                  {learningObjectives.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {learningObjectives.map((objective, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer"
                          onClick={() => removeLearningObjective(index)}
                        >
                          {objective} ×
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Specific Requirements */}
                <div>
                  <Label htmlFor="requirements">Specific Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={specificRequirements}
                    onChange={(e) => setSpecificRequirements(e.target.value)}
                    placeholder="Any specific requirements or focus areas..."
                    rows={3}
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Generating {selectedContentType?.label}...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="mr-2" />
                      Generate {selectedContentType?.label}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="font-medium">Generated Content</h3>
                {contentLibrary.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearContentLibrary}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto">
                {contentLibrary.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center py-12 text-gray-500">
                      <Sparkles size={48} className="mx-auto mb-3 text-gray-300" />
                      <p className="font-medium">No content generated yet</p>
                      <p className="text-sm">Switch to Generate tab to create your first content</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contentLibrary.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">
                                  {item.type.replace('_', ' ')}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.level}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {item.duration}min
                                </Badge>
                                {item.metadata.isMockData && (
                                  <Badge variant="outline" className="text-xs text-yellow-600">
                                    Mock
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-50 p-3 rounded text-xs max-h-32 overflow-y-auto">
                            <pre className="whitespace-pre-wrap font-mono text-xs">
                              {item.content.substring(0, 200)}...
                            </pre>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyToClipboard(item.content)}
                            >
                              <Copy size={12} className="mr-1" />
                              Copy
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => insertToWhiteboard(item.content)}
                            >
                              <FileText size={12} className="mr-1" />
                              To Board
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => exportContent(item)}
                            >
                              <Download size={12} className="mr-1" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
