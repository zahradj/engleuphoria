import React, { useState } from 'react';
import { Wand2, HelpCircle, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreatorStudioAIToolsProps {
  content: string;
  level: string;
  track: string;
}

export const CreatorStudioAITools: React.FC<CreatorStudioAIToolsProps> = ({
  content,
  level,
  track,
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!content.trim()) {
      toast.error('Write some content first');
      return;
    }
    setLoading('quiz');
    try {
      const { data, error } = await supabase.functions.invoke('quiz-generator', {
        body: {
          topic: content.slice(0, 500),
          level,
          systemType: track,
          questionCount: 5,
        },
      });
      if (error) throw error;
      toast.success('Quiz generated! Check the Quiz Generator tab.');
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to generate quiz');
    } finally {
      setLoading(null);
    }
  };

  const handleExtractVocabulary = async () => {
    if (!content.trim()) {
      toast.error('Write some content first');
      return;
    }
    setLoading('vocab');
    try {
      const { data, error } = await supabase.functions.invoke('curriculum-expert-agent', {
        body: {
          prompt: `Extract key vocabulary from this ${level} level lesson content. Return a JSON array of objects with "word", "definition", and "example" fields:\n\n${content.slice(0, 2000)}`,
          mode: 'vocabulary_extraction',
        },
      });
      if (error) throw error;
      toast.success('Vocabulary extracted! Results saved to AI metadata.');
      setOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to extract vocabulary');
    } finally {
      setLoading(null);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Wand2 className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-56 p-2">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-muted-foreground px-2 py-1">AI Magic Tools</p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleGenerateQuiz}
            disabled={!!loading}
          >
            {loading === 'quiz' ? <Loader2 className="h-4 w-4 animate-spin" /> : <HelpCircle className="h-4 w-4" />}
            Generate Quiz
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={handleExtractVocabulary}
            disabled={!!loading}
          >
            {loading === 'vocab' ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
            Extract Vocabulary
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
