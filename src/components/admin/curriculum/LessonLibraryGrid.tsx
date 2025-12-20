import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Clock, BookOpen, Hash } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Lesson {
  id: string;
  title: string;
  topic: string;
  cefr_level: string;
  age_group: string;
  sequence_number: number | null;
  duration_minutes: number | null;
  status: string;
  learning_objectives: string[] | null;
  created_at: string;
}

interface LessonLibraryGridProps {
  lessons: Lesson[];
  isLoading: boolean;
  onPreview: (lesson: Lesson) => void;
  onEdit: (lesson: Lesson) => void;
}

export const LessonLibraryGrid: React.FC<LessonLibraryGridProps> = ({
  lessons,
  isLoading,
  onPreview,
  onEdit,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground">No lessons found</h3>
        <p className="text-muted-foreground">
          No lessons match your current filters. Try adjusting the level or age group.
        </p>
      </div>
    );
  }

  // Sort by sequence number
  const sortedLessons = [...lessons].sort((a, b) => {
    const seqA = a.sequence_number ?? 999;
    const seqB = b.sequence_number ?? 999;
    return seqA - seqB;
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedLessons.map((lesson) => (
        <Card key={lesson.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {lesson.sequence_number && (
                  <Badge variant="outline" className="text-xs">
                    <Hash className="h-3 w-3 mr-1" />
                    {lesson.sequence_number}
                  </Badge>
                )}
                <Badge 
                  variant={lesson.status === 'published' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {lesson.status}
                </Badge>
              </div>
            </div>
            <CardTitle className="text-base line-clamp-2 mt-2">
              {lesson.title || 'Untitled Lesson'}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{lesson.topic}</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {lesson.duration_minutes || 30} min
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {lesson.cefr_level}
              </div>
            </div>

            {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Objectives:</p>
                <ul className="text-xs text-muted-foreground list-disc list-inside line-clamp-2">
                  {lesson.learning_objectives.slice(0, 2).map((obj, idx) => (
                    <li key={idx} className="truncate">{obj}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onPreview(lesson)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => onEdit(lesson)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
