import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, BookText, Target, MessageSquare } from 'lucide-react';
import { useECACurriculum } from '@/hooks/useECACurriculum';
import { useState } from 'react';
import { LessonCard } from './LessonCard';
import { supabase } from '@/integrations/supabase/client';

interface UnitDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unit: any;
  onLessonsGenerated?: () => void;
}

export const UnitDetailView = ({ open, onOpenChange, unit, onLessonsGenerated }: UnitDetailViewProps) => {
  const { generateLessonsForUnit, generateLessonContent, isLoading } = useECACurriculum();
  const [localUnit, setLocalUnit] = useState(unit);
  const [generatingLessonIndex, setGeneratingLessonIndex] = useState<number | null>(null);

  const handleGenerateLessons = async () => {
    try {
      const lessons = await generateLessonsForUnit(unit.id);
      setLocalUnit({
        ...localUnit,
        unit_data: {
          ...localUnit.unit_data,
          lessons
        }
      });
      onLessonsGenerated?.();
    } catch (error) {
      console.error('Failed to generate lessons:', error);
    }
  };

  const handleGenerateSlides = async (lessonIndex: number) => {
    try {
      setGeneratingLessonIndex(lessonIndex);
      await generateLessonContent(unit.id, lessonIndex);
      
      // Refresh unit data to get updated lesson with lessonId
      const { data: refreshedUnit } = await supabase
        .from('curriculum_units')
        .select('*')
        .eq('id', unit.id)
        .single();
      
      if (refreshedUnit) {
        setLocalUnit(refreshedUnit);
        onLessonsGenerated?.();
      }
    } catch (error) {
      console.error('Failed to generate slides:', error);
    } finally {
      setGeneratingLessonIndex(null);
    }
  };

  const lessons = localUnit.unit_data?.lessons || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">Unit {localUnit.unit_number}</Badge>
            <Badge>{localUnit.cefr_level}</Badge>
            <Badge variant="secondary">{localUnit.age_group}</Badge>
          </div>
          <DialogTitle className="text-2xl">{localUnit.title}</DialogTitle>
          <DialogDescription>
            {localUnit.duration_weeks} weeks • {localUnit.skills_focus?.join(', ')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Learning Objectives */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Target className="w-4 h-4" />
              Learning Objectives
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {localUnit.learning_objectives?.map((obj: string, idx: number) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>

          {/* Language Focus */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <BookText className="w-4 h-4" />
                Grammar Focus
              </h3>
              <div className="flex flex-wrap gap-2">
                {localUnit.grammar_focus?.map((item: string, idx: number) => (
                  <Badge key={idx} variant="outline">{item}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Vocabulary Themes
              </h3>
              <div className="flex flex-wrap gap-2">
                {localUnit.vocabulary_themes?.map((item: string, idx: number) => (
                  <Badge key={idx} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Lessons Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                Lesson Plans {lessons.length > 0 && `(${lessons.length})`}
              </h3>
              {lessons.length === 0 && (
                <Button 
                  onClick={handleGenerateLessons}
                  disabled={isLoading}
                  size="sm"
                  className="gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Lesson Plans
                    </>
                  )}
                </Button>
              )}
            </div>

            {lessons.length > 0 ? (
              <div className="space-y-3">
                {lessons.map((lesson: any, idx: number) => (
                  <LessonCard 
                    key={idx} 
                    lesson={lesson} 
                    lessonIndex={idx}
                    onGenerateSlides={handleGenerateSlides}
                    isGenerating={generatingLessonIndex === idx}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No lessons generated yet. Click the button above to create detailed lesson plans.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
