import React from 'react';
import { ContentLibraryItem } from '@/services/ai/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Clock, Target } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PhonicsLessonCardProps {
  lesson: ContentLibraryItem;
  onView: (lesson: ContentLibraryItem) => void;
}

export const PhonicsLessonCard: React.FC<PhonicsLessonCardProps> = ({ lesson, onView }) => {
  const { toast } = useToast();

  const handleExport = () => {
    const dataStr = JSON.stringify(lesson, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lesson.title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Lesson Exported",
      description: `${lesson.title} has been downloaded as JSON`,
    });
  };

  const getAgeGroup = () => {
    if (lesson.type === 'phonics_lesson') return '5-7 years';
    if (lesson.type === 'english_lesson') return '8-12 years';
    return 'All ages';
  };

  const getLessonObjective = () => {
    if (typeof lesson.content === 'object' && lesson.content !== null) {
      if ('phonicsLesson' in lesson.content) {
        return lesson.content.phonicsLesson?.objective || 'No objective specified';
      }
      if ('objective' in lesson.content) {
        return lesson.content.objective as string;
      }
    }
    return 'Interactive lesson with gamified activities';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{lesson.title}</CardTitle>
            <CardDescription className="line-clamp-2">
              {getLessonObjective()}
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <Badge variant="secondary">
            {lesson.type === 'phonics_lesson' ? 'Phonics' : 'English'}
          </Badge>
          <Badge variant="outline">{getAgeGroup()}</Badge>
          <Badge variant="outline">{lesson.level}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{lesson.duration} minutes</span>
          </div>
          
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Target className="h-4 w-4 mt-0.5" />
            <span className="line-clamp-2">{lesson.topic}</span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => onView(lesson)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
