import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { AgeGroup, CEFRLevel } from '@/types/curriculumExpert';

interface LessonGeneratorFormProps {
  ageGroup: AgeGroup;
  cefrLevel: CEFRLevel;
  onGenerate: (params: any) => void;
  isGenerating: boolean;
}

export const LessonGeneratorForm = ({
  ageGroup,
  cefrLevel,
  onGenerate,
  isGenerating
}: LessonGeneratorFormProps) => {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('45');
  const [grammarFocus, setGrammarFocus] = useState('');
  const [vocabularyTheme, setVocabularyTheme] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSubmit = () => {
    onGenerate({
      mode: 'lesson',
      prompt: customPrompt || `Create a ${duration}-minute lesson for ages ${ageGroup} at ${cefrLevel} level${topic ? ` about ${topic}` : ''}${grammarFocus ? ` focusing on ${grammarFocus}` : ''}${vocabularyTheme ? ` with vocabulary theme: ${vocabularyTheme}` : ''}.`,
      ageGroup,
      cefrLevel,
      duration: parseInt(duration) || 45,
      topic,
      grammarFocus,
      vocabularyTheme
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="45"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Daily routines"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grammar">Grammar Focus</Label>
          <Input
            id="grammar"
            value={grammarFocus}
            onChange={(e) => setGrammarFocus(e.target.value)}
            placeholder="Present Simple"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vocabulary">Vocabulary Theme</Label>
        <Input
          id="vocabulary"
          value={vocabularyTheme}
          onChange={(e) => setVocabularyTheme(e.target.value)}
          placeholder="Food and meals"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prompt">Custom Prompt (Optional)</Label>
        <Textarea
          id="prompt"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Describe specific requirements for your lesson..."
          rows={3}
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isGenerating}
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating Lesson...
          </>
        ) : (
          'Generate Lesson'
        )}
      </Button>
    </div>
  );
};
