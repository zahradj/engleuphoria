
export interface PricingPlan {
  id: string;
  name: string;
  type: 'subscription' | 'one_time';
  price: number;
  currency: string;
  interval?: string;
  features: {
    lessons_per_month?: number;
    ai_assistant?: boolean;
    homework_tracking?: boolean;
    priority_support?: boolean;
    custom_curriculum?: boolean;
    progress_reports?: boolean;
    certificate?: boolean;
    lessons?: number;
  };
  is_active: boolean;
  popular?: boolean;
  description: string;
  originalPrice?: number;
}

export const mockPricingPlans: PricingPlan[] = [
  {
    id: "basic-monthly",
    name: "Basic Plan",
    type: "subscription",
    price: 2500,
    currency: "DZD",
    interval: "month",
    description: "Perfect for beginners starting their English journey",
    features: {
      lessons_per_month: 4,
      ai_assistant: true,
      homework_tracking: true,
      progress_reports: true
    },
    is_active: true
  },
  {
    id: "standard-monthly",
    name: "Standard Plan",
    type: "subscription",
    price: 4500,
    currency: "DZD",
    interval: "month",
    description: "Most popular choice for consistent learning",
    features: {
      lessons_per_month: 8,
      ai_assistant: true,
      homework_tracking: true,
      priority_support: true,
      progress_reports: true,
      certificate: true
    },
    is_active: true,
    popular: true
  },
  {
    id: "premium-monthly",
    name: "Premium Plan",
    type: "subscription",
    price: 7500,
    currency: "DZD",
    interval: "month",
    description: "Unlimited learning with personalized curriculum",
    features: {
      lessons_per_month: -1,
      ai_assistant: true,
      homework_tracking: true,
      priority_support: true,
      custom_curriculum: true,
      progress_reports: true,
      certificate: true
    },
    is_active: true
  },
  {
    id: "trial-lesson",
    name: "Trial Lesson",
    type: "one_time",
    price: 800,
    currency: "DZD",
    description: "Try our platform with a single lesson",
    features: {
      lessons: 1,
      ai_assistant: false,
      progress_reports: true
    },
    is_active: true
  }
];

export const getMockPricingPlans = (): Promise<PricingPlan[]> => {
  return Promise.resolve(mockPricingPlans);
};
