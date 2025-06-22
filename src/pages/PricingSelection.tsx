
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Clock, MessageCircle, Video, Download } from "lucide-react";
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
}

const PricingSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      setPlans(data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast({
        title: "Error",
        description: "Failed to load subscription plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = async (planId: string, isTrialPlan: boolean) => {
    setSelectedPlan(planId);
    setProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/signup');
        return;
      }

      // Create user subscription
      const subscriptionData = {
        user_id: user.id,
        plan_id: planId,
        status: isTrialPlan ? 'trial' : 'active',
        trial_end_date: isTrialPlan ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : null,
        subscription_start: new Date(),
        subscription_end: isTrialPlan ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      const { error } = await supabase
        .from('user_subscriptions')
        .insert([subscriptionData]);

      if (error) throw error;

      toast({
        title: "Plan Selected!",
        description: `You've successfully selected the ${plans.find(p => p.id === planId)?.name}`,
      });

      // Navigate to appropriate dashboard based on user role
      const userType = localStorage.getItem('userType');
      if (userType === 'student') {
        navigate('/student-dashboard');
      } else if (userType === 'teacher') {
        navigate('/teacher-dashboard');
      } else {
        navigate('/student-dashboard'); // Default to student
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

  const formatPrice = (priceDzd: number, priceEur: number) => {
    return `${priceDzd.toLocaleString()} DZD / ${priceEur}€`;
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'chat': return <MessageCircle className="w-4 h-4" />;
      case 'recordings': return <Video className="w-4 h-4" />;
      case 'materials': return <Download className="w-4 h-4" />;
      default: return <Check className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select the perfect plan to start your English learning journey. 
            All plans include access to qualified teachers and interactive lessons.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative hover:shadow-lg transition-shadow ${
                plan.name === 'Standard Plan' ? 'ring-2 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.name === 'Standard Plan' && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-purple-600 mt-2">
                  {plan.is_trial ? 'Free' : formatPrice(plan.price_dzd, plan.price_eur)}
                </div>
                <p className="text-sm text-gray-500">
                  {plan.is_trial ? '7 days trial' : 'per month'}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm">
                      {plan.max_classes_per_month 
                        ? `${plan.max_classes_per_month} classes/month` 
                        : 'Unlimited classes'
                      }
                    </span>
                  </div>

                  {Object.entries(plan.features).map(([feature, enabled]) => (
                    <div key={feature} className="flex items-center gap-2">
                      {getFeatureIcon(feature)}
                      <span className={`text-sm ${enabled ? 'text-gray-700' : 'text-gray-400'}`}>
                        {feature === 'chat' && 'Teacher messaging'}
                        {feature === 'recordings' && 'Lesson recordings'}
                        {feature === 'materials' && `${enabled} materials access`}
                        {feature === 'support' && `${enabled} support`}
                        {feature === 'unlimited' && 'Unlimited features'}
                      </span>
                      {!enabled && <span className="text-xs text-gray-400 ml-auto">Not included</span>}
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => handlePlanSelection(plan.id, plan.is_trial)}
                  disabled={processing && selectedPlan === plan.id}
                  className={`w-full ${
                    plan.name === 'Standard Plan' 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : 'bg-gray-600 hover:bg-gray-700'
                  }`}
                >
                  {processing && selectedPlan === plan.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    plan.is_trial ? 'Start Free Trial' : 'Select Plan'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need help choosing? Our support team is here to assist you.
          </p>
          <Button variant="outline" onClick={() => navigate('/contact')}>
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PricingSelection;
