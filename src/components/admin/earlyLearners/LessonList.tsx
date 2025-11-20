import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Play, MoreVertical } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

export function LessonList() {
  const { data: lessons, isLoading } = useQuery({
    queryKey: ['early-learners-lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('early_learners_lessons')
        .select('*')
        .order('lesson_number', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });
  
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-24 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
  
  if (!lessons || lessons.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Lessons Yet</h3>
          <p className="text-muted-foreground mb-4">
            Get started by generating your first Early Learners lesson
          </p>
          <Button>Generate First Lesson</Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lessons.map((lesson: any) => (
        <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">Lesson {lesson.lesson_number}</Badge>
                  <Badge className={
                    lesson.status === 'published' ? 'bg-green-500' :
                    lesson.status === 'complete' ? 'bg-blue-500' :
                    'bg-yellow-500'
                  }>
                    {lesson.status}
                  </Badge>
                </div>
                <h3 className="font-bold text-lg mb-1">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground">{lesson.topic}</p>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 mr-2" />
                Phonics: {lesson.phonics_focus}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-2" />
                {lesson.duration_minutes || 30} minutes
              </div>
            </div>
            
            <Button className="w-full">
              <Play className="h-4 w-4 mr-2" />
              Preview Lesson
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
