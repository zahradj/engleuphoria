import React, { useState, useEffect } from 'react';
import { useUnifiedAIContent } from '@/hooks/useUnifiedAIContent';
import { AIContentRequest } from '@/services/ai/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles, BookOpen, Download, Trash2, Eye } from 'lucide-react';
import { PhonicsLessonCard } from './phonics/PhonicsLessonCard';
import { PhonicsLessonViewer } from './phonics/PhonicsLessonViewer';
import { ContentLibraryItem } from '@/services/ai/types';

export const PhonicsLibraryManager = () => {
  const { generateContent, contentLibrary, isGenerating, clearContentLibrary } = useUnifiedAIContent();
  
  const [lessonType, setLessonType] = useState<'phonics_lesson' | 'english_lesson'>('phonics_lesson');
  const [topic, setTopic] = useState('');
  const [ageGroup, setAgeGroup] = useState<'5-7' | '8-12'>('5-7');
  const [cefrLevel, setCefrLevel] = useState<'Pre-A1' | 'A1' | 'A1+' | 'A2' | 'A2+' | 'B1'>('Pre-A1');
  const [duration, setDuration] = useState(30);
  const [learningObjectives, setLearningObjectives] = useState('');
  const [specificRequirements, setSpecificRequirements] = useState('');
  const [lessonNumber, setLessonNumber] = useState(1);
  const [selectedLesson, setSelectedLesson] = useState<ContentLibraryItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Filter lessons by type
  const phonicsLessons = contentLibrary.filter(item => 
    item.type === 'phonics_lesson' || item.type === 'english_lesson'
  );

  const handleGenerate = async () => {
    if (!topic.trim()) {
      return;
    }

    const objectives = learningObjectives
      .split('\n')
      .filter(obj => obj.trim())
      .map(obj => obj.trim());

    const request: AIContentRequest = {
      type: lessonType,
      topic: `${topic} (Lesson ${lessonNumber})`,
      level: cefrToLevel(cefrLevel),
      ageGroup,
      cefrLevel,
      duration,
      learningObjectives: objectives,
      specificRequirements,
      studentAge: ageGroup,
    };

    await generateContent(request);
    setLessonNumber(prev => prev + 1);
  };

  const cefrToLevel = (cefr: string): 'beginner' | 'intermediate' | 'advanced' => {
    if (cefr === 'Pre-A1' || cefr === 'A1') return 'beginner';
    if (cefr === 'A1+' || cefr === 'A2' || cefr === 'A2+') return 'intermediate';
    return 'advanced';
  };

  const handleViewLesson = (lesson: ContentLibraryItem) => {
    setSelectedLesson(lesson);
    setIsViewerOpen(true);
  };

  const handleQuickCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    if (lowerCommand.includes('next') || lowerCommand.includes('continue')) {
      handleGenerate();
    } else if (lowerCommand.match(/lesson\s*(\d+)/)) {
      const match = lowerCommand.match(/lesson\s*(\d+)/);
      if (match && match[1]) {
        setLessonNumber(parseInt(match[1]));
        handleGenerate();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Phonics & English Lesson Library</h1>
        <p className="text-muted-foreground">
          Generate interactive, gamified lessons for children aged 5-12 with AI-powered content and illustrations
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generation Form */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Generate Lesson
            </CardTitle>
            <CardDescription>Create structured, age-appropriate lessons</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lessonType">Lesson Type</Label>
              <Select value={lessonType} onValueChange={(value: any) => setLessonType(value)}>
                <SelectTrigger id="lessonType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phonics_lesson">Phonics (Ages 5-7)</SelectItem>
                  <SelectItem value="english_lesson">English (Ages 8-12)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder={lessonType === 'phonics_lesson' ? "e.g., Short 'a' Sound" : "e.g., Common Verbs and Actions"}
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ageGroup">Age Group</Label>
                <Select value={ageGroup} onValueChange={(value: any) => setAgeGroup(value)}>
                  <SelectTrigger id="ageGroup">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5-7">5-7 years</SelectItem>
                    <SelectItem value="8-12">8-12 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cefrLevel">CEFR Level</Label>
                <Select value={cefrLevel} onValueChange={(value: any) => setCefrLevel(value)}>
                  <SelectTrigger id="cefrLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-A1">Pre-A1</SelectItem>
                    <SelectItem value="A1">A1</SelectItem>
                    <SelectItem value="A1+">A1+</SelectItem>
                    <SelectItem value="A2">A2</SelectItem>
                    <SelectItem value="A2+">A2+</SelectItem>
                    <SelectItem value="B1">B1</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                max="60"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Learning Objectives (one per line)</Label>
              <Textarea
                id="objectives"
                placeholder="Recognize letters and their sounds&#10;Blend sounds to read simple words&#10;Improve pronunciation"
                value={learningObjectives}
                onChange={(e) => setLearningObjectives(e.target.value)}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Specific Requirements (optional)</Label>
              <Textarea
                id="requirements"
                placeholder="Include songs, use colorful visuals, add movement activities..."
                value={specificRequirements}
                onChange={(e) => setSpecificRequirements(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lessonNumber">Lesson Number</Label>
              <Input
                id="lessonNumber"
                type="number"
                min="1"
                value={lessonNumber}
                onChange={(e) => setLessonNumber(parseInt(e.target.value))}
              />
              <p className="text-xs text-muted-foreground">
                Auto-increments after each generation
              </p>
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !topic.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Lesson {lessonNumber}...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Lesson {lessonNumber}
                </>
              )}
            </Button>

            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2">Quick Commands:</p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerate()}
                  disabled={isGenerating || !topic.trim()}
                >
                  Next
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => { setLessonNumber(1); handleGenerate(); }}
                  disabled={isGenerating || !topic.trim()}
                >
                  Restart
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Library */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Generated Lessons ({phonicsLessons.length})
                </CardTitle>
                <CardDescription>View, export, and manage your lesson library</CardDescription>
              </div>
              {phonicsLessons.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearContentLibrary}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {phonicsLessons.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No lessons generated yet</p>
                <p className="text-sm">Fill in the form and click "Generate Lesson" to create your first lesson</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {phonicsLessons.map((lesson) => (
                  <PhonicsLessonCard
                    key={lesson.id}
                    lesson={lesson}
                    onView={handleViewLesson}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lesson Viewer Modal */}
      {selectedLesson && (
        <PhonicsLessonViewer
          lesson={selectedLesson}
          isOpen={isViewerOpen}
          onClose={() => {
            setIsViewerOpen(false);
            setSelectedLesson(null);
          }}
        />
      )}
    </div>
  );
};
