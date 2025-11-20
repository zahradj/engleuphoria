import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CurriculumMaterial } from '@/types/curriculumExpert';
import { Clock, Target, BookOpen, Lightbulb } from 'lucide-react';

interface Props {
  material: CurriculumMaterial;
}

export const MaterialPreview = ({ material }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-2xl">{material.title}</CardTitle>
            <CardDescription>
              Ages {material.ageGroup} • {material.cefrLevel} • {material.durationMinutes} minutes
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge>{material.cefrLevel}</Badge>
            <Badge variant="outline">{material.ageGroup}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Learning Objectives */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-semibold">
            <Target className="h-4 w-4" />
            <span>Learning Objectives</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {material.learningObjectives.map((obj, i) => (
              <li key={i}>{obj}</li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Target Language */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="font-semibold text-sm">Grammar</div>
            <div className="flex flex-wrap gap-2">
              {material.targetLanguage.grammar.map((item, i) => (
                <Badge key={i} variant="secondary">{item}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-sm">Vocabulary</div>
            <div className="flex flex-wrap gap-2">
              {material.targetLanguage.vocabulary.map((item, i) => (
                <Badge key={i} variant="secondary">{item}</Badge>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Lesson Sections */}
        <div className="space-y-4">
          <Section title="📦 Materials" content={material.content.materials} />
          <Section title="🔥 Warm-Up (5 min)" content={material.content.warmUp} />
          <Section title="📊 Presentation (10 min)" content={material.content.presentation} />
          <Section title="✏️ Controlled Practice" content={material.content.controlledPractice} />
          <Section title="🗣️ Freer Practice" content={material.content.freerPractice} />
          
          {/* Assessment */}
          <div className="space-y-2">
            <div className="font-semibold">✅ Formative Assessment</div>
            <div className="space-y-2">
              {material.content.formativeAssessment.map((item, i) => (
                <div key={i} className="bg-muted p-3 rounded-md text-sm">
                  <div className="font-medium">{i + 1}. {item.question}</div>
                  <div className="text-muted-foreground mt-1">Answer: {item.answer}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Differentiation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="font-semibold text-sm">🟢 Easier</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {material.content.differentiation.easier.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <div className="font-semibold text-sm">🔴 Harder</div>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {material.content.differentiation.harder.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <Section title="📝 Homework" content={material.content.homework} />
          <Section title="💡 Teacher Tips" content={material.content.teacherTips} icon={<Lightbulb className="h-4 w-4" />} />
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