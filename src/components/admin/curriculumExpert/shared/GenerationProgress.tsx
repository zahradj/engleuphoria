import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { ECAMode } from '@/types/curriculumExpert';

interface GenerationProgressProps {
  mode: ECAMode;
}

const MODE_MESSAGES: Record<ECAMode, string[]> = {
  lesson: [
    'Analyzing learning objectives...',
    'Designing lesson structure...',
    'Creating activities and exercises...',
    'Finalizing lesson plan...'
  ],
  unit: [
    'Planning unit progression...',
    'Mapping learning sequence...',
    'Designing weekly lessons...',
    'Creating assessments...',
    'Finalizing unit plan...'
  ],
  curriculum: [
    'Analyzing CEFR progression...',
    'Designing curriculum structure...',
    'Planning assessment schedule...',
    'Creating implementation guide...',
    'Finalizing curriculum...'
  ],
  assessment: [
    'Designing test structure...',
    'Creating questions...',
    'Developing rubrics...',
    'Finalizing assessment...'
  ],
  mission: [
    'Crafting mission narrative...',
    'Designing quest chain...',
    'Creating gamification elements...',
    'Finalizing mission...'
  ],
  resource: [
    'Designing resource layout...',
    'Creating content...',
    'Generating answer key...',
    'Finalizing resource...'
  ]
};

export const GenerationProgress = ({ mode }: GenerationProgressProps) => {
  const messages = MODE_MESSAGES[mode];
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <div className="text-center space-y-2">
            <h3 className="font-semibold text-lg">Generating Your {mode.charAt(0).toUpperCase() + mode.slice(1)}</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              {messages.map((message, i) => (
                <div key={i} className="animate-pulse" style={{ animationDelay: `${i * 200}ms` }}>
                  {message}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
