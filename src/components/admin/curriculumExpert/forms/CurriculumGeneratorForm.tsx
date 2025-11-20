import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { AgeGroup, CEFRLevel } from '@/types/curriculumExpert';

interface CurriculumGeneratorFormProps {
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  onGenerate: (params: any) => void;
  isGenerating: boolean;
}

const CEFR_LEVELS: CEFRLevel[] = ['Pre-A1', 'A1', 'A2', 'B1', 'B2'];

export const CurriculumGeneratorForm = ({
  ageGroup,
  cefrLevel,
  onGenerate,
  isGenerating
}: CurriculumGeneratorFormProps) => {
  const [curriculumTitle, setCurriculumTitle] = useState('');
  const [startCEFR, setStartCEFR] = useState<CEFRLevel>(cefrLevel);
  const [endCEFR, setEndCEFR] = useState<CEFRLevel>(cefrLevel);
  const [months, setMonths] = useState([6]);
  const [goals, setGoals] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSubmit = () => {
    onGenerate({
      mode: 'curriculum',
      prompt: customPrompt || `Create a ${months[0]}-month curriculum titled "${curriculumTitle}" for ages ${ageGroup}, progressing from ${startCEFR} to ${endCEFR}. ${goals ? `Goals: ${goals}` : ''}`,
      ageGroup,
      cefrLevel: startCEFR,
      curriculumMonths: months[0]
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="curriculumTitle">Curriculum Title</Label>
        <Input
          id="curriculumTitle"
          value={curriculumTitle}
          onChange={(e) => setCurriculumTitle(e.target.value)}
          placeholder="e.g., Complete English for Young Learners"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startCEFR">Starting CEFR Level</Label>
          <Select value={startCEFR} onValueChange={(v) => setStartCEFR(v as CEFRLevel)}>
            <SelectTrigger id="startCEFR">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CEFR_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="endCEFR">Target CEFR Level</Label>
          <Select value={endCEFR} onValueChange={(v) => setEndCEFR(v as CEFRLevel)}>
            <SelectTrigger id="endCEFR">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CEFR_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="months">Duration: {months[0]} months</Label>
        <Slider
          id="months"
          value={months}
          onValueChange={setMonths}
          min={3}
          max={12}
          step={1}
          className="py-4"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="goals">Overarching Goals</Label>
        <Textarea
          id="goals"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          placeholder="Enter main goals for this curriculum..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
        <Textarea
          id="prompt"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Add specific requirements..."
          rows={3}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isGenerating || !curriculumTitle.trim()}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Curriculum...
          </>
        ) : (
          'Generate Curriculum'
        )}
      </Button>
    </div>
  );
};
