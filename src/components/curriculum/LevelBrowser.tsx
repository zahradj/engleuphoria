import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Plus, Play, Clock, Target } from 'lucide-react';
import { CurriculumLevel } from '@/data/curriculum/levels';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface LevelBrowserProps {
  level: CurriculumLevel;
  onBack: () => void;
  onLessonSelect: (lesson: any) => void;
  onCreateLesson?: (level: string, module: number, lesson: number) => void;
}

interface LessonContent {
  id: string;
  title: string;
  topic: string;
  cefr_level: string;
  module_number: number;
  lesson_number: number;
  duration_minutes: number;
  learning_objectives: string[];
  is_active: boolean;
}

export const LevelBrowser: React.FC<LevelBrowserProps> = ({
  level,
  onBack,
  onLessonSelect,
  onCreateLesson
}) => {
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLessons();
  }, [level.cefrLevel]);

  const fetchLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons_content')
        .select('*')
        .eq('cefr_level', level.cefrLevel)
        .eq('is_active', true)
        .order('module_number', { ascending: true })
        .order('lesson_number', { ascending: true });

      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      toast.error('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const groupedLessons = lessons.reduce((acc, lesson) => {
    const moduleKey = lesson.module_number;
    if (!acc[moduleKey]) {
      acc[moduleKey] = [];
    }
    acc[moduleKey].push(lesson);
    return acc;
  }, {} as Record<number, LessonContent[]>);

  const handleCreateLesson = (moduleNumber: number, lessonNumber: number) => {
    if (onCreateLesson) {
      onCreateLesson(level.id, moduleNumber, lessonNumber);
    }
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
                Back to Library
              </Button>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{level.icon}</div>
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {level.name}
                    <Badge className={level.color}>{level.cefrLevel}</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div>Age Group: {level.ageGroup}</div>
              <div>Total Hours: {level.estimatedHours}h</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Modules and Lessons */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Loading lessons...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Array.from({ length: level.modules }, (_, moduleIndex) => {
            const moduleNumber = moduleIndex + 1;
            const moduleLessons = groupedLessons[moduleNumber] || [];
            
            return (
              <Card key={moduleNumber}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Module {moduleNumber}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCreateLesson(moduleNumber, moduleLessons.length + 1)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {moduleLessons.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No lessons created yet for this module.</p>
                      <p className="text-sm">Click "Add Lesson" to create the first lesson.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {moduleLessons.map((lesson) => (
                        <Card key={lesson.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onLessonSelect(lesson)}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">Lesson {lesson.lesson_number}</Badge>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {lesson.duration_minutes}min
                              </div>
                            </div>
                            <h4 className="font-semibold mb-1">{lesson.title}</h4>
                            <p className="text-sm text-muted-foreground mb-3">{lesson.topic}</p>
                            {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                                  <Target className="h-3 w-3" />
                                  Objectives:
                                </div>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {lesson.learning_objectives.slice(0, 2).map((objective, index) => (
                                    <li key={index} className="flex items-start gap-1">
                                      <span className="mt-1">•</span>
                                      <span>{objective}</span>
                                    </li>
                                  ))}
                                  {lesson.learning_objectives.length > 2 && (
                                    <li className="text-muted-foreground">
                                      +{lesson.learning_objectives.length - 2} more...
                                    </li>
                                  )}
                                </ul>
                              </div>
                            )}
                            <Button className="w-full mt-3" variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Open Lesson
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                  
                  {/* Create placeholder cards for missing lessons */}
                  {Array.from({ length: Math.max(0, level.lessonsPerModule - moduleLessons.length) }, (_, lessonIndex) => {
                    const lessonNumber = moduleLessons.length + lessonIndex + 1;
                    if (lessonNumber <= level.lessonsPerModule) {
                      return (
                        <Card key={`placeholder-${lessonNumber}`} className="border-dashed border-2 border-muted-foreground/25 mt-4">
                          <CardContent className="p-4 text-center">
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                              <Plus className="h-8 w-8" />
                              <p className="font-medium">Lesson {lessonNumber}</p>
                              <p className="text-sm">Not created yet</p>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCreateLesson(moduleNumber, lessonNumber)}
                              >
                                Create Lesson
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    }
                    return null;
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};