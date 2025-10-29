import { supabase } from '@/lib/supabase';
import { lessonPricingService } from './lessonPricingService';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warning?: string;
}

export const bookingValidationService = {
  /**
   * Comprehensive validation before booking a lesson
   */
  async validateBooking(
    teacherId: string,
    studentId: string,
    slotId: string,
    scheduledAt: string,
    duration: 30 | 60
  ): Promise<ValidationResult> {
    // 1. Validate duration
    if (![30, 60].includes(duration)) {
      return { 
        isValid: false, 
        error: 'Invalid lesson duration. Must be 30 or 60 minutes.' 
      };
    }

    // 2. Check if slot still exists and is available
    const { data: slot, error: slotError } = await supabase
      .from('teacher_availability')
      .select('*')
      .eq('id', slotId)
      .eq('is_available', true)
      .eq('is_booked', false)
      .single();
      
    if (slotError || !slot) {
      return { 
        isValid: false, 
        error: 'This time slot is no longer available. Please refresh and select another slot.' 
      };
    }

    // 3. Verify slot duration matches requested duration
    if (slot.duration !== duration) {
      return {
        isValid: false,
        error: `This slot is for ${slot.duration} minutes, but you selected a ${duration}-minute lesson. Please choose a matching slot.`
      };
    }

    // 4. Check if time is in the future (at least 1 hour from now)
    const slotTime = new Date(scheduledAt);
    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    if (slotTime < oneHourFromNow) {
      return { 
        isValid: false, 
        error: 'Lessons must be booked at least 1 hour in advance.' 
      };
    }

    // 5. Check for scheduling conflicts (student already has a lesson at this time)
    const { data: conflicts, error: conflictError } = await supabase
      .from('lessons')
      .select('id, title, scheduled_at')
      .eq('student_id', studentId)
      .gte('scheduled_at', new Date(slotTime.getTime() - 90 * 60 * 1000).toISOString()) // 90 min before
      .lte('scheduled_at', new Date(slotTime.getTime() + 90 * 60 * 1000).toISOString()) // 90 min after
      .neq('status', 'cancelled');
      
    if (!conflictError && conflicts && conflicts.length > 0) {
      return { 
        isValid: false, 
        error: `You already have a lesson scheduled around this time (${new Date(conflicts[0].scheduled_at).toLocaleTimeString()}). Please choose a different time.` 
      };
    }

    // 6. Check if student has valid package or payment method
    const packages = await lessonPricingService.getStudentPackages(studentId);
    const validPackage = packages.find(
      pkg => pkg.package?.duration_minutes === duration && pkg.lessons_remaining > 0
    );
    
    if (!validPackage) {
      return { 
        isValid: false, 
        error: `You need a ${duration}-minute lesson package to book this slot. Please purchase a package first.` 
      };
    }

    // 7. Verify teacher is still active and approved
    const { data: teacher } = await supabase
      .from('teacher_profiles')
      .select('approval_status')
      .eq('user_id', teacherId)
      .single();

    if (!teacher || teacher.approval_status !== 'approved') {
      return {
        isValid: false,
        error: 'This teacher is currently unavailable for booking.'
      };
    }

    // All validations passed
    return { isValid: true };
  },

  /**
   * Quick check if a slot is still available (for real-time updates)
   */
  async isSlotAvailable(slotId: string): Promise<boolean> {
    const { data } = await supabase
      .from('teacher_availability')
      .select('is_available, is_booked')
      .eq('id', slotId)
      .single();

    return data?.is_available === true && data?.is_booked === false;
  },

  /**
   * Get student's available lesson credits by duration
   */
  async getStudentCredits(studentId: string): Promise<{
    credits30: number;
    credits60: number;
  }> {
    const packages = await lessonPricingService.getStudentPackages(studentId);
    
    const credits30 = packages
      .filter(pkg => pkg.package?.duration_minutes === 30)
      .reduce((sum, pkg) => sum + pkg.lessons_remaining, 0);
      
    const credits60 = packages
      .filter(pkg => pkg.package?.duration_minutes === 60)
      .reduce((sum, pkg) => sum + pkg.lessons_remaining, 0);

    return { credits30, credits60 };
  }
};
