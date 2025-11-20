import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2 } from 'lucide-react';
import { AgeGroup, CEFRLevel } from '@/types/curriculumExpert';

interface MissionGeneratorFormProps {
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  onGenerate: (params: any) => void;
  isGenerating: boolean;
}

export const MissionGeneratorForm = ({
  ageGroup,
  cefrLevel,
  onGenerate,
  isGenerating
}: MissionGeneratorFormProps) => {
  const [missionTitle, setMissionTitle] = useState('');
  const [quests, setQuests] = useState([8]);
  const [narrative, setNarrative] = useState<string>('adventure');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSubmit = () => {
    onGenerate({
      mode: 'mission',
      prompt: customPrompt || `Create a ${narrative} learning mission titled "${missionTitle}" with ${quests[0]} quests for ages ${ageGroup} at ${cefrLevel} level.`,
      ageGroup,
      cefrLevel,
      missionChainLength: quests[0]
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="missionTitle">Mission Title</Label>
        <Input
          id="missionTitle"
          value={missionTitle}
          onChange={(e) => setMissionTitle(e.target.value)}
          placeholder="e.g., The Great Grammar Quest"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="narrative">Narrative Style</Label>
        <Select value={narrative} onValueChange={setNarrative}>
          <SelectTrigger id="narrative">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="mystery">Mystery</SelectItem>
            <SelectItem value="sci-fi">Sci-Fi</SelectItem>
            <SelectItem value="fantasy">Fantasy</SelectItem>
            <SelectItem value="real-world">Real-World</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quests">Number of Quests: {quests[0]}</Label>
        <Slider
          id="quests"
          value={quests}
          onValueChange={setQuests}
          min={5}
          max={15}
          step={1}
          className="py-4"
        />
        <p className="text-xs text-muted-foreground">
          Estimated completion: {quests[0]} weeks (1 quest per week)
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
        <Textarea
          id="prompt"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Add specific requirements for your mission..."
          rows={3}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isGenerating || !missionTitle.trim()}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Mission...
          </>
        ) : (
          'Generate Mission'
        )}
      </Button>
    </div>
  );
};
