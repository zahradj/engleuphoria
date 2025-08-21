import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Play } from 'lucide-react';

export const ManualSlideGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateSlides = async () => {
    setIsGenerating(true);
    
    try {
      console.log('Manually generating slides for Greetings and Introductions...');
      
      const { data, error } = await supabase.functions.invoke('ai-slide-generator', {
        body: {
          action: 'generate_full_deck',
          content_id: '597db0a1-0770-4e28-86a1-1f4ef2d564a1',
          slide_count: 25
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message);
      }

      if (!data?.success) {
        console.error('Generation failed:', data);
        throw new Error(data?.error || 'Failed to generate slides');
      }

      console.log('Successfully generated slides:', data);
      
      toast({
        title: "Success!",
        description: `Generated ${data.total_slides} slides for Greetings and Introductions`,
      });
      
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

  return (
    <div className="p-4 border rounded-lg bg-blue-50">
      <h3 className="font-medium mb-2">Generate Lesson Slides</h3>
      <p className="text-sm text-muted-foreground mb-3">
        Click to generate 25 interactive slides for "Greetings and Introductions" lesson.
      </p>
      <Button onClick={generateSlides} disabled={isGenerating} className="gap-2">
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Play className="h-4 w-4" />
        )}
        {isGenerating ? 'Generating Slides...' : 'Generate 25 Slides'}
      </Button>
    </div>
  );
};