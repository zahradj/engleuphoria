import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UnitContent } from '@/types/curriculumExpert';
import { Calendar, Target, BookOpen } from 'lucide-react';

interface UnitPreviewProps {
  content: UnitContent;
}

export const UnitPreview = ({ content }: UnitPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{content.unitTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ages {content.ageGroup} • {content.cefrLevel} • {content.durationWeeks} weeks
            </p>
          </div>
          <div className="flex gap-2">
            <Badge>{content.cefrLevel}</Badge>
            <Badge variant="outline">{content.ageGroup}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Target className="h-4 w-4" />
            <span>Overall Objectives</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {content.overallObjectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-semibold text-sm">Grammar Progression</div>
            <div className="flex flex-wrap gap-2">
              {content.grammarProgression.map((item, i) => (
                <Badge key={i} variant="secondary">{item}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-sm">Vocabulary Themes</div>
            <div className="flex flex-wrap gap-2">
              {content.vocabularyThemes.map((item, i) => (
                <Badge key={i} variant="secondary">{item}</Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4" />
            <span>Lesson Breakdown</span>
          </div>
          <div className="space-y-3">
            {content.lessons.map((lesson, i) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Week {lesson.weekNumber}, Lesson {lesson.lessonNumber}</h4>
                      <Badge variant="outline">Lesson {i + 1}</Badge>
                    </div>
                    <h5 className="font-medium text-sm">{lesson.title}</h5>
                    <div className="text-sm text-muted-foreground">
                      <div className="font-medium">Objectives:</div>
                      <ul className="list-disc list-inside ml-2">
                        {lesson.objectives.map((obj, j) => (
                          <li key={j}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="font-medium">Activities:</div>
                      <ul className="list-disc list-inside ml-2">
                        {lesson.activities.map((activity, j) => (
                          <li key={j}>{activity}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="font-semibold">Assessment</div>
          <div className="grid gap-3">
            <div className="bg-muted p-3 rounded-md">
              <div className="font-medium text-sm mb-2">Formative Assessments:</div>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {content.unitAssessment.formative.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="font-medium text-sm mb-2">Summative Assessment:</div>
              <p className="text-sm text-muted-foreground">{content.unitAssessment.summative}</p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold">Resources Needed</div>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {content.resources.map((resource, i) => (
              <li key={i}>{resource}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold">Teacher Notes</div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.teacherNotes}</p>
        </div>
      </CardContent>
    </Card>
  );
};
