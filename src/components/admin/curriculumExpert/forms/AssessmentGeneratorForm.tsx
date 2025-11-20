import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { AgeGroup, CEFRLevel } from '@/types/curriculumExpert';

interface AssessmentGeneratorFormProps {
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  onGenerate: (params: any) => void;
  isGenerating: boolean;
}

const SKILL_AREAS = ['reading', 'writing', 'listening', 'speaking', 'grammar', 'vocabulary'];

export const AssessmentGeneratorForm = ({
  ageGroup,
  cefrLevel,
  onGenerate,
  isGenerating
}: AssessmentGeneratorFormProps) => {
  const [assessmentTitle, setAssessmentTitle] = useState('');
  const [assessmentType, setAssessmentType] = useState<'placement' | 'progress' | 'final'>('progress');
  const [duration, setDuration] = useState('45');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['reading', 'writing', 'grammar', 'vocabulary']);
  const [customPrompt, setCustomPrompt] = useState('');

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = () => {
    onGenerate({
      mode: 'assessment',
      prompt: customPrompt || `Create a ${duration}-minute ${assessmentType} assessment titled "${assessmentTitle}" for ages ${ageGroup} at ${cefrLevel} level, testing: ${selectedSkills.join(', ')}.`,
      ageGroup,
      cefrLevel,
      duration: parseInt(duration) || 45,
      assessmentType
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="assessmentTitle">Assessment Title</Label>
        <Input
          id="assessmentTitle"
          value={assessmentTitle}
          onChange={(e) => setAssessmentTitle(e.target.value)}
          placeholder="e.g., Unit 3 Progress Test"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assessmentType">Assessment Type</Label>
          <Select value={assessmentType} onValueChange={(v: any) => setAssessmentType(v)}>
            <SelectTrigger id="assessmentType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="placement">Placement Test</SelectItem>
              <SelectItem value="progress">Progress Check</SelectItem>
              <SelectItem value="final">Final Assessment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger id="duration">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">30 minutes</SelectItem>
              <SelectItem value="45">45 minutes</SelectItem>
              <SelectItem value="60">60 minutes</SelectItem>
              <SelectItem value="90">90 minutes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Skill Areas to Test</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {SKILL_AREAS.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={selectedSkills.includes(skill)}
                onCheckedChange={() => toggleSkill(skill)}
              />
              <label
                htmlFor={skill}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
              >
                {skill}
              </label>
            </div>
          ))}
        </div>
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
        disabled={isGenerating || !assessmentTitle.trim() || selectedSkills.length === 0}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Assessment...
          </>
        ) : (
          'Generate Assessment'
        )}
      </Button>
    </div>
  );
};
