
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, CreditCard, Smartphone, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { paymentService, PaymentPlan } from "@/services/paymentService";

interface PaymentPlansGridProps {
  onPlanSelect?: (planId: string, gateway: string) => void;
}

export const PaymentPlansGrid: React.FC<PaymentPlansGridProps> = ({ onPlanSelect }) => {
  const [plans, setPlans] = useState<PaymentPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await paymentService.getPaymentPlans();
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

  const handlePlanSelect = async (plan: PaymentPlan, gateway: 'stripe' | 'cib' | 'baridimob') => {
    setProcessingPlan(plan.id);
    
    try {
      if (gateway === 'stripe') {
        const { url } = await paymentService.createCheckout(plan.id);
        window.open(url, '_blank');
      } else if (gateway === 'cib') {
        await paymentService.processCIBPayment(plan.id, plan.price);
      } else if (gateway === 'baridimob') {
        await paymentService.processBaridiMobPayment(plan.id, plan.price);
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

  const formatFeatures = (features: Record<string, any>) => {
    const featureList = [];
    if (features.lessons_per_month === -1) {
      featureList.push("Unlimited lessons");
    } else if (features.lessons_per_month) {
      featureList.push(`${features.lessons_per_month} lessons/month`);
    }
    if (features.ai_assistant) featureList.push("AI Assistant");
    if (features.homework_tracking) featureList.push("Homework tracking");
    if (features.priority_support) featureList.push("Priority support");
    if (features.custom_curriculum) featureList.push("Custom curriculum");
    return featureList;
  };

  if (loading) {
    return <div className="text-center py-8">Loading payment plans...</div>;
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
              <Card key={plan.id} className={`relative ${plan.name.includes('Premium') ? 'border-blue-500 border-2' : ''}`}>
                {plan.name.includes('Premium') && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600">
                    {plan.price.toLocaleString()} {plan.currency}
                    <span className="text-sm font-normal text-gray-500">/month</span>
                  </div>
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
                  
                  <div className="space-y-2">
                    <Button 
                      onClick={() => handlePlanSelect(plan, 'stripe')}
                      disabled={processingPlan === plan.id}
                      className="w-full bg-blue-600 hover:bg-blue-700"
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
          <h3 className="text-xl font-semibold mb-4">Pay Per Lesson</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {oneTimePlans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader className="text-center">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <div className="text-2xl font-bold text-green-600">
                    {plan.price.toLocaleString()} {plan.currency}
                  </div>
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
                    {processingPlan === plan.id ? "Processing..." : "Book Lesson"}
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
