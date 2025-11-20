import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ECATemplate, ECAMode, AgeGroup, CEFRLevel } from '@/types/curriculumExpert';

export function useECATemplates() {
  const [templates, setTemplates] = useState<ECATemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getTemplates = useCallback(async (filters?: {
    mode?: ECAMode;
    ageGroup?: AgeGroup;
    cefrLevel?: CEFRLevel;
  }) => {
    try {
      setIsLoading(true);
      let query = supabase.from('eca_templates').select('*');
      
      if (filters?.mode) {
        query = query.eq('template_type', filters.mode);
      }
      if (filters?.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      if (filters?.cefrLevel) {
        query = query.eq('cefr_level', filters.cefrLevel);
      }
      
      const { data, error } = await query.order('use_count', { ascending: false });
      
      if (error) throw error;
      
      const mappedTemplates = data.map(item => ({
        id: item.id,
        templateName: item.template_name,
        templateType: item.template_type as ECAMode,
        ageGroup: item.age_group as AgeGroup,
        cefrLevel: item.cefr_level as CEFRLevel,
        description: item.description,
        templateStructure: item.template_structure,
        useCount: item.use_count,
        createdAt: new Date(item.created_at)
      }));
      
      setTemplates(mappedTemplates);
      return mappedTemplates;
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const incrementUseCount = useCallback(async (templateId: string) => {
    try {
      const template = templates.find(t => t.id === templateId);
      if (template) {
        await supabase
          .from('eca_templates')
          .update({ use_count: template.useCount + 1 })
          .eq('id', templateId);
      }
    } catch (error) {
      console.error('Failed to increment use count:', error);
    }
  }, [templates]);

  return {
    templates,
    isLoading,
    getTemplates,
    incrementUseCount
  };
}
