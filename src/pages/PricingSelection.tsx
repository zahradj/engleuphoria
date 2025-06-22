
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from "@/types/pricing";
import { fallbackPlans } from "@/data/pricingPlans";
import { PricingSelectionLayout } from "@/components/pricing/PricingSelectionLayout";
import { PricingSelectionHeader } from "@/components/pricing/PricingSelectionHeader";
import { PricingPlansGrid } from "@/components/pricing/PricingPlansGrid";
import { PricingFooter } from "@/components/pricing/PricingFooter";

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

  return (
    <PricingSelectionLayout>
      <PricingSelectionHeader />
      <PricingPlansGrid
        plans={plans}
        isProcessing={processing}
        selectedPlan={selectedPlan}
        onPlanSelection={handlePlanSelection}
      />
      <PricingFooter />
    </PricingSelectionLayout>
  );
};

export default PricingSelection;
