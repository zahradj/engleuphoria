import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AssessmentContent } from '@/types/curriculumExpert';
import { ClipboardCheck, FileText } from 'lucide-react';

interface AssessmentPreviewProps {
  content: AssessmentContent;
}

export const AssessmentPreview = ({ content }: AssessmentPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{content.assessmentTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ages {content.ageGroup} • {content.cefrLevel} • {content.duration} minutes
            </p>
          </div>
          <div className="flex gap-2">
            <Badge>{content.cefrLevel}</Badge>
            <Badge variant="outline">{content.assessmentType}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <ClipboardCheck className="h-4 w-4" />
            <span>Assessment Sections</span>
          </div>
          <div className="space-y-3">
            {content.sections.map((section, i) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{section.sectionName}</h4>
                      <Badge variant="outline">{section.skillArea}</Badge>
                    </div>
                    <div className="space-y-2">
                      {section.questions.map((question, j) => (
                        <div key={j} className="bg-muted p-3 rounded-md">
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-medium text-sm">Question {question.questionNumber}</span>
                            <Badge variant="secondary" className="text-xs">{question.points} pts</Badge>
                          </div>
                          <p className="text-sm mb-2">{question.questionText}</p>
                          <div className="text-xs text-muted-foreground">
                            <div>Type: {question.questionType.replace(/_/g, ' ')}</div>
                            {question.options && question.options.length > 0 && (
                              <div className="mt-1">
                                Options: {question.options.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="font-semibold">Rubric</div>
          <div className="space-y-2">
            {content.rubric.criteria.map((criterion, i) => (
              <div key={i} className="bg-muted p-3 rounded-md">
                <div className="font-medium text-sm mb-2">{criterion.criterion}</div>
                <div className="flex flex-wrap gap-2">
                  {criterion.levels.map((level, j) => (
                    <Badge key={j} variant="secondary" className="text-xs">{level}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold">Scoring Guide</div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.scoringGuide}</p>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold">Answer Key</div>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.answerKey}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <FileText className="h-4 w-4" />
            <span>Teacher Instructions</span>
          </div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.teacherInstructions}</p>
        </div>
      </CardContent>
    </Card>
  );
};
