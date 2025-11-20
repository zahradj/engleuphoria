import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Clock, Target, Book, Lightbulb, Sparkles, CheckCircle, Loader2, Eye } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SlidesLessonView } from './previews/SlidesLessonView';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LessonCardProps {
  lesson: any;
  lessonIndex: number;
  onGenerateSlides?: (lessonIndex: number) => Promise<void>;
  isGenerating?: boolean;
}

export const LessonCard = ({ lesson, lessonIndex, onGenerateSlides, isGenerating }: LessonCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSlidesDialog, setShowSlidesDialog] = useState(false);
  const [slidesLesson, setSlidesLesson] = useState<any>(null);
  const [loadingSlides, setLoadingSlides] = useState(false);
  const { toast } = useToast();

  const handleViewSlides = async () => {
    if (!lesson.lessonId) return;
    
    setLoadingSlides(true);
    try {
      const { data, error } = await supabase
        .from('systematic_lessons')
        .select('*')
        .eq('id', lesson.lessonId)
        .single();
      
      if (error) throw error;
      
      setSlidesLesson(data);
      setShowSlidesDialog(true);
    } catch (error) {
      console.error('Failed to load slides:', error);
      toast({
        title: 'Error',
        description: 'Failed to load lesson slides',
        variant: 'destructive'
      });
    } finally {
      setLoadingSlides(false);
    }
  };

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="p-4 cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">Lesson {lesson.lessonNumber}</Badge>
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    45 min
                  </Badge>
                </div>
                <h4 className="font-semibold">{lesson.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                  {lesson.objectives?.[0]}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4 border-t">
            {/* Objectives */}
            <div className="pt-4">
              <h5 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Target className="w-4 h-4" />
                Objectives
              </h5>
              <ul className="list-disc list-inside space-y-1 text-sm">
                {lesson.objectives?.map((obj: string, idx: number) => (
                  <li key={idx}>{obj}</li>
                ))}
              </ul>
            </div>

            {/* Target Language */}
            <div>
              <h5 className="font-semibold text-sm flex items-center gap-2 mb-2">
                <Book className="w-4 h-4" />
                Target Language
              </h5>
              <div className="space-y-2">
                <div>
                  <span className="text-xs font-medium">Grammar:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {lesson.targetLanguage?.grammar?.map((item: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium">Vocabulary:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {lesson.targetLanguage?.vocabulary?.map((item: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">{item}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Materials */}
            {lesson.materials && lesson.materials.length > 0 && (
              <div>
                <h5 className="font-semibold text-sm mb-2">Materials</h5>
                <p className="text-sm text-muted-foreground">{lesson.materials.join(', ')}</p>
              </div>
            )}

            {/* Lesson Flow */}
            <div className="space-y-3 pt-2">
              <h5 className="font-semibold">Lesson Flow</h5>
              
              {lesson.warmUp && (
                <div className="bg-accent/30 rounded-lg p-3">
                  <h6 className="font-medium text-sm mb-1">Warm-up (5 min)</h6>
                  <p className="text-sm">{lesson.warmUp}</p>
                </div>
              )}

              {lesson.presentation && (
                <div className="bg-accent/30 rounded-lg p-3">
                  <h6 className="font-medium text-sm mb-1">Presentation (10 min)</h6>
                  <p className="text-sm">{lesson.presentation}</p>
                </div>
              )}

              {lesson.controlledPractice && (
                <div className="bg-accent/30 rounded-lg p-3">
                  <h6 className="font-medium text-sm mb-1">Controlled Practice (10-15 min)</h6>
                  <p className="text-sm">{lesson.controlledPractice}</p>
                </div>
              )}

              {lesson.freerPractice && (
                <div className="bg-accent/30 rounded-lg p-3">
                  <h6 className="font-medium text-sm mb-1">Freer Practice (15 min)</h6>
                  <p className="text-sm">{lesson.freerPractice}</p>
                </div>
              )}

              {lesson.assessment && (
                <div className="bg-accent/30 rounded-lg p-3">
                  <h6 className="font-medium text-sm mb-1">Assessment & Wrap-up (5 min)</h6>
                  <p className="text-sm">{lesson.assessment}</p>
                </div>
              )}
            </div>

            {/* Differentiation */}
            {lesson.differentiation && (
              <div>
                <h5 className="font-semibold text-sm mb-2">Differentiation</h5>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded p-2">
                    <p className="text-xs font-medium mb-1">Easier</p>
                    <p className="text-sm">{lesson.differentiation.easier}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-950/30 rounded p-2">
                    <p className="text-xs font-medium mb-1">Harder</p>
                    <p className="text-sm">{lesson.differentiation.harder}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Teacher Tips */}
            {lesson.teacherTips && (
              <div className="bg-primary/5 rounded-lg p-3">
                <h5 className="font-semibold text-sm flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4" />
                  Teacher Tips
                </h5>
                <p className="text-sm">{lesson.teacherTips}</p>
              </div>
            )}

            {/* Homework */}
            {lesson.homework && (
              <div>
                <h5 className="font-semibold text-sm mb-1">Homework</h5>
                <p className="text-sm text-muted-foreground">{lesson.homework}</p>
              </div>
            )}

            {/* Action Buttons */}
            {onGenerateSlides && (
              <div className="pt-4 border-t space-y-2">
                {lesson.lessonId ? (
                  <>
                    <Button
                      onClick={handleViewSlides}
                      disabled={loadingSlides}
                      className="w-full"
                      variant="default"
                    >
                      {loadingSlides ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          View Generated Slides
                        </>
                      )}
                    </Button>
                    <Button
                      disabled
                      className="w-full"
                      variant="outline"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Slides Generated
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => onGenerateSlides(lessonIndex)}
                    disabled={isGenerating}
                    className="w-full"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Slides...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Slide Content
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Slides View Dialog */}
      <Dialog open={showSlidesDialog} onOpenChange={setShowSlidesDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Lesson Slides</DialogTitle>
          </DialogHeader>
          {slidesLesson && <SlidesLessonView lesson={slidesLesson} />}
        </DialogContent>
      </Dialog>
    </Card>
  );
};
