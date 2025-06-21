
export interface RegionalPricingPlan {
  id: string;
  name: string;
  type: 'subscription' | 'one_time';
  region: 'algeria' | 'international';
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
  paymentMethods: string[];
}

export const regionalPricingPlans: RegionalPricingPlan[] = [
  // Algeria Plans (DZD)
  {
    id: "algeria-trial",
    name: "Trial Lesson",
    type: "one_time",
    region: "algeria",
    price: 800,
    currency: "DZD",
    description: "Try our platform with a single lesson",
    features: {
      lessons: 1,
      progress_reports: true
    },
    is_active: true,
    paymentMethods: ["BaridiMob", "CIB", "Cash"]
  },
  {
    id: "algeria-basic",
    name: "Basic Plan",
    type: "subscription",
    region: "algeria",
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
    is_active: true,
    paymentMethods: ["BaridiMob", "CIB"]
  },
  {
    id: "algeria-standard",
    name: "Standard Plan",
    type: "subscription",
    region: "algeria",
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
    popular: true,
    paymentMethods: ["BaridiMob", "CIB"]
  },
  {
    id: "algeria-premium",
    name: "Premium Plan",
    type: "subscription",
    region: "algeria",
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
    is_active: true,
    paymentMethods: ["BaridiMob", "CIB"]
  },
  
  // International Plans (EUR)
  {
    id: "international-trial",
    name: "Trial Lesson",
    type: "one_time",
    region: "international",
    price: 5,
    currency: "EUR",
    description: "Try our platform with a single lesson",
    features: {
      lessons: 1,
      progress_reports: true
    },
    is_active: true,
    paymentMethods: ["Bank Transfer", "SEPA"]
  },
  {
    id: "international-monthly",
    name: "Monthly Plan",
    type: "subscription",
    region: "international",
    price: 42,
    currency: "EUR",
    interval: "month",
    description: "Native-level certified teacher",
    features: {
      lessons_per_month: 4,
      ai_assistant: true,
      homework_tracking: true,
      progress_reports: true,
      certificate: true
    },
    is_active: true,
    paymentMethods: ["Bank Transfer", "SEPA"]
  },
  {
    id: "international-standard",
    name: "Standard Plan",
    type: "subscription",
    region: "international",
    price: 78,
    currency: "EUR",
    interval: "month",
    description: "Enhanced learning with priority support",
    features: {
      lessons_per_month: 8,
      ai_assistant: true,
      homework_tracking: true,
      priority_support: true,
      progress_reports: true,
      certificate: true
    },
    is_active: true,
    popular: true,
    paymentMethods: ["Bank Transfer", "SEPA"]
  },
  {
    id: "international-premium",
    name: "Power Learner",
    type: "subscription",
    region: "international",
    price: 110,
    currency: "EUR",
    interval: "month",
    description: "Progress report + badges + unlimited access",
    features: {
      lessons_per_month: 12,
      ai_assistant: true,
      homework_tracking: true,
      priority_support: true,
      custom_curriculum: true,
      progress_reports: true,
      certificate: true
    },
    is_active: true,
    paymentMethods: ["Bank Transfer", "SEPA"]
  }
];

export const getRegionalPlans = (region: 'algeria' | 'international'): Promise<RegionalPricingPlan[]> => {
  const plans = regionalPricingPlans.filter(plan => plan.region === region);
  return Promise.resolve(plans);
};
