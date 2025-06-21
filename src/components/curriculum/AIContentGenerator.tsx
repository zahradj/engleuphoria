
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Wand2, FileText, Video, Music, Gamepad2, BookOpen, Download } from "lucide-react";

interface AIContentGeneratorProps {
  onContentGenerated: () => void;
}

export function AIContentGenerator({ onContentGenerated }: AIContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [formData, setFormData] = useState({
    contentType: "worksheet",
    cefrLevel: "A1",
    ageGroup: "6-9",
    topic: "",
    theme: "",
    duration: "30",
    difficulty: "1",
    skillFocus: [] as string[],
    specificRequirements: ""
  });

  const { toast } = useToast();

  const contentTypes = [
    { value: "worksheet", label: "Worksheet", icon: FileText },
    { value: "activity", label: "Interactive Activity", icon: Gamepad2 },
    { value: "lesson_plan", label: "Lesson Plan", icon: BookOpen },
    { value: "video_script", label: "Video Script", icon: Video },
    { value: "audio_exercise", label: "Audio Exercise", icon: Music },
    { value: "assessment", label: "Assessment", icon: FileText },
    { value: "story", label: "Story/Reading", icon: BookOpen },
    { value: "song", label: "Educational Song", icon: Music }
  ];

  const cefrLevels = [
    { value: "Pre-A1", label: "Pre-A1 (Starter)" },
    { value: "A1", label: "A1 (Beginner)" },
    { value: "A1+", label: "A1+ (High Beginner)" },
    { value: "A2", label: "A2 (Elementary)" },
    { value: "A2+", label: "A2+ (High Elementary)" },
    { value: "B1", label: "B1 (Intermediate)" },
    { value: "B1+", label: "B1+ (High Intermediate)" },
    { value: "B2", label: "B2 (Upper Intermediate)" }
  ];

  const ageGroups = [
    { value: "4-7", label: "Young Learners (4-7 years)" },
    { value: "6-9", label: "Elementary (6-9 years)" },
    { value: "8-11", label: "Elementary (8-11 years)" },
    { value: "10-13", label: "Pre-Teen (10-13 years)" },
    { value: "12-15", label: "Teen (12-15 years)" },
    { value: "14-17", label: "Teen (14-17 years)" },
    { value: "16+", label: "Teen+ (16+ years)" }
  ];

  const skillCategories = [
    "vocabulary", "grammar", "listening", "speaking", 
    "reading", "writing", "pronunciation", "games"
  ];

  const popularTopics = [
    "Animals", "Family", "Food", "Colors", "Numbers", "School", "Home", 
    "Sports", "Weather", "Hobbies", "Travel", "Shopping", "Health", "Technology"
  ];

  const handleSkillToggle = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skillFocus: prev.skillFocus.includes(skill)
        ? prev.skillFocus.filter(s => s !== skill)
        : [...prev.skillFocus, skill]
    }));
  };

  const generateAIContent = async () => {
    if (!formData.topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please provide a topic for content generation.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      // Simulate AI content generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const mockGeneratedContent = {
        id: `ai_${Date.now()}`,
        title: `${formData.contentType} about ${formData.topic}`,
        description: `AI-generated ${formData.contentType} for ${formData.cefrLevel} level students`,
        type: formData.contentType,
        cefrLevel: formData.cefrLevel,
        ageGroup: formData.ageGroup,
        skillFocus: formData.skillFocus,
        duration: parseInt(formData.duration),
        difficulty: parseInt(formData.difficulty),
        content: generateMockContent(),
        createdAt: new Date(),
        isAIGenerated: true,
        tags: [formData.topic, formData.theme, "ai-generated"].filter(Boolean)
      };

      setGeneratedContent(mockGeneratedContent);

      toast({
        title: "Content generated successfully!",
        description: `Created ${formData.contentType} for ${formData.cefrLevel} level students.`,
      });

      onContentGenerated();
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockContent = () => {
    switch (formData.contentType) {
      case "worksheet":
        return {
          exercises: [
            {
              type: "fill_in_blank",
              instruction: `Complete the sentences about ${formData.topic}`,
              questions: [
                { text: "The ___ is big.", answer: "elephant" },
                { text: "I like to eat ___.", answer: "apples" }
              ]
            },
            {
              type: "matching",
              instruction: "Match the words with pictures",
              pairs: [
                { word: formData.topic, image: "image1.png" }
              ]
            }
          ]
        };
      case "lesson_plan":
        return {
          objective: `Students will learn vocabulary related to ${formData.topic}`,
          warmUp: "Greeting song and topic introduction",
          presentation: `Introduce new ${formData.topic} vocabulary with visual aids`,
          practice: "Guided practice activities",
          production: "Students create their own sentences",
          wrapUp: "Review and homework assignment"
        };
      case "story":
        return {
          title: `The Adventure of ${formData.topic}`,
          content: `Once upon a time, there was a magical ${formData.topic}...`,
          vocabulary: ["adventure", "magical", "discover"],
          comprehensionQuestions: [
            "What was magical about the story?",
            "What did the character discover?"
          ]
        };
      default:
        return { content: `Generated ${formData.contentType} content about ${formData.topic}` };
    }
  };

  const saveContent = () => {
    if (!generatedContent) return;

    // In a real app, this would save to the curriculum database
    toast({
      title: "Content saved!",
      description: "The generated content has been added to your curriculum library.",
    });

    // Reset form
    setGeneratedContent(null);
    setFormData({
      contentType: "worksheet",
      cefrLevel: "A1",
      ageGroup: "6-9",
      topic: "",
      theme: "",
      duration: "30",
      difficulty: "1",
      skillFocus: [],
      specificRequirements: ""
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles size={20} />
            AI Content Generator
          </CardTitle>
          <p className="text-gray-600">
            Generate age-appropriate ESL content using AI, tailored to specific CEFR levels and learning objectives.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Content Configuration */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="contentType">Content Type</Label>
                <Select 
                  value={formData.contentType} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, contentType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cefrLevel">CEFR Level</Label>
                  <Select 
                    value={formData.cefrLevel} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, cefrLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cefrLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="ageGroup">Age Group</Label>
                  <Select 
                    value={formData.ageGroup} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, ageGroup: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ageGroups.map((group) => (
                        <SelectItem key={group.value} value={group.value}>
                          {group.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="topic">Main Topic *</Label>
                <Input
                  id="topic"
                  value={formData.topic}
                  onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="e.g., Animals, Family, Food"
                />
                <div className="flex gap-2 mt-2 flex-wrap">
                  {popularTopics.slice(0, 6).map((topic) => (
                    <Badge
                      key={topic}
                      variant="outline"
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => setFormData(prev => ({ ...prev, topic }))}
                    >
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="theme">Theme (Optional)</Label>
                <Input
                  id="theme"
                  value={formData.theme}
                  onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
                  placeholder="e.g., Christmas, Summer vacation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    min="5"
                    max="120"
                  />
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty (1-5)</Label>
                  <Select 
                    value={formData.difficulty} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((level) => (
                        <SelectItem key={level} value={level.toString()}>
                          {level} - {['Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard'][level - 1]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Skills and Requirements */}
            <div className="space-y-4">
              <div>
                <Label>Skills Focus</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {skillCategories.map((skill) => (
                    <Badge
                      key={skill}
                      variant={formData.skillFocus.includes(skill) ? "default" : "outline"}
                      className="cursor-pointer justify-center py-2"
                      onClick={() => handleSkillToggle(skill)}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="requirements">Specific Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.specificRequirements}
                  onChange={(e) => setFormData(prev => ({ ...prev, specificRequirements: e.target.value }))}
                  placeholder="Any specific instructions, learning objectives, or constraints..."
                  rows={4}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Generation Preview</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p><strong>Type:</strong> {contentTypes.find(t => t.value === formData.contentType)?.label}</p>
                  <p><strong>Level:</strong> {formData.cefrLevel} for {formData.ageGroup}</p>
                  <p><strong>Topic:</strong> {formData.topic || "Not specified"}</p>
                  <p><strong>Skills:</strong> {formData.skillFocus.join(", ") || "None selected"}</p>
                  <p><strong>Duration:</strong> {formData.duration} minutes</p>
                </div>
              </div>

              <Button 
                onClick={generateAIContent} 
                disabled={isGenerating || !formData.topic.trim()}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="mr-2 h-4 w-4 animate-pulse" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate AI Content
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Content Preview */}
      {generatedContent && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Sparkles size={20} />
              Generated Content Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{generatedContent.title}</h3>
                <p className="text-gray-600 mb-4">{generatedContent.description}</p>
                
                <div className="flex gap-2 mb-4">
                  <Badge variant="default">{generatedContent.type}</Badge>
                  <Badge variant="outline">{generatedContent.cefrLevel}</Badge>
                  <Badge variant="outline">{generatedContent.ageGroup}</Badge>
                  <Badge variant="secondary">AI Generated</Badge>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h4 className="font-medium mb-2">Content Structure:</h4>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(generatedContent.content, null, 2)}
                </pre>
              </div>

              <div className="flex gap-3">
                <Button onClick={saveContent} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Save to Library
                </Button>
                <Button variant="outline" onClick={() => setGeneratedContent(null)}>
                  Generate Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
