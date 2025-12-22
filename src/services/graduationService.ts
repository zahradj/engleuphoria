import { supabase } from '@/integrations/supabase/client';
import { SystemId } from '@/types/multiTenant';

export interface GraduationResult {
  success: boolean;
  newSystemId?: SystemId;
  error?: string;
}

const GRADUATION_PATH: Record<SystemId, SystemId | null> = {
  kids: 'teen',
  teen: 'adult',
  adult: null, // Cannot graduate further
};

export async function graduateStudent(userId: string): Promise<GraduationResult> {
  try {
    // Get current system_id
    const { data: profile, error: fetchError } = await supabase
      .from('student_profiles')
      .select('system_id')
      .eq('user_id', userId)
      .single();

    if (fetchError || !profile) {
      return { success: false, error: 'Profile not found' };
    }

    const currentSystem = (profile.system_id || 'kids') as SystemId;
    const newSystem = GRADUATION_PATH[currentSystem];

    if (!newSystem) {
      return { success: false, error: 'Already at the highest level' };
    }

    // Update to new system
    const { error: updateError } = await supabase
      .from('student_profiles')
      .update({ system_id: newSystem })
      .eq('user_id', userId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    return { success: true, newSystemId: newSystem };
  } catch (error) {
    console.error('Graduation error:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

export async function setStudentSystem(userId: string, systemId: SystemId): Promise<boolean> {
  const { error } = await supabase
    .from('student_profiles')
    .update({ system_id: systemId })
    .eq('user_id', userId);

  if (error) {
    console.error('Error setting system:', error);
    return false;
  }

  return true;
}
