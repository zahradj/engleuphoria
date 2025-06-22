
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Clock, MessageCircle, Video, Download } from "lucide-react";
import { SubscriptionPlan } from "@/types/pricing";

interface PricingPlanCardProps {
  plan: SubscriptionPlan;
  isPopular?: boolean;
  isProcessing: boolean;
  selectedPlan: string | null;
  onPlanSelection: (planId: string, isTrialPlan: boolean) => void;
}

export const PricingPlanCard: React.FC<PricingPlanCardProps> = ({
  plan,
  isPopular = false,
  isProcessing,
  selectedPlan,
  onPlanSelection
}) => {
  const formatPrice = (priceEur: number, priceDzd: number, perClassPrice?: number) => {
    if (priceEur === 0) return 'Free';
    if (perClassPrice) {
      return `€${priceEur}/month (€${perClassPrice}/class)`;
    }
    return `€${priceEur}`;
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'any_teacher': 
      case 'selected_teachers': return <MessageCircle className="w-4 h-4" />;
      case 'downloadable_content': return <Download className="w-4 h-4" />;
      case 'rescheduling': return <Clock className="w-4 h-4" />;
      default: return <Check className="w-4 h-4" />;
    }
  };

  const getFeatureText = (feature: string, enabled: any) => {
    const featureTexts = {
      'trial_class': 'Trial class included',
      'selected_teachers': 'Access to selected teachers',
      'any_teacher': 'Book any teacher',
      'basic_materials': 'Basic materials access',
      'full_materials': 'Full materials library',
      'chat_support': 'Chat support',
      'priority_support': 'Priority support',
      'rescheduling': 'Free rescheduling',
      'downloadable_content': 'Downloadable content',
      'one_time': 'One-time purchase'
    };
    return featureTexts[feature] || feature;
  };

  return (
    <Card 
      className={`relative hover:shadow-lg transition-shadow ${
        isPopular ? 'ring-2 ring-purple-500 scale-105' : ''
      }`}
    >
      {isPopular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
          <Star className="w-3 h-3 mr-1" />
          Most Popular
        </Badge>
      )}
      
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg font-bold">{plan.name}</CardTitle>
        <div className="text-2xl font-bold text-purple-600 mt-2">
          {formatPrice(plan.price_eur, plan.price_dzd, plan.per_class_price)}
        </div>
        {plan.savings_percentage && (
          <Badge variant="secondary" className="mt-1">
            Save {plan.savings_percentage}%
          </Badge>
        )}
        <p className="text-xs text-gray-500 mt-1">
          {plan.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-green-500" />
            <span className="text-sm">
              {plan.max_classes_per_month === 1 && plan.name === 'Pay-As-You-Go' 
                ? '1 class per purchase' 
                : plan.max_classes_per_month 
                ? `${plan.max_classes_per_month} classes/month` 
                : 'Unlimited classes'
              }
            </span>
          </div>

          {Object.entries(plan.features).map(([feature, enabled]) => 
            enabled ? (
              <div key={feature} className="flex items-center gap-2">
                {getFeatureIcon(feature)}
                <span className="text-sm text-gray-700">
                  {getFeatureText(feature, enabled)}
                </span>
              </div>
            ) : null
          )}
        </div>

        <Button
          onClick={() => onPlanSelection(plan.id, plan.is_trial)}
          disabled={isProcessing && selectedPlan === plan.id}
          className={`w-full ${
            isPopular 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-gray-600 hover:bg-gray-700'
          }`}
        >
          {isProcessing && selectedPlan === plan.id ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            plan.is_trial ? 'Start Free Trial' : 
            plan.name === 'Pay-As-You-Go' ? 'Buy Single Class' : 'Select Plan'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
