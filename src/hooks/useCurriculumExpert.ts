import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CurriculumMaterial, GenerationParams, QuickActionButton, GrammarProgression, VocabularyProgression } from '@/types/curriculumExpert';

export function useCurriculumExpert() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMaterial, setGeneratedMaterial] = useState<CurriculumMaterial | null>(null);
  const { toast } = useToast();

  const generateMaterial = useCallback(async (params: GenerationParams) => {
    try {
      setIsGenerating(true);
      
      // Add mode with default 'lesson' for backward compatibility
      const requestParams = {
        mode: 'lesson' as const,
        ...params
      };
      
      console.log('Calling curriculum-expert-agent with params:', requestParams);
      
      const { data, error } = await supabase.functions.invoke('curriculum-expert-agent', {
        body: requestParams
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate curriculum material');
      }

      if (!data) {
        throw new Error('No data returned from generation');
      }

      // Save to database
      const { data: { user } } = await supabase.auth.getUser();
      
      const materialToSave = {
        title: data.title,
        age_group: data.ageGroup,
        cefr_level: data.cefrLevel,
        material_type: 'lesson' as const,
        duration_minutes: data.durationMinutes,
        learning_objectives: data.learningObjectives,
        target_language: data.targetLanguage,
        content: data.content,
        created_by: user?.id
      };

      const { data: savedMaterial, error: saveError } = await supabase
        .from('curriculum_materials')
        .insert(materialToSave)
        .select()
        .single();

      if (saveError) {
        console.error('Save error:', saveError);
        throw new Error('Failed to save generated material');
      }

      const material: CurriculumMaterial = {
        id: savedMaterial.id,
        title: savedMaterial.title,
        ageGroup: savedMaterial.age_group as any,
        cefrLevel: savedMaterial.cefr_level as any,
        materialType: savedMaterial.material_type as any,
        durationMinutes: savedMaterial.duration_minutes,
        learningObjectives: savedMaterial.learning_objectives,
        targetLanguage: savedMaterial.target_language,
        content: savedMaterial.content,
        createdBy: savedMaterial.created_by,
        createdAt: new Date(savedMaterial.created_at),
        updatedAt: new Date(savedMaterial.updated_at)
      };

      setGeneratedMaterial(material);
      
      toast({
        title: "Material Generated",
        description: `"${material.title}" has been created successfully.`,
      });
      
      return material;
    } catch (error) {
      console.error('Generation failed:', error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate curriculum material",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  }, [toast]);

  const getMaterialsByAge = useCallback(async (ageGroup: string) => {
    const { data, error } = await supabase
      .from('curriculum_materials')
      .select('*')
      .eq('age_group', ageGroup)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      title: item.title,
      ageGroup: item.age_group as any,
      cefrLevel: item.cefr_level as any,
      materialType: item.material_type as any,
      durationMinutes: item.duration_minutes,
      learningObjectives: item.learning_objectives,
      targetLanguage: item.target_language,
      content: item.content,
      createdBy: item.created_by,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
  }, []);

  const getQuickActions = useCallback(async (ageGroup?: string): Promise<QuickActionButton[]> => {
    let query = supabase.from('curriculum_quick_actions').select('*').order('order_index');
    
    if (ageGroup) {
      query = query.eq('age_group', ageGroup);
    }

    const { data, error } = await query;

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      ageGroup: item.age_group as any,
      buttonLabel: item.button_label,
      promptText: item.prompt_text,
      category: item.category as any,
      orderIndex: item.order_index,
      icon: item.icon
    }));
  }, []);

  const getGrammarProgression = useCallback(async (): Promise<GrammarProgression[]> => {
    const { data, error } = await supabase
      .from('grammar_progression')
      .select('*')
      .order('cefr_level');

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      cefrLevel: item.cefr_level as any,
      ageRange: item.age_range,
      grammarPoints: item.grammar_points as any,
      examples: item.examples as any,
      createdAt: new Date(item.created_at)
    }));
  }, []);

  const getVocabularyProgression = useCallback(async (): Promise<VocabularyProgression[]> => {
    const { data, error } = await supabase
      .from('vocabulary_progression')
      .select('*')
      .order('cefr_level');

    if (error) throw error;
    
    return data.map(item => ({
      id: item.id,
      cefrLevel: item.cefr_level as any,
      ageRange: item.age_range,
      themes: item.themes as any,
      wordLists: item.word_lists as any,
      createdAt: new Date(item.created_at)
    }));
  }, []);

  return {
    isGenerating,
    generatedMaterial,
    generateMaterial,
    getMaterialsByAge,
    getQuickActions,
    getGrammarProgression,
    getVocabularyProgression
  };
}