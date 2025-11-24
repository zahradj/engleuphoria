import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface VocabularyImageData {
  source: 'upload' | 'ai-generated' | 'none';
  url?: string;
  prompt?: string;
  file?: File;
}

interface IntroScreenData {
  source: 'upload' | 'ai-generated' | 'default';
  url?: string;
  file?: File;
  prompt?: string;
}

interface GenerateLessonParams {
  topic: string;
  cefrLevel: string;
  ageGroup: string;
  duration: number;
  vocabularyList: string[];
  grammarFocus: string[];
  learningObjectives: string[];
  selectedActivities: string[];
  vocabularyImages?: Record<string, VocabularyImageData>;
  introScreen?: IntroScreenData;
}

export function useGenerateInteractiveLesson() {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateLesson = async (params: GenerateLessonParams) => {
    setIsGenerating(true);

    try {
      // Prepare the request body with image data
      const requestBody = {
        ...params,
        vocabularyImages: params.vocabularyImages || {},
        introScreen: params.introScreen || { source: 'default' }
      };

      const { data, error } = await supabase.functions.invoke('interactive-lesson-generator', {
        body: requestBody
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
