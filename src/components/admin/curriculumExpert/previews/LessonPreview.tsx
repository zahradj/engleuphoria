import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LessonContent } from '@/types/curriculumExpert';
import { Target, Lightbulb } from 'lucide-react';

interface LessonPreviewProps {
  content: LessonContent;
  title: string;
  ageGroup: string;
  cefrLevel: string;
  objectives: string[];
  targetLanguage: { grammar: string[]; vocabulary: string[] };
}

export const LessonPreview = ({
  content,
  title,
  ageGroup,
  cefrLevel,
  objectives,
  targetLanguage
}: LessonPreviewProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ages {ageGroup} • {cefrLevel}
            </p>
          </div>
          <div className="flex gap-2">
            <Badge>{cefrLevel}</Badge>
            <Badge variant="outline">{ageGroup}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Target className="h-4 w-4" />
            <span>Learning Objectives</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {objectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-semibold text-sm">Grammar</div>
            <div className="flex flex-wrap gap-2">
              {targetLanguage.grammar.map((item, i) => (
                <Badge key={i} variant="secondary">{item}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-sm">Vocabulary</div>
            <div className="flex flex-wrap gap-2">
              {targetLanguage.vocabulary.map((item, i) => (
                <Badge key={i} variant="secondary">{item}</Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <Section title="📦 Materials" content={content.materials} />
          <Section title="🔥 Warm-Up" content={content.warmUp} />
          <Section title="📊 Presentation" content={content.presentation} />
          <Section title="✏️ Controlled Practice" content={content.controlledPractice} />
          <Section title="🗣️ Freer Practice" content={content.freerPractice} />
          
          <div className="space-y-2">
            <div className="font-semibold">✅ Formative Assessment</div>
            <div className="space-y-2">
              {content.formativeAssessment.map((item, i) => (
                <div key={i} className="bg-muted p-3 rounded-md text-sm">
                  <div className="font-medium">{i + 1}. {item.question}</div>
                  <div className="text-muted-foreground mt-1">Answer: {item.answer}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="font-semibold text-sm">🟢 Easier</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {content.differentiation.easier.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-sm">🔴 Harder</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {content.differentiation.harder.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <Section title="📝 Homework" content={content.homework} />
          <Section title="💡 Teacher Tips" content={content.teacherTips} icon={<Lightbulb className="h-4 w-4" />} />
        </div>
      </CardContent>
    </Card>
  );
};

const Section = ({ title, content, icon }: { title: string; content: string; icon?: React.ReactNode }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 font-semibold">
      {icon}
      <span>{title}</span>
    </div>
    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
  </div>
);
