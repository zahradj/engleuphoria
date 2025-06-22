
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Clock, MessageCircle, Video, Download, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlan {
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

// Updated pricing data for international students
const fallbackPlans: SubscriptionPlan[] = [
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
    price_dzd: 6500, // ~40 EUR
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
    price_dzd: 12200, // ~75 EUR
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
    price_dzd: 17900, // ~110 EUR
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
    price_dzd: 1630, // ~10 EUR
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

const PricingSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>(fallbackPlans);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Use fallback data immediately and skip database fetch for now
    setPlans(fallbackPlans);
    setLoading(false);
  }, []);

  const handlePlanSelection = async (planId: string, isTrialPlan: boolean) => {
    setSelectedPlan(planId);
    setProcessing(true);

    try {
      const selectedPlanData = plans.find(p => p.id === planId);
      
      toast({
        title: "Plan Selected!",
        description: `You've selected the ${selectedPlanData?.name}. Redirecting to dashboard...`,
      });

      // Simulate some processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Navigate to appropriate dashboard
      const userType = localStorage.getItem('userType') || 'student';
      if (userType === 'student') {
        navigate('/student-dashboard');
      } else if (userType === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard');
      }

    } catch (error) {
      console.error('Error selecting plan:', error);
      toast({
        title: "Error",
        description: "Failed to select plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Learning Subscription Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For international students - Based on €10/Class. 
            Choose the perfect plan to start your English learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-lg transition-shadow ${
                plan.name === 'Smart Learner' ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.name === 'Smart Learner' && (
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
                  onClick={() => handlePlanSelection(plan.id, plan.is_trial)}
                  disabled={processing && selectedPlan === plan.id}
                  className={`w-full ${
                    plan.name === 'Smart Learner' 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {processing && selectedPlan === plan.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    plan.is_trial ? 'Start Free Trial' : 
                    plan.name === 'Pay-As-You-Go' ? 'Buy Single Class' : 'Select Plan'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include access to qualified teachers and interactive lessons.
          </p>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingSelection;
