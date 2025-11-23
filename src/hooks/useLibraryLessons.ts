import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LibraryLesson {
  id: string;
  title: string;
  topic: string;
  cefr_level: string;
  age_group: string;
  duration_minutes: number;
  total_xp: number;
  badges_available: string[];
  created_at: string;
  usage_count: number;
  screens_data: any[];
}

interface Filters {
  cefrLevel?: string;
  ageGroup?: string;
  searchQuery?: string;
}

export function useLibraryLessons() {
  const [lessons, setLessons] = useState<LibraryLesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLessons = async (filters?: Filters) => {
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('interactive_lessons')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filters?.cefrLevel && filters.cefrLevel !== 'all') {
        query = query.eq('cefr_level', filters.cefrLevel);
      }

      if (filters?.ageGroup && filters.ageGroup !== 'all') {
        query = query.eq('age_group', filters.ageGroup);
      }

      if (filters?.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,topic.ilike.%${filters.searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch lessons:', error);
        throw error;
      }

      setLessons(data || []);
    } catch (error) {
      console.error('Error fetching library lessons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  return {
    lessons,
    isLoading,
    fetchLessons,
    refetch: fetchLessons
  };
}
