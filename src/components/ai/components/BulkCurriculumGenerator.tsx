import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Pause, CheckCircle, Clock, Target } from 'lucide-react';
import { bulkCurriculumService } from '@/services/ai/bulkCurriculumService';
import { useToast } from '@/hooks/use-toast';

export const BulkCurriculumGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentLevel, setCurrentLevel] = useState('');
  const [currentLesson, setCurrentLesson] = useState(0);
  const [totalLessons, setTotalLessons] = useState(294);
  const [generatedContent, setGeneratedContent] = useState<any[]>([]);
  const [estimatedTime, setEstimatedTime] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadGeneratedContent();
  }, []);

  const loadGeneratedContent = async () => {
    try {
      const content = await bulkCurriculumService.getGeneratedContent();
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const handleStartGeneration = async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);
      setProgress(0);
      setEstimatedTime('Calculating...');

      toast({
        title: "Curriculum Generation Started",
        description: "Generating 294 lessons with 2,940 pages of content. This will take approximately 30-45 minutes.",
      });

      await bulkCurriculumService.generateFullCurriculum(
        (progressPercent, level, lesson, total) => {
          setProgress(progressPercent);
          setCurrentLevel(level);
          setCurrentLesson(lesson);
          setTotalLessons(total);
          
          // Estimate remaining time
          const remainingLessons = total - lesson;
          const estimatedMinutes = Math.ceil(remainingLessons * 0.1); // ~6 seconds per lesson
          setEstimatedTime(`${estimatedMinutes} minutes remaining`);
        }
      );

      toast({
        title: "Curriculum Generation Complete!",
        description: "All 294 lessons have been generated successfully.",
      });

      await loadGeneratedContent();
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Error",
        description: error instanceof Error ? error.message : "Failed to generate curriculum",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const stats = bulkCurriculumService.getGenerationStats();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Complete A-Z Curriculum Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Generation Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">294</div>
              <div className="text-sm text-muted-foreground">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2,940</div>
              <div className="text-sm text-muted-foreground">Total Pages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">6</div>
              <div className="text-sm text-muted-foreground">CEFR Levels</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{generatedContent.length}</div>
              <div className="text-sm text-muted-foreground">Generated</div>
            </div>
          </div>

          {/* Level Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { level: 'A1', lessons: 48, pages: 960, color: 'bg-green-100 text-green-800' },
              { level: 'A2', lessons: 56, pages: 1120, color: 'bg-blue-100 text-blue-800' },
              { level: 'B1', lessons: 48, pages: 960, color: 'bg-yellow-100 text-yellow-800' },
              { level: 'B2', lessons: 54, pages: 1080, color: 'bg-orange-100 text-orange-800' },
              { level: 'C1', lessons: 40, pages: 800, color: 'bg-red-100 text-red-800' },
              { level: 'C2', lessons: 48, pages: 960, color: 'bg-purple-100 text-purple-800' }
            ].map((item) => {
              const levelGenerated = generatedContent.filter(content => 
                content.cefr_level === item.level
              ).length;
              
              return (
                <Card key={item.level} className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <Badge className={item.color}>{item.level}</Badge>
                    <span className="text-sm font-medium">{levelGenerated}/{item.lessons}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.pages} pages total
                  </div>
                  <Progress 
                    value={(levelGenerated / item.lessons) * 100} 
                    className="h-2 mt-2"
                  />
                </Card>
              );
            })}
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{estimatedTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="text-sm">{currentLevel} - Lesson {currentLesson}/{totalLessons}</span>
                </div>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="text-center text-sm text-muted-foreground">
                {progress.toFixed(1)}% Complete
              </div>
            </div>
          )}

          {/* Generation Controls */}
          <div className="flex gap-3">
            <Button
              onClick={handleStartGeneration}
              disabled={isGenerating}
              className="flex-1"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Generate Complete Curriculum
                </>
              )}
            </Button>
            
            {generatedContent.length === 294 && (
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Complete!
              </Button>
            )}
          </div>

          {/* Features List */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <h4 className="font-medium mb-2">Neuroscience Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Spaced repetition integration</li>
                <li>• Cognitive load optimization</li>
                <li>• Memory consolidation techniques</li>
                <li>• Attention span management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Content Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 20-page structured lessons</li>
                <li>• Real-world conversation practice</li>
                <li>• Progressive sentence complexity</li>
                <li>• Cultural context integration</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};