import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader2, BookOpen, Target, Clock, Sparkles } from 'lucide-react';
import { useECACurriculum } from '@/hooks/useECACurriculum';
import { supabase } from '@/integrations/supabase/client';
import { UnitDetailView } from './UnitDetailView';

interface CurriculumDetailViewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  curriculumId: string;
  curriculum: any;
}

export const CurriculumDetailView = ({ open, onOpenChange, curriculumId, curriculum }: CurriculumDetailViewProps) => {
  const { generateUnitsFromCurriculum, isLoading } = useECACurriculum();
  const [generatedUnits, setGeneratedUnits] = useState<any[]>([]);
  const [loadingUnits, setLoadingUnits] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<any>(null);

  useEffect(() => {
    if (open && curriculumId) {
      loadGeneratedUnits();
    }
  }, [open, curriculumId]);

  const loadGeneratedUnits = async () => {
    setLoadingUnits(true);
    try {
      const { data, error } = await supabase
        .from('curriculum_units')
        .select('*')
        .eq('program_id', curriculumId)
        .order('unit_number');
        
      if (!error && data) {
        setGeneratedUnits(data);
      }
    } catch (error) {
      console.error('Failed to load units:', error);
    } finally {
      setLoadingUnits(false);
    }
  };

  const handleGenerateUnits = async () => {
    try {
      await generateUnitsFromCurriculum(curriculumId);
      await loadGeneratedUnits();
    } catch (error) {
      console.error('Generation failed:', error);
    }
  };

  const programData = curriculum.program_data || {};
  const outlineUnits = programData.units || [];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{curriculum.title}</DialogTitle>
            <DialogDescription>
              {curriculum.age_group} • {curriculum.cefr_level} • {programData.durationMonths} months
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Overview */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="w-4 h-4" />
                Overarching Goals
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {programData.overarchingGoals?.map((goal: string, idx: number) => (
                  <li key={idx}>{goal}</li>
                ))}
              </ul>
            </div>

            {/* Units Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Units ({generatedUnits.length > 0 ? `${generatedUnits.length} Generated` : `${outlineUnits.length} Outlined`})
                </h3>
                {generatedUnits.length === 0 && outlineUnits.length > 0 && (
                  <Button 
                    onClick={handleGenerateUnits}
                    disabled={isLoading}
                    size="sm"
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Detailed Units
                      </>
                    )}
                  </Button>
                )}
              </div>

              {loadingUnits ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : generatedUnits.length > 0 ? (
                <div className="grid gap-3">
                  {generatedUnits.map((unit) => (
                    <Card key={unit.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelectedUnit(unit)}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Unit {unit.unit_number}</Badge>
                            <Badge>{unit.cefr_level}</Badge>
                            {unit.unit_data?.lessons?.length > 0 && (
                              <Badge variant="secondary">
                                {unit.unit_data.lessons.length} lessons
                              </Badge>
                            )}
                          </div>
                          <h4 className="font-semibold">{unit.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {unit.learning_objectives?.slice(0, 2).join(' • ')}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {unit.duration_weeks} weeks
                            </span>
                            <span>Grammar: {unit.grammar_focus?.length || 0}</span>
                            <span>Vocab: {unit.vocabulary_themes?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid gap-3">
                  {outlineUnits.map((unit: any) => (
                    <Card key={unit.unitNumber} className="p-4 bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Unit {unit.unitNumber}</Badge>
                        <Badge variant="secondary">{unit.cefrLevel}</Badge>
                      </div>
                      <h4 className="font-semibold">{unit.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {unit.focusAreas?.join(' • ')}
                      </p>
                      <div className="text-xs text-muted-foreground mt-2">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {unit.weeks} weeks
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {selectedUnit && (
        <UnitDetailView
          open={!!selectedUnit}
          onOpenChange={(open) => !open && setSelectedUnit(null)}
          unit={selectedUnit}
          onLessonsGenerated={loadGeneratedUnits}
        />
      )}
    </>
  );
};
