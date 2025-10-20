import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2 } from 'lucide-react';
import { toast } from 'sonner';
import { gameLessonService } from '@/services/gameLessonService';

export function GameLessonGenerator() {
  const [topic, setTopic] = useState('');
  const [cefrLevel, setCefrLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A1');
  const [ageGroup, setAgeGroup] = useState('6-12 years');
  const [duration, setDuration] = useState(30);
  const [gameType, setGameType] = useState<'story_adventure' | 'collection_quest' | 'puzzle_challenge' | 'mixed'>('story_adventure');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLesson, setGeneratedLesson] = useState<any>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      const lesson = await gameLessonService.generateGameLesson({
        topic,
        cefrLevel,
        ageGroup,
        duration,
        gameType,
        focusSkills: ['vocabulary', 'speaking', 'listening']
      });

      setGeneratedLesson(lesson);
      toast.success('Lesson generated successfully! 🎉');
    } catch (error: any) {
      console.error('Error generating lesson:', error);
      toast.error(error.message || 'Failed to generate lesson');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndPlay = () => {
    if (!generatedLesson) return;

    // Format for viewer
    const formattedLesson = {
      lessonId: `generated-${Date.now()}`,
      title: generatedLesson.lesson_title,
      slides: {
        version: '2.0',
        theme: 'game',
        durationMin: duration,
        slides: generatedLesson.game_slides,
        metadata: {
          CEFR: cefrLevel,
          characters: generatedLesson.characters,
          story_theme: generatedLesson.story_theme,
          learning_objectives: generatedLesson.learning_objectives,
          vocabulary: generatedLesson.vocabulary
        }
      }
    };

    localStorage.setItem('currentLesson', JSON.stringify(formattedLesson));
    window.open('/lesson-viewer', '_blank');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Game Lesson Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic Input */}
          <div className="space-y-2">
            <Label htmlFor="topic">Lesson Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Greetings and Introductions"
              disabled={isGenerating}
            />
          </div>

          {/* CEFR Level */}
          <div className="space-y-2">
            <Label htmlFor="cefr">CEFR Level</Label>
            <Select value={cefrLevel} onValueChange={(val: any) => setCefrLevel(val)} disabled={isGenerating}>
              <SelectTrigger id="cefr">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A1">Pre-A1 (Absolute Beginner)</SelectItem>
                <SelectItem value="A2">A1 (Beginner)</SelectItem>
                <SelectItem value="B1">A2 (Elementary)</SelectItem>
                <SelectItem value="B2">B1 (Intermediate)</SelectItem>
                <SelectItem value="C1">B2 (Upper Intermediate)</SelectItem>
                <SelectItem value="C2">C1 (Advanced)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Age Group */}
          <div className="space-y-2">
            <Label htmlFor="age">Age Group</Label>
            <Select value={ageGroup} onValueChange={setAgeGroup} disabled={isGenerating}>
              <SelectTrigger id="age">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5-8 years">5-8 years (Early Childhood)</SelectItem>
                <SelectItem value="6-12 years">6-12 years (Children)</SelectItem>
                <SelectItem value="9-14 years">9-14 years (Pre-teens)</SelectItem>
                <SelectItem value="13-18 years">13-18 years (Teenagers)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration.toString()} onValueChange={(val) => setDuration(Number(val))} disabled={isGenerating}>
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes</SelectItem>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="45">45 minutes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Game Type */}
          <div className="space-y-2">
            <Label htmlFor="gameType">Game Type</Label>
            <Select value={gameType} onValueChange={(val: any) => setGameType(val)} disabled={isGenerating}>
              <SelectTrigger id="gameType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="story_adventure">🎭 Story Adventure</SelectItem>
                <SelectItem value="collection_quest">🎯 Collection Quest</SelectItem>
                <SelectItem value="puzzle_challenge">🧩 Puzzle Challenge</SelectItem>
                <SelectItem value="mixed">🎲 Mixed Activities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Lesson
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Lesson Preview */}
      {generatedLesson && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Lesson Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">{generatedLesson.lesson_title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{generatedLesson.story_theme}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Learning Objectives:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {generatedLesson.learning_objectives.map((obj: string, i: number) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Characters:</h4>
              <div className="flex flex-wrap gap-2">
                {generatedLesson.characters.map((char: any, i: number) => (
                  <div key={i} className="bg-primary/10 rounded-lg px-3 py-2 text-sm">
                    {char.name} - {char.role}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Vocabulary ({generatedLesson.vocabulary.length} words):</h4>
              <div className="flex flex-wrap gap-2">
                {generatedLesson.vocabulary.slice(0, 10).map((vocab: any, i: number) => (
                  <span key={i} className="bg-secondary rounded px-2 py-1 text-sm">
                    {vocab.word}
                  </span>
                ))}
                {generatedLesson.vocabulary.length > 10 && (
                  <span className="text-sm text-muted-foreground">
                    +{generatedLesson.vocabulary.length - 10} more
                  </span>
                )}
              </div>
            </div>

            <div className="pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Total Slides: {generatedLesson.total_slides} | Duration: ~{generatedLesson.estimated_duration} min
              </p>
              <Button onClick={handleSaveAndPlay} className="w-full" size="lg">
                🚀 Save & Play Lesson
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
