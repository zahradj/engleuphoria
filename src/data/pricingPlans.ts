
import { SubscriptionPlan } from '@/types/pricing';

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
