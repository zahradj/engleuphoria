
// Lesson Package Types
export interface LessonPackage {
  id: string;
  name: string;
  lesson_count: number;
  duration_minutes: number;
  total_price: number;
  savings_amount: number;
  is_active: boolean;
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
  duration_minutes: 30 | 60;
  student_price: number;
  teacher_payout: number;
  platform_profit: number;
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

// Pricing Constants
export const LESSON_PRICING: Record<30 | 60, LessonPricing> = {
  30: {
    duration_minutes: 30,
    student_price: 6.00,
    teacher_payout: 3.00,
    platform_profit: 3.00
  },
  60: {
    duration_minutes: 60,
    student_price: 12.00,
    teacher_payout: 6.00,
    platform_profit: 6.00
  }
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
