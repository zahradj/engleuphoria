
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export interface PaymentPlan {
  id: string;
  name: string;
  price_dzd: number;
  price_eur: number;
  max_classes_per_month: number | null;
  features: Record<string, any>;
  is_trial: boolean;
  interval_type: 'monthly' | 'yearly';
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'cancelled' | 'expired';
  classes_used_this_month: number;
  subscription_start: string;
  subscription_end: string | null;
  plan?: PaymentPlan;
}

class PaymentService {
  async getAvailablePlans(): Promise<PaymentPlan[]> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to fetch payment plans:', error);
      return [];
    }
  }

  async getUserSubscription(userId: string): Promise<UserSubscription | null> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Failed to fetch user subscription:', error);
      return null;
    }
  }

  async createSubscription(userId: string, planId: string): Promise<UserSubscription> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: userId,
          plan_id: planId,
          status: 'active',
          classes_used_this_month: 0,
          subscription_start: new Date().toISOString(),
          payment_method: 'stripe' // Default for now
        })
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to create subscription:', error);
      throw error;
    }
  }

  async bookClass(studentId: string, teacherId: string, lessonId?: string): Promise<void> {
    try {
      // Check if user has available classes in their subscription
      const subscription = await this.getUserSubscription(studentId);
      
      if (!subscription) {
        throw new Error('No active subscription found');
      }

      if (subscription.plan?.max_classes_per_month && 
          subscription.classes_used_this_month >= subscription.plan.max_classes_per_month) {
        throw new Error('Monthly class limit reached');
      }

      // Create class booking
      const { error: bookingError } = await supabase
        .from('class_bookings')
        .insert({
          student_id: studentId,
          teacher_id: teacherId,
          lesson_id: lessonId,
          subscription_id: subscription.id,
          status: 'scheduled',
          booking_type: 'subscription',
          scheduled_at: new Date().toISOString(),
          price_paid: 0 // Covered by subscription
        });

      if (bookingError) throw bookingError;

      // Update classes used count
      const { error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          classes_used_this_month: subscription.classes_used_this_month + 1
        })
        .eq('id', subscription.id);

      if (updateError) throw updateError;

    } catch (error) {
      console.error('Failed to book class:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          subscription_end: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;
    } catch (error) {
      console.error('Failed to cancel subscription:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
