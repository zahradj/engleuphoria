import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AgeGroup, CEFRLevel } from '@/types/curriculumExpert';

interface UnitGeneratorFormProps {
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  onGenerate: (params: any) => void;
  isGenerating: boolean;
}

export const UnitGeneratorForm = ({
  ageGroup,
  cefrLevel,
  onGenerate,
  isGenerating
}: UnitGeneratorFormProps) => {
  const [unitTitle, setUnitTitle] = useState('');
  const [weeks, setWeeks] = useState('6');
  const [objectives, setObjectives] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSubmit = () => {
    onGenerate({
      mode: 'unit',
      prompt: customPrompt || `Create a ${weeks}-week unit titled "${unitTitle}" for ages ${ageGroup} at ${cefrLevel} level. ${objectives ? `Objectives: ${objectives}` : ''}`,
      ageGroup,
      cefrLevel,
      unitWeeks: parseInt(weeks) || 6
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="unitTitle">Unit Title</Label>
        <Input
          id="unitTitle"
          value={unitTitle}
          onChange={(e) => setUnitTitle(e.target.value)}
          placeholder="e.g., Exploring Our Community"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="weeks">Duration (weeks)</Label>
        <Select value={weeks} onValueChange={setWeeks}>
          <SelectTrigger id="weeks">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">4 weeks</SelectItem>
            <SelectItem value="6">6 weeks</SelectItem>
            <SelectItem value="8">8 weeks</SelectItem>
            <SelectItem value="12">12 weeks</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="objectives">Overall Objectives</Label>
        <Textarea
          id="objectives"
          value={objectives}
          onChange={(e) => setObjectives(e.target.value)}
          placeholder="Enter main learning objectives for this unit..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
        <Textarea
          id="prompt"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Add specific requirements for your unit..."
          rows={3}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isGenerating || !unitTitle.trim()}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Unit...
          </>
        ) : (
          'Generate Unit'
        )}
      </Button>
    </div>
  );
};
