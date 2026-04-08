import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CurriculumGeneratorWizard } from './CurriculumGeneratorWizard';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

export interface CurriculumContext {
  system: string;
  level: string;
  ageGroup: string;
  levelId?: string;
}

interface CurriculumStepProps {
  onNextStep: () => void;
  onCurriculumSelected?: (ctx: CurriculumContext) => void;
}

export const CurriculumStep: React.FC<CurriculumStepProps> = ({ onNextStep, onCurriculumSelected }) => {
  const [selectedContext, setSelectedContext] = useState<CurriculumContext | null>(null);

  const handleCurriculumGenerated = (ctx: { system: string; level: string; ageGroup: string }) => {
    const context: CurriculumContext = { ...ctx };
    setSelectedContext(context);
    onCurriculumSelected?.(context);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Step 1: Curriculum</h1>
        <p className="text-muted-foreground mt-1">
          Generate a new curriculum with AI, then move on to generate lessons.
        </p>
      </div>

      {selectedContext && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <span className="text-sm text-foreground font-medium">Selected:</span>
          <Badge variant="secondary">{selectedContext.ageGroup}</Badge>
          <Badge variant="secondary">{selectedContext.level}</Badge>
          <Badge variant="outline">{selectedContext.system}</Badge>
        </div>
      )}

      <CurriculumGeneratorWizard onCurriculumGenerated={handleCurriculumGenerated} />

      {/* Next Step CTA */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button onClick={onNextStep} size="lg" className="gap-2">
          Next: Slide Builder
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
