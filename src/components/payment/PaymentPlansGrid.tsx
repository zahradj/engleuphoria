import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, CreditCard, Smartphone, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getPricingPlans, PricingPlan } from "@/services/pricingData";

interface PaymentPlansGridProps {
  onPlanSelect?: (planId: string, gateway: string) => void;
}

export const PaymentPlansGrid: React.FC<PaymentPlansGridProps> = ({ onPlanSelect }) => {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await getPricingPlans();
      setPlans(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load payment plans",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = async (plan: PricingPlan, gateway: 'stripe' | 'cib' | 'baridimob') => {
    setProcessingPlan(plan.id);
    
    try {
      if (gateway === 'stripe') {
        // Simulate Stripe integration
        toast({
          title: "Redirecting to Payment",
          description: "Opening Stripe checkout in a new tab...",
        });
        // Here you would normally call your payment service
        setTimeout(() => {
          window.open('https://checkout.stripe.com/demo', '_blank');
        }, 1000);
      } else {
        toast({
          title: "Coming Soon",
          description: `${gateway.toUpperCase()} payment integration will be available soon!`,
          variant: "destructive"
        });
      }
      
      onPlanSelect?.(plan.id, gateway);
    } catch (error) {
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to process payment",
        variant: "destructive"
      });
    } finally {
      setProcessingPlan(null);
    }
  };

  const formatFeatures = (features: PricingPlan['features']) => {
    const featureList = [];
    if (features.lessons_per_month === -1) {
      featureList.push("Unlimited lessons");
    } else if (features.lessons_per_month) {
      featureList.push(`${features.lessons_per_month} lessons/month`);
    }
    if (features.lessons) {
      featureList.push(`${features.lessons} lesson${features.lessons > 1 ? 's' : ''}`);
    }
    if (features.ai_assistant) featureList.push("AI Assistant");
    if (features.homework_tracking) featureList.push("Homework tracking");
    if (features.priority_support) featureList.push("Priority support");
    if (features.custom_curriculum) featureList.push("Custom curriculum");
    if (features.progress_reports) featureList.push("Progress reports");
    if (features.certificate) featureList.push("Completion certificate");
    return featureList;
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-DZ', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading payment plans...</p>
      </div>
    );
  }

  const subscriptionPlans = plans.filter(p => p.type === 'subscription');
  const oneTimePlans = plans.filter(p => p.type === 'one_time');

  return (
    <div className="space-y-8">
      {/* Subscription Plans */}
      {subscriptionPlans.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Monthly Subscription Plans</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'border-blue-500 border-2 shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatPrice(plan.price, plan.currency)}
                    <span className="text-sm font-normal text-gray-500">/{plan.interval}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {formatFeatures(plan.features).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2 pt-4">
                    <Button 
                      onClick={() => handlePlanSelect(plan, 'stripe')}
                      disabled={processingPlan === plan.id}
                      className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-800 hover:bg-gray-900'}`}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      {processingPlan === plan.id ? "Processing..." : "Pay with Card"}
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline"
                        onClick={() => handlePlanSelect(plan, 'cib')}
                        disabled={processingPlan === plan.id}
                        className="text-xs"
                      >
                        <Building2 className="w-3 h-3 mr-1" />
                        CIB
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => handlePlanSelect(plan, 'baridimob')}
                        disabled={processingPlan === plan.id}
                        className="text-xs"
                      >
                        <Smartphone className="w-3 h-3 mr-1" />
                        BaridiMob
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* One-time Plans */}
      {oneTimePlans.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Try Before You Buy</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {oneTimePlans.map((plan) => (
              <Card key={plan.id} className="border-green-200">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(plan.price, plan.currency)}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {formatFeatures(plan.features).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    onClick={() => handlePlanSelect(plan, 'stripe')}
                    disabled={processingPlan === plan.id}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    {processingPlan === plan.id ? "Processing..." : "Book Trial Lesson"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
