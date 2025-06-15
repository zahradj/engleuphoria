
import { supabase } from '@/integrations/supabase/client'

export interface PaymentPlan {
  id: string
  name: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  popular?: boolean
}

export interface PaymentHistoryItem {
  id: string
  amount: number
  currency: string
  payment_method: string
  status: string
  created_at: string
  payment_gateway?: string
  invoice_url?: string
  plan?: {
    name: string
  }
  lesson?: {
    title: string
    scheduled_at: string
  }
}

export interface SubscriptionDetails {
  plan: PaymentPlan
  status: 'active' | 'cancelled' | 'past_due'
  current_period_start: string
  current_period_end: string
  next_billing_date: string
  cancel_at_period_end?: boolean
}

export interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  country: string
}

export interface PaymentDetails {
  plan: PaymentPlan
  contactInfo: ContactInfo
  paymentMethod: string
}

export class PaymentService {
  // Mock payment plans since payment_plans table doesn't exist
  static getPaymentPlans(): PaymentPlan[] {
    return [
      {
        id: 'basic',
        name: 'Basic Plan',
        price: 29,
        currency: 'USD',
        interval: 'month',
        features: ['Feature 1', 'Feature 2', 'Feature 3']
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        price: 59,
        currency: 'USD',
        interval: 'month',
        features: ['All Basic features', 'Feature 4', 'Feature 5'],
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise Plan',
        price: 99,
        currency: 'USD',
        interval: 'month',
        features: ['All Premium features', 'Feature 6', 'Feature 7']
      }
    ]
  }

  static async processPayment(paymentDetails: PaymentDetails): Promise<{ success: boolean; paymentId?: string; error?: string }> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // Create a payment record in the payments table
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          student_id: user.id,
          lesson_id: '', // This should be filled with actual lesson ID
          amount: paymentDetails.plan.price,
          payment_method: paymentDetails.paymentMethod,
          status: 'completed',
          currency: paymentDetails.plan.currency
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        paymentId: data.id
      }
    } catch (error) {
      console.error('Payment processing error:', error)
      return {
        success: false,
        error: 'Payment processing failed'
      }
    }
  }

  static async getPaymentHistory(userId?: string): Promise<PaymentHistoryItem[]> {
    try {
      // If no userId provided, get current user
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []
        userId = user.id
      }

      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          lesson:lessons(title, scheduled_at)
        `)
        .eq('student_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []).map(payment => ({
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        payment_method: payment.payment_method,
        status: payment.status,
        created_at: payment.created_at,
        lesson: payment.lesson ? {
          title: payment.lesson.title,
          scheduled_at: payment.lesson.scheduled_at
        } : undefined
      }))
    } catch (error) {
      console.error('Error fetching payment history:', error)
      return []
    }
  }

  static async getCurrentSubscription(): Promise<SubscriptionDetails | null> {
    try {
      // Mock subscription data for now
      // In a real app, this would query a subscriptions table or external service
      return null
    } catch (error) {
      console.error('Error fetching subscription:', error)
      return null
    }
  }

  static async openCustomerPortal(): Promise<{ url: string }> {
    try {
      // Mock customer portal URL for now
      // In a real app, this would create a Stripe customer portal session
      throw new Error('Customer portal not implemented yet')
    } catch (error) {
      console.error('Error opening customer portal:', error)
      throw error
    }
  }
}

// Export an instance for backward compatibility
export const paymentService = PaymentService;
