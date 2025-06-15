
import { supabase } from '@/lib/supabase';

export interface PaymentPlan {
  id: string;
  name: string;
  type: 'subscription' | 'one_time';
  price: number;
  currency: string;
  interval?: string;
  features: Record<string, any>;
  is_active: boolean;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  payment_gateway: string;
  created_at: string;
  plan?: PaymentPlan;
  invoice_url?: string;
}

export interface SubscriptionDetails {
  id: string;
  plan: PaymentPlan;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export const paymentService = {
  // Get available payment plans
  async getPaymentPlans(): Promise<PaymentPlan[]> {
    const { data, error } = await supabase
      .from('payment_plans')
      .select('*')
      .eq('is_active', true)
      .order('price', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // Create checkout session
  async createCheckout(planId: string): Promise<{ url: string }> {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { planId, paymentType: 'stripe' }
    });

    if (error) throw error;
    return data;
  },

  // Verify payment after checkout
  async verifyPayment(sessionId: string): Promise<{ success: boolean; status: string }> {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId }
    });

    if (error) throw error;
    return data;
  },

  // Get payment history for current user
  async getPaymentHistory(): Promise<PaymentHistoryItem[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        plan:payment_plans(*)
      `)
      .eq('student_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get current subscription
  async getCurrentSubscription(): Promise<SubscriptionDetails | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        *,
        plan:payment_plans(*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Open customer portal for subscription management
  async openCustomerPortal(): Promise<{ url: string }> {
    const { data, error } = await supabase.functions.invoke('customer-portal');
    if (error) throw error;
    return data;
  },

  // Process Algerian payments (placeholder for future implementation)
  async processCIBPayment(planId: string, amount: number): Promise<{ url: string }> {
    // TODO: Implement CIB/SATIM gateway integration
    console.log('CIB payment processing not yet implemented');
    throw new Error('CIB payment processing coming soon');
  },

  async processBaridiMobPayment(planId: string, amount: number): Promise<{ url: string }> {
    // TODO: Implement BaridiMob/Edahabia gateway integration
    console.log('BaridiMob payment processing not yet implemented');
    throw new Error('BaridiMob payment processing coming soon');
  }
};
