import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useECAGenerator } from '@/hooks/useECAGenerator';
import { ECAModeSelector } from './ECAModeSelector';
import { TemplateSelector } from './TemplateSelector';
import { QuickActionButtons } from './QuickActionButtons';
import { MaterialPreview } from './MaterialPreview';
import { GenerationProgress } from './shared/GenerationProgress';
import { SaveMaterialDialog } from './shared/SaveMaterialDialog';
import { ExportOptions } from './shared/ExportOptions';
import { LessonGeneratorForm } from './forms/LessonGeneratorForm';
import { UnitGeneratorForm } from './forms/UnitGeneratorForm';
import { CurriculumGeneratorForm } from './forms/CurriculumGeneratorForm';
import { AssessmentGeneratorForm } from './forms/AssessmentGeneratorForm';
import { MissionGeneratorForm } from './forms/MissionGeneratorForm';
import { ResourceGeneratorForm } from './forms/ResourceGeneratorForm';
import { AgeGroup, CEFRLevel, ECAMode } from '@/types/curriculumExpert';
import { Save } from 'lucide-react';

const AGE_GROUPS: AgeGroup[] = ['5-7', '8-11', '12-14', '15-17'];
const CEFR_LEVELS: CEFRLevel[] = ['Pre-A1', 'A1', 'A2', 'B1', 'B2'];

export const ECAGenerator = () => {
  const [mode, setMode] = useState<ECAMode>('lesson');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('8-11');
  const [cefrLevel, setCefrLevel] = useState<CEFRLevel>('A2');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const { isGenerating, currentMode, generatedContent, generateContent } = useECAGenerator();

  const handleGenerate = async (params: any) => {
    await generateContent({ ...params, templateId: selectedTemplateId });
  };

  const renderForm = () => {
    const formProps = {
      ageGroup: selectedAgeGroup,
      cefrLevel,
      onGenerate: handleGenerate,
      isGenerating
    };

    switch (mode) {
      case 'lesson':
        return <LessonGeneratorForm {...formProps} />;
      case 'unit':
        return <UnitGeneratorForm {...formProps} />;
      case 'curriculum':
        return <CurriculumGeneratorForm {...formProps} />;
      case 'assessment':
        return <AssessmentGeneratorForm {...formProps} />;
      case 'mission':
        return <MissionGeneratorForm {...formProps} />;
      case 'resource':
        return <ResourceGeneratorForm {...formProps} />;
    }
  };

  return (
    <div className="space-y-6">
      <ECAModeSelector selectedMode={mode} onModeChange={setMode} />

      <Card>
        <CardHeader>
          <CardTitle>Select Age Group & Level</CardTitle>
          <CardDescription>Choose the target audience for your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {AGE_GROUPS.map((age) => (
              <Button
                key={age}
                variant={selectedAgeGroup === age ? 'default' : 'outline'}
                onClick={() => setSelectedAgeGroup(age)}
                className="h-16"
              >
                Ages {age}
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cefrLevel">CEFR Level</Label>
            <Select value={cefrLevel} onValueChange={(v) => setCefrLevel(v as CEFRLevel)}>
              <SelectTrigger id="cefrLevel">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CEFR_LEVELS.map((level) => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Template Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <TemplateSelector
            mode={mode}
            ageGroup={selectedAgeGroup}
            cefrLevel={cefrLevel}
            selectedTemplateId={selectedTemplateId}
            onTemplateSelect={setSelectedTemplateId}
          />
        </CardContent>
      </Card>

      <QuickActionButtons
        ageGroup={selectedAgeGroup}
        mode={mode}
        onActionClick={(prompt) => handleGenerate({ mode, prompt, ageGroup: selectedAgeGroup, cefrLevel })}
        isGenerating={isGenerating}
      />

      <Card>
        <CardHeader>
          <CardTitle>Generate {mode.charAt(0).toUpperCase() + mode.slice(1)}</CardTitle>
        </CardHeader>
        <CardContent>
          {renderForm()}
        </CardContent>
      </Card>

      {isGenerating && <GenerationProgress mode={currentMode} />}

      {generatedContent && !isGenerating && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setShowSaveDialog(true)}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <ExportOptions content={generatedContent} filename={`${mode}-${Date.now()}`} />
          </div>
          <MaterialPreview material={generatedContent} mode={mode} />
        </div>
      )}

      <SaveMaterialDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        mode={mode}
        content={generatedContent}
        ageGroup={selectedAgeGroup}
        cefrLevel={cefrLevel}
      />
    </div>
  );
};
