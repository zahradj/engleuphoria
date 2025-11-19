import React from 'react';
import { ContentLibraryItem, PhonicsLessonContent } from '@/services/ai/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Clock, Target, Lightbulb, Award, BookOpen, Brain } from 'lucide-react';

interface PhonicsLessonViewerProps {
  lesson: ContentLibraryItem;
  isOpen: boolean;
  onClose: () => void;
}

export const PhonicsLessonViewer: React.FC<PhonicsLessonViewerProps> = ({
  lesson,
  isOpen,
  onClose,
}) => {
  // Extract phonics lesson content
  const getPhonicsContent = (): PhonicsLessonContent | null => {
    if (typeof lesson.content === 'object' && lesson.content !== null) {
      if ('phonicsLesson' in lesson.content) {
        return lesson.content.phonicsLesson as PhonicsLessonContent;
      }
      // If content is already in phonics format
      if ('warmup' in lesson.content && 'mainActivity' in lesson.content) {
        return lesson.content as unknown as PhonicsLessonContent;
      }
    }
    return null;
  };

  const phonicsContent = getPhonicsContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{lesson.title}</DialogTitle>
          <DialogDescription>
            Complete lesson plan with activities, assessments, and teaching notes
          </DialogDescription>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary">
              {lesson.type === 'phonics_lesson' ? 'Phonics Lesson' : 'English Lesson'}
            </Badge>
            <Badge variant="outline">{lesson.level}</Badge>
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {lesson.duration} min
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-200px)]">
          <div className="space-y-6 pr-4">
            {/* Objective */}
            {phonicsContent && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Learning Objective
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{phonicsContent.objective}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline">Age: {phonicsContent.ageGroup}</Badge>
                    <Badge variant="outline">Level: {phonicsContent.cefrLevel}</Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warmup Activity */}
            {phonicsContent?.warmup && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-orange-500" />
                    Warm-up Activity ({phonicsContent.warmup.duration} min)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{phonicsContent.warmup.activity}</p>
                  {phonicsContent.warmup.materials?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Materials Needed:</p>
                      <div className="flex flex-wrap gap-2">
                        {phonicsContent.warmup.materials.map((material, idx) => (
                          <Badge key={idx} variant="secondary">{material}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Main Activity */}
            {phonicsContent?.mainActivity && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Main Activity ({phonicsContent.mainActivity.duration} min)
                  </CardTitle>
                  <CardDescription>Type: {phonicsContent.mainActivity.type}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Instructions:</p>
                    <p className="text-sm text-muted-foreground">{phonicsContent.mainActivity.instructions}</p>
                  </div>
                  
                  {phonicsContent.mainActivity.exercises?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-3">Exercises:</p>
                      <div className="space-y-3">
                        {phonicsContent.mainActivity.exercises.map((exercise, idx) => (
                          <Card key={exercise.id || idx} className="bg-muted/30">
                            <CardContent className="pt-4">
                              <p className="text-sm font-medium mb-2">{exercise.prompt}</p>
                              {exercise.items?.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  {exercise.items.slice(0, 4).map((item: any, itemIdx: number) => (
                                    <div key={item.id || itemIdx} className="text-xs bg-background p-2 rounded">
                                      {item.letter && <span className="font-bold">{item.letter}: </span>}
                                      {item.word && <span>{item.word}</span>}
                                      {item.image && <span className="text-muted-foreground"> ({item.image})</span>}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Practice Exercises */}
            {phonicsContent?.practice && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-500" />
                    Practice & Drill ({phonicsContent.practice.duration} min)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {phonicsContent.practice.exercises?.map((exercise, idx) => (
                      <div key={idx} className="text-sm">
                        <Badge variant="outline" className="mb-2">{exercise.type}</Badge>
                        <p className="text-muted-foreground">{exercise.content}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Assessment */}
            {phonicsContent?.assessment && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-500" />
                    Assessment & Quiz
                  </CardTitle>
                  <CardDescription>
                    Type: {phonicsContent.assessment.type} | Passing Score: {phonicsContent.assessment.passingScore}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {phonicsContent.assessment.questions?.slice(0, 3).map((question, idx) => (
                      <Card key={question.id || idx} className="bg-muted/30">
                        <CardContent className="pt-4">
                          <p className="text-sm font-medium mb-2">Q{idx + 1}: {question.question}</p>
                          <div className="space-y-1 ml-4">
                            {question.options?.map((option, optIdx) => (
                              <p key={optIdx} className="text-xs text-muted-foreground">
                                {String.fromCharCode(65 + optIdx)}. {option}
                                {option === question.correctAnswer && ' ✓'}
                              </p>
                            ))}
                          </div>
                          {question.adaptiveHint && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Hint: {question.adaptiveHint}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    {phonicsContent.assessment.questions?.length > 3 && (
                      <p className="text-xs text-muted-foreground text-center">
                        + {phonicsContent.assessment.questions.length - 3} more questions
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rewards & Motivation */}
            {phonicsContent?.rewards && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-500" />
                    Rewards & Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {phonicsContent.rewards.badges?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Badges:</p>
                      <div className="flex flex-wrap gap-2">
                        {phonicsContent.rewards.badges.map((badge, idx) => (
                          <Badge key={idx} variant="secondary">🏆 {badge}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {phonicsContent.rewards.motivationalMessages?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Motivational Messages:</p>
                      <div className="space-y-1">
                        {phonicsContent.rewards.motivationalMessages.slice(0, 3).map((msg, idx) => (
                          <p key={idx} className="text-sm text-muted-foreground">💬 "{msg}"</p>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Teacher Notes */}
            {phonicsContent?.teacherNotes && phonicsContent.teacherNotes.length > 0 && (
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">📝 Teacher Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {phonicsContent.teacherNotes.map((note, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Vocabulary List */}
            {phonicsContent?.vocabulary && phonicsContent.vocabulary.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">📚 Key Vocabulary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {phonicsContent.vocabulary.map((word, idx) => (
                      <Badge key={idx} variant="outline">{word}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Fallback for non-phonics structured content */}
            {!phonicsContent && typeof lesson.content === 'string' && (
              <Card>
                <CardHeader>
                  <CardTitle>Lesson Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap text-sm">{lesson.content}</pre>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
