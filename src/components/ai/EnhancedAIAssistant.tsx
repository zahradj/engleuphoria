import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  FileText, 
  Puzzle, 
  BookOpen, 
  Brain, 
  Loader2,
  Download,
  Share
} from "lucide-react";
import { useAIIntegration } from "@/hooks/useAIIntegration";
import { useToast } from "@/hooks/use-toast";

export const EnhancedAIAssistant = () => {
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("30");
  const [activeTab, setActiveTab] = useState("generate");
  
  const { 
    isGenerating, 
    generatedContent, 
    generateWorksheet, 
    generateActivity, 
    generateLessonPlan,
    clearContent 
  } = useAIIntegration();
  
  const { toast } = useToast();

  const levels = [
    { value: "beginner", label: "Beginner (A1-A2)" },
    { value: "intermediate", label: "Intermediate (B1-B2)" },
    { value: "advanced", label: "Advanced (C1-C2)" }
  ];

  const handleGenerate = async (type: 'worksheet' | 'activity' | 'lesson_plan') => {
    if (!topic || !level) {
      toast({
        title: "Missing Information",
        description: "Please provide a topic and select a level.",
        variant: "destructive"
      });
      return;
    }

    switch (type) {
      case 'worksheet':
        await generateWorksheet(topic, level);
        break;
      case 'activity':
        await generateActivity(topic, level, parseInt(duration));
        break;
      case 'lesson_plan':
        await generateLessonPlan(topic, level, parseInt(duration));
        break;
    }

    setActiveTab("library");
  };

  const handleDownload = (content: any) => {
    const dataStr = JSON.stringify(content, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${content.title}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="h-6 w-6 text-purple-600" />
        <h2 className="text-2xl font-bold text-gray-800">Enhanced AI Assistant</h2>
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">Powered by AI</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Content</TabsTrigger>
          <TabsTrigger value="library">Content Library ({generatedContent.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Content Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                AI Content Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Animals, Food, Travel"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select value={level} onValueChange={setLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
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
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleGenerate('worksheet')}
                  disabled={isGenerating}
                  className="h-20 flex flex-col items-center gap-2"
                >
                  {isGenerating ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <FileText className="h-6 w-6" />
                  )}
                  Generate Worksheet
                </Button>

                <Button
                  onClick={() => handleGenerate('activity')}
                  disabled={isGenerating}
                  className="h-20 flex flex-col items-center gap-2"
                  variant="outline"
                >
                  {isGenerating ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Puzzle className="h-6 w-6" />
                  )}
                  Generate Activity
                </Button>

                <Button
                  onClick={() => handleGenerate('lesson_plan')}
                  disabled={isGenerating}
                  className="h-20 flex flex-col items-center gap-2"
                  variant="outline"
                >
                  {isGenerating ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <BookOpen className="h-6 w-6" />
                  )}
                  Generate Lesson Plan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI Features Overview */}
          <Card>
            <CardHeader>
              <CardTitle>AI Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Smart Content Generation</h4>
                  <p className="text-sm text-blue-600">
                    Automatically creates level-appropriate worksheets, activities, and lesson plans 
                    tailored to your students' needs.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Curriculum Alignment</h4>
                  <p className="text-sm text-green-600">
                    Content is generated following educational standards and best practices 
                    for language learning.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Instant Adaptation</h4>
                  <p className="text-sm text-purple-600">
                    Quickly modify difficulty levels and topics based on real-time 
                    student feedback and performance.
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Multi-Format Output</h4>
                  <p className="text-sm text-orange-600">
                    Generate content in various formats: interactive exercises, 
                    printable worksheets, and digital activities.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Generated Content Library</h3>
            {generatedContent.length > 0 && (
              <Button variant="outline" onClick={clearContent}>
                Clear All
              </Button>
            )}
          </div>

          {generatedContent.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No content generated yet. Create your first AI-generated content!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedContent.map((content) => (
                <Card key={content.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{content.title}</CardTitle>
                      <Badge variant="outline">{content.type.replace('_', ' ')}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <p className="text-xs text-gray-600">Topic: {content.metadata.topic}</p>
                      <p className="text-xs text-gray-600">Level: {content.metadata.level}</p>
                      <p className="text-xs text-gray-600">
                        Generated: {content.metadata.generatedAt.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(content)}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
