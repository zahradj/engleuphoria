import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GenerateLessonParams {
  topic: string;
  cefrLevel: string;
  ageGroup: string;
  duration: number;
  vocabularyList: string[];
  grammarFocus: string[];
  learningObjectives: string[];
  selectedActivities: string[];
}

export function useGenerateInteractiveLesson() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateLesson = async (params: GenerateLessonParams) => {
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke('interactive-lesson-generator', {
        body: params
      });

      if (error) {
        console.error('Edge function error:', error);
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || 'Failed to generate lesson');
      }

      toast({
        title: "Lesson Created!",
        description: `"${data.lesson.title}" has been successfully generated with ${data.lesson.screens_data?.length || 0} screens.`,
      });

      return data.lesson;

    } catch (error) {
      console.error('Lesson generation error:', error);
      
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate lesson. Please try again.",
        variant: "destructive"
      });

      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateLesson,
    isGenerating
  };
}
