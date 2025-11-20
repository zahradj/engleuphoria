import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { AgeGroup, CEFRLevel } from '@/types/curriculumExpert';

interface ResourceGeneratorFormProps {
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  onGenerate: (params: any) => void;
  isGenerating: boolean;
}

export const ResourceGeneratorForm = ({
  ageGroup,
  cefrLevel,
  onGenerate,
  isGenerating
}: ResourceGeneratorFormProps) => {
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceType, setResourceType] = useState<'worksheet' | 'reading' | 'listening' | 'flashcards'>('worksheet');
  const [topic, setTopic] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSubmit = () => {
    onGenerate({
      mode: 'resource',
      prompt: customPrompt || `Create a ${resourceType} titled "${resourceTitle}" about ${topic} for ages ${ageGroup} at ${cefrLevel} level.`,
      ageGroup,
      cefrLevel,
      resourceType,
      topic
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="resourceTitle">Resource Title</Label>
        <Input
          id="resourceTitle"
          value={resourceTitle}
          onChange={(e) => setResourceTitle(e.target.value)}
          placeholder="e.g., Family Members Vocabulary"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="resourceType">Resource Type</Label>
          <Select value={resourceType} onValueChange={(v: any) => setResourceType(v)}>
            <SelectTrigger id="resourceType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="worksheet">Worksheet</SelectItem>
              <SelectItem value="reading">Reading Passage</SelectItem>
              <SelectItem value="listening">Listening Activity</SelectItem>
              <SelectItem value="flashcards">Flashcards</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Animals"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
        <Textarea
          id="prompt"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Add specific requirements for your resource..."
          rows={3}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isGenerating || !resourceTitle.trim() || !topic.trim()}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Resource...
          </>
        ) : (
          'Generate Resource'
        )}
      </Button>
    </div>
  );
};
