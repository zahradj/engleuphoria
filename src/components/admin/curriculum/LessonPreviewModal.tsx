import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, BookOpen, Hash, ExternalLink, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface LessonPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: Lesson | null;
}

export const LessonPreviewModal: React.FC<LessonPreviewModalProps> = ({
  open,
  onOpenChange,
  lesson,
}) => {
  const navigate = useNavigate();

  if (!lesson) return null;

  const handleOpenFullPreview = () => {
    navigate(`/lesson/${lesson.id}?mode=preview`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            {lesson.sequence_number && (
              <Badge variant="outline">
                <Hash className="h-3 w-3 mr-1" />
                {lesson.sequence_number}
              </Badge>
            )}
            <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
              {lesson.status}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{lesson.title || 'Untitled Lesson'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>Level: {lesson.cefr_level}</span>
            </div>
            <div className="flex items-center gap-1">
              <span>Age: {lesson.age_group}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{lesson.duration_minutes || 30} minutes</span>
            </div>
          </div>

          {/* Topic */}
          <div>
            <h4 className="font-semibold text-sm mb-2">Topic</h4>
            <p className="text-muted-foreground">{lesson.topic}</p>
          </div>

          {/* Learning Objectives */}
          {lesson.learning_objectives && lesson.learning_objectives.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Target className="h-4 w-4" />
                Learning Objectives
              </h4>
              <ul className="space-y-2">
                {lesson.learning_objectives.map((objective, index) => (
                  <li 
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">
                      {index + 1}
                    </span>
                    {objective}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button 
              className="flex-1"
              onClick={handleOpenFullPreview}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Full Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
