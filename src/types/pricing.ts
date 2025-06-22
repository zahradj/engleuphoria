
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
