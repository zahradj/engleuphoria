import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Clock, Target, BookOpen, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LessonViewerProps {
  lesson: any;
  onBack: () => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({ lesson, onBack }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleStartLesson = () => {
    if (!lesson.slides_content || !lesson.slides_content.slides) {
      toast({
        title: "No Slides Available",
        description: "This lesson doesn't have slides yet.",
        variant: "destructive",
      });
      return;
    }

    // Store lesson data in localStorage
    localStorage.setItem('currentLesson', JSON.stringify({
      lessonId: lesson.id,
      title: lesson.title,
      slides: lesson.slides_content,
    }));

    // Navigate to lesson viewer
    navigate('/lesson-viewer');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Module
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {lesson.title}
                  <Badge variant="outline">
                    Module {lesson.module_number} • Lesson {lesson.lesson_number}
                  </Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">{lesson.topic}</p>
              </div>
            </div>
            <Button onClick={handleStartLesson} className="gap-2">
              <Play className="h-4 w-4" />
              Start Lesson
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Lesson Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Learning Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lesson.learning_objectives && lesson.learning_objectives.length > 0 ? (
                <ul className="space-y-2">
                  {lesson.learning_objectives.map((objective: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No learning objectives specified.</p>
              )}
            </CardContent>
          </Card>

          {/* Lesson Structure */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Lesson Structure
              </CardTitle>
            </CardHeader>
            <CardContent>
              {lesson.slides_content && lesson.slides_content.slides ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Total Slides:</span>
                    <Badge variant="outline">{lesson.slides_content.slides.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {lesson.slides_content.slides.slice(0, 8).map((slide: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <span className="text-xs font-mono text-muted-foreground">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-sm">{slide.type || slide.prompt || 'Slide Content'}</span>
                      </div>
                    ))}
                    {lesson.slides_content.slides.length > 8 && (
                      <div className="flex items-center justify-center p-2 border rounded border-dashed">
                        <span className="text-sm text-muted-foreground">
                          +{lesson.slides_content.slides.length - 8} more slides
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No slide content available.</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Lesson Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lesson Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">CEFR Level:</span>
                <Badge className="text-xs">{lesson.cefr_level}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span className="text-sm">{lesson.duration_minutes} min</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Difficulty:</span>
                <span className="text-sm capitalize">{lesson.difficulty_level}</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Users className="h-4 w-4 mr-2" />
                Preview Lesson
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Edit Content
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Target className="h-4 w-4 mr-2" />
                Lesson Analytics
              </Button>
            </CardContent>
          </Card>

          {/* Metadata */}
          {lesson.slides_content?.metadata && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span>{lesson.slides_content.metadata.version || '1.0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Theme:</span>
                  <span>{lesson.slides_content.metadata.theme || 'default'}</span>
                </div>
                {lesson.slides_content.metadata.weights && (
                  <div className="space-y-1">
                    <span className="text-muted-foreground">Focus Weights:</span>
                    <div className="pl-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Accuracy:</span>
                        <span>{(lesson.slides_content.metadata.weights.accuracy * 100).toFixed(0)}%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Fluency:</span>
                        <span>{(lesson.slides_content.metadata.weights.fluency * 100).toFixed(0)}%</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};