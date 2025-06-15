
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Sparkles, 
  FileText, 
  Puzzle, 
  BookOpen, 
  Loader2 
} from "lucide-react";

interface ContentGenerationTabProps {
  topic: string;
  setTopic: (value: string) => void;
  level: string;
  setLevel: (value: string) => void;
  duration: string;
  setDuration: (value: string) => void;
  levels: Array<{ value: string; label: string }>;
  isGenerating: boolean;
  onGenerate: (type: 'worksheet' | 'activity' | 'lesson_plan') => void;
}

export const ContentGenerationTab = ({
  topic,
  setTopic,
  level,
  setLevel,
  duration,
  setDuration,
  levels,
  isGenerating,
  onGenerate
}: ContentGenerationTabProps) => {
  return (
    <div className="space-y-6">
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
              onClick={() => onGenerate('worksheet')}
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
              onClick={() => onGenerate('activity')}
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
              onClick={() => onGenerate('lesson_plan')}
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
    </div>
  );
};
