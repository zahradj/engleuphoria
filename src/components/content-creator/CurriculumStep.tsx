import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CurriculumGeneratorWizard } from './CurriculumGeneratorWizard';
import { CurriculumBuilder } from '@/components/admin/CurriculumBuilder';
import { ArrowRight, Wand2, Edit3 } from 'lucide-react';

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
  const [activeSubTab, setActiveSubTab] = useState<string>('generate');
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
          Create a new curriculum with AI or edit an existing one, then move on to generate lessons.
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

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="generate" className="flex-1 gap-2">
            <Wand2 className="h-4 w-4" />
            Generate New
          </TabsTrigger>
          <TabsTrigger value="edit" className="flex-1 gap-2">
            <Edit3 className="h-4 w-4" />
            Edit Existing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <CurriculumGeneratorWizard onCurriculumGenerated={handleCurriculumGenerated} />
        </TabsContent>

        <TabsContent value="edit" className="mt-6">
          <CurriculumBuilder />
        </TabsContent>
      </Tabs>

      {/* Next Step CTA */}
      <div className="flex justify-end pt-4 border-t border-border">
        <Button onClick={onNextStep} size="lg" className="gap-2">
          Next: Generate Lessons
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
