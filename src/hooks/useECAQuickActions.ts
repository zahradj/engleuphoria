import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QuickActionButton, AgeGroup, ECAMode } from '@/types/curriculumExpert';

export function useECAQuickActions() {
  const [quickActions, setQuickActions] = useState<QuickActionButton[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActions = useCallback(async (filters: {
    ageGroup?: AgeGroup;
    mode?: ECAMode;
    category?: string;
  }) => {
    setIsLoading(true);
    
    try {
      let query = supabase.from('curriculum_quick_actions').select('*');
      
      if (filters.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      
      if (filters.mode) {
        query = query.eq('mode', filters.mode);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      query = query.order('order_index');
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      const mapped = data.map(item => ({
        id: item.id,
        ageGroup: item.age_group as AgeGroup,
        mode: item.mode as ECAMode,
        buttonLabel: item.button_label,
        promptText: item.prompt_text,
        category: item.category,
        orderIndex: item.order_index,
        icon: item.icon
      }));
      
      setQuickActions(mapped);
      return mapped;
    } catch (error) {
      console.error('Failed to fetch quick actions:', error);
      setQuickActions([]);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { quickActions, isLoading, fetchActions };
}
