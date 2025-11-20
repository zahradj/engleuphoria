import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Volume2, Image as ImageIcon, Play, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Slide {
  id: string;
  type: string;
  prompt: string;
  instructions?: string;
  audioText?: string;
  teacherTips?: string[];
  interactionType?: string;
}

interface SlidesLessonViewProps {
  lesson: {
    title: string;
    topic: string;
    grammar_focus: string;
    vocabulary_set: string[];
    lesson_objectives: string[];
    slides_content: {
      slides: Slide[];
      durationMin: number;
    };
    activities?: any;
  };
}

const slideTypeLabels: Record<string, { label: string; color: string; icon: any }> = {
  warmup: { label: 'Warm-up', color: 'bg-orange-100 text-orange-700', icon: Play },
  vocabulary_preview: { label: 'Vocabulary', color: 'bg-blue-100 text-blue-700', icon: Volume2 },
  grammar_focus: { label: 'Grammar', color: 'bg-purple-100 text-purple-700', icon: CheckCircle2 },
  listening_comprehension: { label: 'Listening', color: 'bg-green-100 text-green-700', icon: Volume2 },
  drag_drop: { label: 'Drag & Drop', color: 'bg-yellow-100 text-yellow-700', icon: Play },
  match: { label: 'Matching', color: 'bg-pink-100 text-pink-700', icon: Play },
  quiz: { label: 'Quiz', color: 'bg-red-100 text-red-700', icon: CheckCircle2 },
  controlled_practice: { label: 'Practice', color: 'bg-indigo-100 text-indigo-700', icon: Play },
  speaking: { label: 'Speaking', color: 'bg-teal-100 text-teal-700', icon: Volume2 },
  freer_practice: { label: 'Free Practice', color: 'bg-cyan-100 text-cyan-700', icon: Play },
  review: { label: 'Review', color: 'bg-gray-100 text-gray-700', icon: CheckCircle2 },
  wrap_up: { label: 'Wrap-up', color: 'bg-amber-100 text-amber-700', icon: CheckCircle2 }
};

export const SlidesLessonView = ({ lesson }: SlidesLessonViewProps) => {
  const slides = lesson.slides_content?.slides || [];
  const duration = lesson.slides_content?.durationMin || 45;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-2xl">{lesson.title}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">
                <Clock className="w-3 h-3 mr-1" />
                {duration} min
              </Badge>
              <Badge>{slides.length} slides</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Learning Objectives */}
          <div>
            <h3 className="font-semibold mb-2">Learning Objectives</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              {lesson.lesson_objectives?.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>

          <Separator />

          {/* Target Language */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-2">Grammar Focus</h3>
              <p className="text-sm text-muted-foreground">{lesson.grammar_focus}</p>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-2">Vocabulary</h3>
              <div className="flex flex-wrap gap-1">
                {lesson.vocabulary_set?.map((word, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">{word}</Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slides */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Lesson Slides</h3>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-3">
            {slides.map((slide, idx) => {
              const typeInfo = slideTypeLabels[slide.type] || {
                label: slide.type,
                color: 'bg-gray-100 text-gray-700',
                icon: Play
              };
              const Icon = typeInfo.icon;

              return (
                <Card key={slide.id} className="overflow-hidden">
                  <div className="p-4 space-y-3">
                    {/* Slide Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">Slide {idx + 1}</Badge>
                          <Badge className={typeInfo.color}>
                            <Icon className="w-3 h-3 mr-1" />
                            {typeInfo.label}
                          </Badge>
                          {slide.interactionType && (
                            <Badge variant="secondary" className="text-xs">
                              {slide.interactionType}
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-lg">{slide.prompt}</h4>
                      </div>
                    </div>

                    {/* Instructions */}
                    {slide.instructions && (
                      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-3">
                        <p className="text-sm font-medium mb-1">Instructions for Students</p>
                        <p className="text-sm">{slide.instructions}</p>
                      </div>
                    )}

                    {/* Audio Text */}
                    {slide.audioText && (
                      <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Volume2 className="w-4 h-4" />
                          <p className="text-sm font-medium">Audio Script</p>
                        </div>
                        <p className="text-sm">{slide.audioText}</p>
                      </div>
                    )}

                    {/* Teacher Tips */}
                    {slide.teacherTips && slide.teacherTips.length > 0 && (
                      <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3">
                        <p className="text-sm font-medium mb-1">💡 Teacher Tips</p>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          {slide.teacherTips.map((tip, tipIdx) => (
                            <li key={tipIdx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
