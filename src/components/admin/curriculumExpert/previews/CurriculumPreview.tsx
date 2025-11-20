import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CurriculumContent } from '@/types/curriculumExpert';
import { GraduationCap, TrendingUp, Calendar } from 'lucide-react';

interface CurriculumPreviewProps {
  content: CurriculumContent;
}

export const CurriculumPreview = ({ content }: CurriculumPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{content.curriculumTitle}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ages {content.ageGroup} • {content.startCEFR} → {content.endCEFR} • {content.durationMonths} months
            </p>
          </div>
          <div className="flex gap-2">
            <Badge>{content.startCEFR} → {content.endCEFR}</Badge>
            <Badge variant="outline">{content.ageGroup}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <GraduationCap className="h-4 w-4" />
            <span>Overarching Goals</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {content.overarchingGoals.map((goal, i) => (
              <li key={i}>{goal}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4" />
            <span>Units Overview</span>
          </div>
          <div className="space-y-2">
            {content.units.map((unit, i) => (
              <Card key={i}>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Unit {unit.unitNumber}: {unit.title}</h4>
                      <Badge>{unit.cefrLevel}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{unit.weeks} weeks</p>
                    <div className="flex flex-wrap gap-2">
                      {unit.focusAreas.map((area, j) => (
                        <Badge key={j} variant="secondary" className="text-xs">{area}</Badge>
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
          <div className="flex items-center gap-2 font-semibold">
            <Calendar className="h-4 w-4" />
            <span>Assessment Schedule</span>
          </div>
          <div className="space-y-2">
            {content.assessmentSchedule.map((assessment, i) => (
              <div key={i} className="bg-muted p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">Week {assessment.week}</span>
                    <span className="text-muted-foreground text-sm"> - {assessment.type}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">{assessment.focus}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="font-semibold">Progression Map</div>
          <div className="space-y-3">
            <div className="bg-muted p-3 rounded-md">
              <div className="font-medium text-sm mb-2">Grammar Progression:</div>
              <div className="flex flex-wrap gap-2">
                {content.progressionMap.grammar.map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{item}</Badge>
                ))}
              </div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="font-medium text-sm mb-2">Vocabulary Progression:</div>
              <div className="flex flex-wrap gap-2">
                {content.progressionMap.vocabulary.map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{item}</Badge>
                ))}
              </div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="font-medium text-sm mb-2">Skills Progression:</div>
              <div className="flex flex-wrap gap-2">
                {content.progressionMap.skills.map((item, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{item}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold">Resource Requirements</div>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {content.resourceRequirements.map((resource, i) => (
              <li key={i}>{resource}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="font-semibold">Implementation Guide</div>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content.implementationGuide}</p>
        </div>
      </CardContent>
    </Card>
  );
};
