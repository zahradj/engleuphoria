import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Plus, Play, Clock, Target } from 'lucide-react';
import { CurriculumLevel } from '@/data/curriculum/levels';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { LessonPlayer } from '@/components/lessons/LessonPlayer';
import { lesson1_1 } from '@/data/curriculum/starters/module1/lesson1';

interface LevelBrowserProps {
  level: CurriculumLevel;
  onBack: () => void;
  onLessonSelect: (lesson: any) => void;
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
  onLessonSelect
}) => {
  const [lessons, setLessons] = useState<LessonContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLocalLesson, setShowLocalLesson] = useState(false);

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


  if (showLocalLesson) {
    return (
      <LessonPlayer 
        lessonData={lesson1_1}
        onComplete={() => setShowLocalLesson(false)}
        onExit={() => setShowLocalLesson(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Module 1 with Lesson 1.1 */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Loading lessons...</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Module 1
            </CardTitle>
          </CardHeader>
          <CardContent>
            {level.cefrLevel === 'A1' ? (
              <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowLocalLesson(true)}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">Lesson 1.1</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      30min
                    </div>
                  </div>
                  <h4 className="font-semibold mb-1">Greetings & Self-Introduction</h4>
                  <p className="text-sm text-muted-foreground mb-3">All About Me</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                      <Target className="h-3 w-3" />
                      Objectives:
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-start gap-1"><span className="mt-1">•</span><span>Hello, Hi, Goodbye</span></li>
                      <li className="flex items-start gap-1"><span className="mt-1">•</span><span>My name is..., What's your name?</span></li>
                      <li className="flex items-start gap-1"><span className="mt-1">•</span><span>Nice to meet you, Phonics Aa</span></li>
                    </ul>
                  </div>
                  <Button className="w-full mt-3" variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Start Lesson
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No lessons available for this level yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};