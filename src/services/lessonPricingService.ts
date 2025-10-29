import { supabase } from '@/lib/supabase';
import { 
  LessonPackage, 
  StudentPackagePurchase, 
  LessonPayment, 
  TeacherPenalty,
  LESSON_PRICING,
  getLessonPricing
} from '@/types/pricing';

export const lessonPricingService = {
  // Get all available lesson packages
  async getAvailablePackages(): Promise<LessonPackage[]> {
    const { data, error } = await supabase
      .from('lesson_packages')
      .select('*')
      .eq('is_active', true)
      .order('total_price', { ascending: true });

    if (error) {
      console.error('Error fetching lesson packages:', error);
      throw error;
    }

    return data || [];
  },

  // Get student's purchased packages
  async getStudentPackages(studentId: string): Promise<StudentPackagePurchase[]> {
    const { data, error } = await supabase
      .from('student_package_purchases')
      .select(`
        *,
        package:lesson_packages(*)
      `)
      .eq('student_id', studentId)
      .gt('lessons_remaining', 0)
      .order('purchased_at', { ascending: false });

    if (error) {
      console.error('Error fetching student packages:', error);
      throw error;
    }

    return data || [];
  },

  // Get pricing based on duration and region (updated to 30/60 minutes)
  getPricingForLesson(duration: 30 | 60, region: 'algeria' | 'international') {
    return getLessonPricing(duration, region);
  },

  // Calculate lesson price based on duration (legacy method)
  calculateLessonPrice(): {
    studentPrice: number;
    teacherPayout: number;
    platformProfit: number;
  } {
    return {
      studentPrice: LESSON_PRICING.student_price,
      teacherPayout: LESSON_PRICING.teacher_payout,
      platformProfit: LESSON_PRICING.platform_profit
    };
  },

  // Book a lesson with payment processing
  async bookLessonWithPayment(
    teacherId: string,
    studentId: string,
    scheduledAt: string,
    duration: number,
    packagePurchaseId?: string
  ): Promise<{ lesson: any; payment?: LessonPayment }> {
    // Coerce to number to handle any type mismatches
    const durationNum = Number(duration);
    
    console.log('🔍 Duration validation:', { 
      original: duration, 
      type: typeof duration, 
      coerced: durationNum,
      typeAfter: typeof durationNum
    });
    
    // Validate duration (updated to 30/60 minutes)
    const allowedDurations = [30, 60];
    if (!allowedDurations.includes(durationNum)) {
      console.error('❌ Invalid duration received:', { 
        duration, 
        type: typeof duration, 
        coerced: durationNum,
        allowed: allowedDurations
      });
      throw new Error('Invalid lesson duration. Must be 30 or 60 minutes.');
    }

    const pricing = this.calculateLessonPrice();
    const durationMinutes = durationNum;
    
    // If using a package, check and redeem credits
    if (packagePurchaseId) {
      const { data: packageData, error: packageError } = await supabase
        .from('student_package_purchases')
        .select('*, package:lesson_packages(*)')
        .eq('id', packagePurchaseId)
        .eq('student_id', studentId)
        .gt('lessons_remaining', 0)
        .single();

      if (packageError || !packageData) {
        throw new Error('Invalid or expired package');
      }

      // Verify package duration matches lesson duration
      if (packageData.package?.duration_minutes !== durationMinutes) {
        throw new Error('Package duration does not match lesson duration');
      }

      // Create lesson
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert([{
          teacher_id: teacherId,
          student_id: studentId,
          scheduled_at: scheduledAt,
          duration: durationMinutes, // Set both duration fields
          duration_minutes: durationMinutes,
          lesson_price: 0, // No additional charge for package lessons
          title: `${durationMinutes}-minute English Lesson`,
          status: 'scheduled'
        }])
        .select()
        .single();

      if (lessonError) throw lessonError;

      // CRITICAL FIX: Mark availability slot as booked with atomic update
      const { data: updatedSlot, error: availError } = await supabase
        .from('teacher_availability')
        .update({ 
          is_booked: true,
          lesson_id: lesson.id,
          booked_at: new Date().toISOString()
        })
        .eq('teacher_id', teacherId)
        .lte('start_time', scheduledAt)
        .gte('end_time', scheduledAt)
        .eq('duration', durationMinutes)
        .eq('is_booked', false)
        .eq('is_available', true)
        .limit(1)
        .select()
        .single();
        
      if (availError || !updatedSlot) {
        // Rollback lesson creation if slot update fails
        await supabase.from('lessons').delete().eq('id', lesson.id);
        throw new Error('This time slot is no longer available. Please refresh and select another slot.');
      }
      
      console.log('✅ Availability slot marked as booked:', updatedSlot.id);

      // Redeem package credit
      await supabase
        .from('student_package_purchases')
        .update({ lessons_remaining: packageData.lessons_remaining - 1 })
        .eq('id', packagePurchaseId);

      // Record redemption
      await supabase
        .from('package_lesson_redemptions')
        .insert([{
          package_purchase_id: packagePurchaseId,
          lesson_id: lesson.id
        }]);

      console.log('✅ Package credit deducted and lesson created:', {
        lessonId: lesson.id,
        duration: durationMinutes,
        creditsRemaining: packageData.lessons_remaining - 1
      });

      return { lesson };
    } else {
      // Individual lesson payment
      const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .insert([{
          teacher_id: teacherId,
          student_id: studentId,
          scheduled_at: scheduledAt,
          duration: durationMinutes, // Set both duration fields
          duration_minutes: durationMinutes,
          lesson_price: pricing.studentPrice,
          title: `${durationMinutes}-minute English Lesson`,
          status: 'scheduled',
          payment_status: 'pending'
        }])
        .select()
        .single();

      if (lessonError) throw lessonError;

      // CRITICAL FIX: Mark availability slot as booked with atomic update
      const { data: updatedSlot, error: availError } = await supabase
        .from('teacher_availability')
        .update({ 
          is_booked: true,
          lesson_id: lesson.id,
          booked_at: new Date().toISOString()
        })
        .eq('teacher_id', teacherId)
        .lte('start_time', scheduledAt)
        .gte('end_time', scheduledAt)
        .eq('duration', durationMinutes)
        .eq('is_booked', false)
        .eq('is_available', true)
        .limit(1)
        .select()
        .single();
        
      if (availError || !updatedSlot) {
        // Rollback lesson creation if slot update fails
        await supabase.from('lessons').delete().eq('id', lesson.id);
        throw new Error('This time slot is no longer available. Please refresh and select another slot.');
      }
      
      console.log('✅ Availability slot marked as booked:', updatedSlot.id);

      // Create payment record
      const { data: payment, error: paymentError } = await supabase
        .from('lesson_payments')
        .insert([{
          lesson_id: lesson.id,
          student_id: studentId,
          teacher_id: teacherId,
          amount_charged: pricing.studentPrice,
          teacher_payout: pricing.teacherPayout,
          platform_profit: pricing.platformProfit
        }])
        .select()
        .single();

      if (paymentError) throw paymentError;

      console.log('✅ Individual lesson payment processed:', {
        lessonId: lesson.id,
        duration: durationMinutes,
        amount: pricing.studentPrice
      });

      return { lesson, payment };
    }
  },

  // Cancel lesson with policy enforcement
  async cancelLesson(
    lessonId: string,
    cancelledBy: string,
    reason?: string
  ): Promise<{ refundAmount: number; penaltyApplied: boolean }> {
    // Get lesson details
    const { data: lesson, error: lessonError } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    if (lessonError || !lesson) {
      throw new Error('Lesson not found');
    }

    const now = new Date();
    const scheduledAt = new Date(lesson.scheduled_at);
    const hoursUntilLesson = (scheduledAt.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundAmount = 0;
    let penaltyApplied = false;

    // Check 6-hour cancellation policy
    if (hoursUntilLesson >= 6) {
      // Valid cancellation - full refund
      refundAmount = lesson.lesson_price || 0;
      
      await supabase
        .from('lessons')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          booking_cancelled_at: now.toISOString(),
          cancellation_policy_violated: false
        })
        .eq('id', lessonId);

      // Process refund if payment exists
      if (lesson.lesson_price > 0) {
        await supabase
          .from('lesson_payments')
          .update({
            refund_amount: refundAmount,
            refund_reason: 'Valid cancellation within policy'
          })
          .eq('lesson_id', lessonId);
      }
    } else {
      // Late cancellation - policy violation
      penaltyApplied = true;
      
      await supabase
        .from('lessons')
        .update({
          status: 'cancelled',
          cancellation_reason: reason,
          booking_cancelled_at: now.toISOString(),
          cancellation_policy_violated: true
        })
        .eq('id', lessonId);

      // No refund for late cancellation
      if (lesson.lesson_price > 0) {
        await supabase
          .from('lesson_payments')
          .update({
            refund_amount: 0,
            refund_reason: 'Late cancellation - policy violation'
          })
          .eq('lesson_id', lessonId);
      }
    }

    return { refundAmount, penaltyApplied };
  },

  // Apply teacher penalty
  async applyTeacherPenalty(
    teacherId: string,
    lessonId: string,
    penaltyType: 'no_show' | 'technical_issues',
    reason?: string
  ): Promise<TeacherPenalty> {
    // Get lesson details for penalty calculation
    const { data: lesson } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single();

    const penaltyAmount = lesson?.lesson_price || 0;

    // Create penalty record
    const { data: penalty, error } = await supabase
      .from('teacher_penalties')
      .insert([{
        teacher_id: teacherId,
        lesson_id: lessonId,
        penalty_type: penaltyType,
        amount_deducted: penaltyAmount,
        reason: reason || `Teacher ${penaltyType.replace('_', ' ')}`
      }])
      .select()
      .single();

    if (error) throw error;

    // Record absence
    await supabase
      .from('teacher_absences')
      .insert([{
        teacher_id: teacherId,
        lesson_id: lessonId,
        absence_type: penaltyType === 'no_show' ? 'no_show' : 'technical_failure',
        student_refunded: true,
        penalty_applied: true
      }]);

    // Update lesson status and process student refund
    await supabase
      .from('lessons')
      .update({
        status: 'cancelled',
        cancellation_reason: `Teacher ${penaltyType.replace('_', ' ')}`,
        teacher_payout_amount: 0,
        student_charged_amount: 0
      })
      .eq('id', lessonId);

    // Process full refund to student
    if (lesson?.lesson_price > 0) {
      await supabase
        .from('lesson_payments')
        .update({
          refund_amount: lesson.lesson_price,
          refund_reason: `Teacher ${penaltyType.replace('_', ' ')} - full refund`
        })
        .eq('lesson_id', lessonId);
    }

    return penalty;
  },

  // Get teacher penalty summary
  async getTeacherPenalties(teacherId: string): Promise<TeacherPenalty[]> {
    const { data, error } = await supabase
      .from('teacher_penalties')
      .select('*')
      .eq('teacher_id', teacherId)
      .order('applied_at', { ascending: false });

    if (error) {
      console.error('Error fetching teacher penalties:', error);
      throw error;
    }

    return data || [];
  },

  // Purchase lesson package
  async purchasePackage(
    studentId: string,
    packageId: string,
    paymentId: string
  ): Promise<StudentPackagePurchase> {
    // Get package details
    const { data: packageData, error: packageError } = await supabase
      .from('lesson_packages')
      .select('*')
      .eq('id', packageId)
      .eq('is_active', true)
      .single();

    if (packageError || !packageData) {
      throw new Error('Package not found or inactive');
    }

    // Create package purchase
    const { data: purchase, error: purchaseError } = await supabase
      .from('student_package_purchases')
      .insert([{
        student_id: studentId,
        package_id: packageId,
        lessons_remaining: packageData.lesson_count,
        total_lessons: packageData.lesson_count,
        payment_id: paymentId,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year expiry
      }])
      .select()
      .single();

    if (purchaseError) throw purchaseError;

    return purchase;
  }
};