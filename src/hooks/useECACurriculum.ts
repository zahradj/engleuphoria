import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useECACurriculum() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Programs
  const getPrograms = useCallback(async (filters?: {
    ageGroup?: string;
    cefrLevel?: string;
  }) => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('curriculum_programs')
        .select('*');
      
      if (filters?.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      if (filters?.cefrLevel) {
        query = query.eq('cefr_level', filters.cefrLevel);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createProgram = useCallback(async (programData: any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('curriculum_programs')
        .insert(programData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Program Created",
        description: "Curriculum program created successfully.",
      });
      
      return data;
    } catch (error) {
      console.error('Failed to create program:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create curriculum program.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Units
  const getUnits = useCallback(async (programId?: string, filters?: {
    ageGroup?: string;
    cefrLevel?: string;
  }) => {
    try {
      setIsLoading(true);
      let query = supabase.from('curriculum_units').select('*');
      
      if (programId) {
        query = query.eq('program_id', programId);
      }
      if (filters?.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      if (filters?.cefrLevel) {
        query = query.eq('cefr_level', filters.cefrLevel);
      }
      
      const { data, error } = await query.order('unit_number');
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch units:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUnit = useCallback(async (unitData: any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('curriculum_units')
        .insert(unitData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Unit Created",
        description: "Curriculum unit created successfully.",
      });
      
      return data;
    } catch (error) {
      console.error('Failed to create unit:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create curriculum unit.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Assessments
  const getAssessments = useCallback(async (filters?: {
    type?: string;
    ageGroup?: string;
    cefrLevel?: string;
  }) => {
    try {
      setIsLoading(true);
      let query = supabase.from('eca_assessments').select('*');
      
      if (filters?.type) {
        query = query.eq('assessment_type', filters.type);
      }
      if (filters?.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      if (filters?.cefrLevel) {
        query = query.eq('cefr_level', filters.cefrLevel);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createAssessment = useCallback(async (assessmentData: any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('eca_assessments')
        .insert(assessmentData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Assessment Created",
        description: "Assessment created successfully.",
      });
      
      return data;
    } catch (error) {
      console.error('Failed to create assessment:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create assessment.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Missions
  const getMissions = useCallback(async (filters?: {
    ageGroup?: string;
    cefrLevel?: string;
  }) => {
    try {
      setIsLoading(true);
      let query = supabase.from('learning_missions').select('*');
      
      if (filters?.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      if (filters?.cefrLevel) {
        query = query.eq('cefr_level', filters.cefrLevel);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch missions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMission = useCallback(async (missionData: any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('learning_missions')
        .insert(missionData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Mission Created",
        description: "Learning mission created successfully.",
      });
      
      return data;
    } catch (error) {
      console.error('Failed to create mission:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create mission.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Lessons
  const getLessons = useCallback(async (filters?: {
    ageGroup?: string;
    cefrLevel?: string;
  }) => {
    try {
      setIsLoading(true);
      let query = supabase.from('systematic_lessons').select('*');
      
      if (filters?.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      if (filters?.cefrLevel) {
        query = query.eq('cefr_level', filters.cefrLevel);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch lessons:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Resources
  const getResources = useCallback(async (filters?: {
    type?: string;
    ageGroup?: string;
    cefrLevel?: string;
  }) => {
    try {
      setIsLoading(true);
      let query = supabase.from('resource_library').select('*');
      
      if (filters?.type) {
        query = query.eq('resource_type', filters.type);
      }
      if (filters?.ageGroup) {
        query = query.eq('age_group', filters.ageGroup);
      }
      if (filters?.cefrLevel) {
        query = query.eq('cefr_level', filters.cefrLevel);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createResource = useCallback(async (resourceData: any) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('resource_library')
        .insert(resourceData)
        .select()
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Resource Created",
        description: "Resource created successfully.",
      });
      
      return data;
    } catch (error) {
      console.error('Failed to create resource:', error);
      toast({
        title: "Creation Failed",
        description: "Failed to create resource.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    // Programs
    getPrograms,
    createProgram,
    // Units
    getUnits,
    createUnit,
    // Assessments
    getAssessments,
    createAssessment,
    // Missions
    getMissions,
    createMission,
    // Lessons
    getLessons,
    // Resources
    getResources,
    createResource
  };
}
