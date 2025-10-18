
// Lesson Package Types
export interface LessonPackage {
  id: string;
  name: string;
  lesson_count: number;
  duration_minutes: 25 | 55;
  total_price: number;
  savings_amount: number;
  is_active: boolean;
  region?: 'algeria' | 'international';
  created_at?: string;
  updated_at?: string;
}

export interface StudentPackagePurchase {
  id: string;
  student_id: string;
  package_id: string;
  lessons_remaining: number;
  total_lessons: number;
  purchased_at: string;
  expires_at?: string;
  payment_id?: string;
  package?: LessonPackage;
}

// Lesson Pricing Types
export interface LessonPricing {
  duration_minutes: 25 | 55;
  student_price: number;
  teacher_payout: number;
  platform_profit: number;
}

// Dual-duration pricing structure
export interface DurationPricing {
  duration_minutes: 25 | 55;
  price_dzd: number;
  price_eur: number;
  teacher_payout_dzd: number;
  teacher_payout_eur: number;
  platform_profit_dzd: number;
  platform_profit_eur: number;
}

export interface LessonPayment {
  id: string;
  lesson_id: string;
  student_id: string;
  teacher_id: string;
  amount_charged: number;
  teacher_payout: number;
  platform_profit: number;
  payment_method?: string;
  payment_gateway_id?: string;
  refund_amount?: number;
  refund_reason?: string;
  processed_at: string;
}

// Teacher Penalty Types
export interface TeacherPenalty {
  id: string;
  teacher_id: string;
  lesson_id?: string;
  penalty_type: 'no_show' | 'technical_issues' | 'late_cancellation';
  amount_deducted: number;
  reason?: string;
  resolved: boolean;
  applied_at: string;
}

export interface TeacherAbsence {
  id: string;
  teacher_id: string;
  lesson_id?: string;
  absence_date: string;
  absence_type: 'no_show' | 'technical_failure' | 'emergency';
  student_refunded: boolean;
  penalty_applied: boolean;
}

// Pricing Constants by Duration
export const LESSON_PRICING_BY_DURATION: Record<25 | 55, DurationPricing> = {
  25: {
    duration_minutes: 25,
    price_dzd: 1250,
    price_eur: 7.50,
    teacher_payout_dzd: 625,
    teacher_payout_eur: 3.75,
    platform_profit_dzd: 625,
    platform_profit_eur: 3.75
  },
  55: {
    duration_minutes: 55,
    price_dzd: 2500,
    price_eur: 15.00,
    teacher_payout_dzd: 1250,
    teacher_payout_eur: 7.50,
    platform_profit_dzd: 1250,
    platform_profit_eur: 7.50
  }
};

// Helper function to get pricing
export const getLessonPricing = (
  duration: 25 | 55,
  region: 'algeria' | 'international'
) => {
  const pricing = LESSON_PRICING_BY_DURATION[duration];
  return {
    duration: duration,
    price: region === 'algeria' ? pricing.price_dzd : pricing.price_eur,
    currency: region === 'algeria' ? 'DZD' : 'EUR',
    teacher_payout: region === 'algeria' ? pricing.teacher_payout_dzd : pricing.teacher_payout_eur,
    platform_profit: region === 'algeria' ? pricing.platform_profit_dzd : pricing.platform_profit_eur
  };
};

// Legacy constant for backward compatibility
export const LESSON_PRICING: LessonPricing = {
  duration_minutes: 55,
  student_price: 15.00,
  teacher_payout: 7.50,
  platform_profit: 7.50
};

// Legacy subscription interface for backward compatibility
export interface SubscriptionPlan {
  id: string;
  name: string;
  price_dzd: number;
  price_eur: number;
  max_classes_per_month: number | null;
  features: any;
  is_trial: boolean;
  sort_order: number;
  per_class_price?: number;
  savings_percentage?: number;
  description?: string;
}
