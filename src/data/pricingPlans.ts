
import { SubscriptionPlan, LessonPackage } from '@/types/pricing';

// New lesson packages based on the pricing policy (2500 DZD/€15 for 55min, 1250 DZD/€7.50 for 25min)
export const lessonPackages: LessonPackage[] = [
  // 25-minute packages (Algeria - DZD)
  {
    id: 'pkg-3x25-dzd',
    name: '3 × 25-min lessons',
    lesson_count: 3,
    duration_minutes: 25,
    total_price: 3600,
    savings_amount: 150,
    is_active: true,
    region: 'algeria'
  },
  {
    id: 'pkg-5x25-dzd',
    name: '5 × 25-min lessons',
    lesson_count: 5,
    duration_minutes: 25,
    total_price: 6000,
    savings_amount: 250,
    is_active: true,
    region: 'algeria'
  },
  {
    id: 'pkg-10x25-dzd',
    name: '10 × 25-min lessons',
    lesson_count: 10,
    duration_minutes: 25,
    total_price: 12000,
    savings_amount: 500,
    is_active: true,
    region: 'algeria'
  },
  
  // 55-minute packages (Algeria - DZD)
  {
    id: 'pkg-3x55-dzd',
    name: '3 × 55-min lessons',
    lesson_count: 3,
    duration_minutes: 55,
    total_price: 7200,
    savings_amount: 300,
    is_active: true,
    region: 'algeria'
  },
  {
    id: 'pkg-5x55-dzd',
    name: '5 × 55-min lessons',
    lesson_count: 5,
    duration_minutes: 55,
    total_price: 12000,
    savings_amount: 500,
    is_active: true,
    region: 'algeria'
  },
  {
    id: 'pkg-10x55-dzd',
    name: '10 × 55-min lessons',
    lesson_count: 10,
    duration_minutes: 55,
    total_price: 24000,
    savings_amount: 1000,
    is_active: true,
    region: 'algeria'
  },
  
  // 25-minute packages (International - EUR)
  {
    id: 'pkg-3x25-eur',
    name: '3 × 25-min lessons',
    lesson_count: 3,
    duration_minutes: 25,
    total_price: 21.50,
    savings_amount: 1.00,
    is_active: true,
    region: 'international'
  },
  {
    id: 'pkg-5x25-eur',
    name: '5 × 25-min lessons',
    lesson_count: 5,
    duration_minutes: 25,
    total_price: 36.00,
    savings_amount: 1.50,
    is_active: true,
    region: 'international'
  },
  {
    id: 'pkg-10x25-eur',
    name: '10 × 25-min lessons',
    lesson_count: 10,
    duration_minutes: 25,
    total_price: 72.00,
    savings_amount: 3.00,
    is_active: true,
    region: 'international'
  },
  
  // 55-minute packages (International - EUR)
  {
    id: 'pkg-3x55-eur',
    name: '3 × 55-min lessons',
    lesson_count: 3,
    duration_minutes: 55,
    total_price: 43.00,
    savings_amount: 2.00,
    is_active: true,
    region: 'international'
  },
  {
    id: 'pkg-5x55-eur',
    name: '5 × 55-min lessons',
    lesson_count: 5,
    duration_minutes: 55,
    total_price: 72.00,
    savings_amount: 3.00,
    is_active: true,
    region: 'international'
  },
  {
    id: 'pkg-10x55-eur',
    name: '10 × 55-min lessons',
    lesson_count: 10,
    duration_minutes: 55,
    total_price: 144.00,
    savings_amount: 6.00,
    is_active: true,
    region: 'international'
  }
];

// Legacy subscription plans for backward compatibility
export const fallbackPlans: SubscriptionPlan[] = [
  {
    id: 'trial',
    name: 'Free Trial',
    price_dzd: 0,
    price_eur: 0,
    max_classes_per_month: 1,
    per_class_price: 0,
    features: { 
      trial_class: true, 
      selected_teachers: true, 
      basic_materials: false,
      rescheduling: false,
      downloadable_content: false 
    },
    is_trial: true,
    sort_order: 1,
    description: '1 class with selected teachers'
  },
  {
    id: 'starter',
    name: 'Starter Pack',
    price_dzd: 6500,
    price_eur: 40,
    max_classes_per_month: 4,
    per_class_price: 10,
    features: { 
      any_teacher: true, 
      basic_materials: true, 
      chat_support: true,
      rescheduling: false,
      downloadable_content: false 
    },
    is_trial: false,
    sort_order: 2,
    description: 'Book any teacher, basic materials access'
  },
  {
    id: 'smart',
    name: 'Smart Learner',
    price_dzd: 12200,
    price_eur: 75,
    max_classes_per_month: 8,
    per_class_price: 9.37,
    savings_percentage: 6,
    features: { 
      any_teacher: true, 
      full_materials: true, 
      priority_support: true,
      rescheduling: true,
      downloadable_content: false 
    },
    is_trial: false,
    sort_order: 3,
    description: 'Save 6%, full access to teachers/materials'
  },
  {
    id: 'power',
    name: 'Power Learner',
    price_dzd: 17900,
    price_eur: 110,
    max_classes_per_month: 12,
    per_class_price: 9.16,
    savings_percentage: 8,
    features: { 
      any_teacher: true, 
      full_materials: true, 
      priority_support: true,
      rescheduling: true,
      downloadable_content: true 
    },
    is_trial: false,
    sort_order: 4,
    description: 'Save 8%, rescheduling + downloadable content'
  },
  {
    id: 'pay_as_go',
    name: 'Pay-As-You-Go',
    price_dzd: 1630,
    price_eur: 10,
    max_classes_per_month: 1,
    per_class_price: 10,
    features: { 
      any_teacher: true, 
      basic_materials: true, 
      one_time: true,
      rescheduling: false,
      downloadable_content: false 
    },
    is_trial: false,
    sort_order: 5,
    description: 'One-time class, book any teacher'
  }
];
