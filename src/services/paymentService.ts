
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
      // Create a payment record in the payments table
      const { data, error } = await supabase
        .from('payments')
        .insert([{
          student_id: '', // This should be filled with actual user ID
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

  static async getPaymentHistory(userId: string) {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching payment history:', error)
      return []
    }
  }
}
