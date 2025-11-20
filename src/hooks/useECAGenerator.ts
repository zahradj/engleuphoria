import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { GenerationParams, ECAMode } from '@/types/curriculumExpert';

export function useECAGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentMode, setCurrentMode] = useState<ECAMode>('lesson');
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const { toast } = useToast();

  const generateContent = useCallback(async (params: GenerationParams) => {
    try {
      setIsGenerating(true);
      setCurrentMode(params.mode);
      
      console.log(`Generating ${params.mode}:`, params);
      
      // Pass all params including mode to edge function
      const { data, error } = await supabase.functions.invoke('curriculum-expert-agent', {
        body: {
          mode: params.mode,
          ...params
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || `Failed to generate ${params.mode}`);
      }

      if (!data) {
        throw new Error('No data returned from generation');
      }

      setGeneratedContent(data);
      
      toast({
        title: `${params.mode.charAt(0).toUpperCase() + params.mode.slice(1)} Generated`,
        description: `Successfully generated ${params.mode} content.`,
      });
      
      return data;
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : `Failed to generate ${params.mode}`,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const saveToDatabase = useCallback(async (
    mode: ECAMode,
    content: any,
    metadata: {
      title: string;
      ageGroup: string;
      cefrLevel: string;
      programId?: string;
      unitId?: string;
    }
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let result;
      
      // Save to appropriate table based on mode
      switch (mode) {
        case 'lesson':
          result = await supabase
            .from('systematic_lessons')
            .insert({
              title: metadata.title,
              age_group: metadata.ageGroup,
              cefr_level: metadata.cefrLevel,
              lesson_data: content,
              created_by: user?.id
            })
            .select()
            .single();
          break;
          
        case 'unit':
          result = await supabase
            .from('curriculum_units')
            .insert({
              title: metadata.title,
              age_group: metadata.ageGroup,
              cefr_level: metadata.cefrLevel,
              unit_data: content,
              program_id: metadata.programId,
              created_by: user?.id
            })
            .select()
            .single();
          break;
          
        case 'curriculum':
          result = await supabase
            .from('curriculum_programs')
            .insert({
              title: metadata.title,
              age_group: metadata.ageGroup,
              cefr_level: metadata.cefrLevel,
              program_type: 'custom',
              program_data: content,
              created_by: user?.id
            })
            .select()
            .single();
          break;
          
        case 'assessment':
          result = await supabase
            .from('eca_assessments')
            .insert({
              title: metadata.title,
              age_group: metadata.ageGroup,
              cefr_level: metadata.cefrLevel,
              assessment_data: content,
              created_by: user?.id
            })
            .select()
            .single();
          break;
          
        case 'mission':
          result = await supabase
            .from('learning_missions')
            .insert({
              title: metadata.title,
              age_group: metadata.ageGroup,
              cefr_level: metadata.cefrLevel,
              mission_data: content,
              created_by: user?.id
            })
            .select()
            .single();
          break;
          
        case 'resource':
          result = await supabase
            .from('resource_library')
            .insert({
              title: metadata.title,
              age_group: metadata.ageGroup,
              cefr_level: metadata.cefrLevel,
              content_data: content,
              created_by: user?.id
            })
            .select()
            .single();
          break;
      }
      
      if (result?.error) {
        throw result.error;
      }
      
      toast({
        title: "Saved Successfully",
        description: `${mode} has been saved to the database.`,
      });
      
      return result?.data;
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Save Failed",
        description: error instanceof Error ? error.message : "Failed to save to database",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  return {
    isGenerating,
    currentMode,
    generatedContent,
    generateContent,
    saveToDatabase,
    setGeneratedContent
  };
}
