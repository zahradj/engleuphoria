import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, FileSliders } from 'lucide-react';

interface SlideGeneratorProps {
  contentId: string;
  lessonTitle: string;
  hasSlides?: boolean;
  onSlidesGenerated?: () => void;
}

export const SlideGenerator: React.FC<SlideGeneratorProps> = ({
  contentId,
  lessonTitle,
  hasSlides = false,
  onSlidesGenerated
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSlides = async (slideCount: number = 25) => {
    setIsGenerating(true);
    
    try {
      console.log('Generating slides for lesson:', contentId, lessonTitle);
      
      const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
        body: {
          action: 'generate_full_deck',
          content_id: contentId,
          slide_count: slideCount
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Failed to generate slides');
      }

      toast({
        title: "Slides Generated Successfully",
        description: `Created ${data.total_slides} slides for "${lessonTitle}"`,
      });

      onSlidesGenerated?.();
      
    } catch (error) {
      console.error('Slide generation error:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate slides",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (hasSlides) {
    return null; // Don't show if slides already exist
  }

  return (
    <Button
      onClick={() => generateSlides(25)}
      disabled={isGenerating}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <FileSliders className="h-4 w-4" />
      )}
      {isGenerating ? 'Generating...' : 'Generate 25 Slides'}
    </Button>
  );
};