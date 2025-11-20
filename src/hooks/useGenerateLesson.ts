import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LessonGenerationParams } from '@/services/earlyLearners/lessonPromptTemplate';

export function useGenerateLesson() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lesson, setLesson] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const generateLesson = async (params: LessonGenerationParams) => {
    setIsGenerating(true);
    setError(null);
    setProgress(0);
    
    try {
      toast({ title: "Generating lesson...", description: "This may take 30-60 seconds" });
      
      const { data, error: functionError } = await supabase.functions.invoke('generate-early-learner-lesson', {
        body: params
      });
      
      if (functionError) {
        if (functionError.message?.includes('429')) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }
        if (functionError.message?.includes('402')) {
          throw new Error('AI credits depleted. Please add credits to your workspace.');
        }
        throw functionError;
      }
      
      if (!data) {
        throw new Error('No data received from lesson generation');
      }
      
      setProgress(50);
      
      // Save to database
      const { data: savedLesson, error: saveError } = await supabase
        .from('early_learners_lessons')
        .insert({
          title: data.title || `Lesson ${params.lessonNumber}: ${params.topic}`,
          topic: data.topic || params.topic,
          phonics_focus: data.phonicsFocus || params.phonicsFocus,
          lesson_number: data.lessonNumber || params.lessonNumber,
          difficulty_level: data.difficultyLevel || params.difficultyLevel,
          learning_objectives: data.learningObjectives || params.learningObjectives || [],
          duration_minutes: data.durationMinutes || 30,
          components: data.components || {},
          multimedia_manifest: data.multimedia || {
            totalImages: 0,
            totalAudioFiles: 0,
            images: [],
            audioFiles: [],
            generationProgress: 0
          },
          gamification: data.gamification || {
            rewards: { starsPerActivity: 1, totalStarsAvailable: 0, badges: [] },
            adaptiveFeatures: { difficultyAdjustment: true, hintsEnabled: true, encouragementMessages: [] },
            celebrationAnimations: []
          },
          status: 'draft'
        })
        .select()
        .single();
      
      if (saveError) {
        console.error('Save error:', saveError);
        throw new Error('Failed to save lesson to database');
      }
      
      setProgress(100);
      setLesson({ ...data, id: savedLesson.id });
      
      toast({ 
        title: "Lesson Generated Successfully", 
        description: "Ready for multimedia generation"
      });
      
      return { ...data, id: savedLesson.id };
    } catch (error: any) {
      console.error('Generation error:', error);
      const errorMessage = error.message || 'Failed to generate lesson';
      setError(errorMessage);
      toast({ 
        title: "Generation Failed", 
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };
  
  const resetLesson = () => {
    setLesson(null);
    setProgress(0);
    setError(null);
  };
  
  return { 
    generateLesson, 
    isGenerating, 
    lesson, 
    progress, 
    error,
    resetLesson
  };
}
