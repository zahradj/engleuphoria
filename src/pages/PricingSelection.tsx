
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionPlan } from "@/types/pricing";
import { fallbackPlans } from "@/data/pricingPlans";
import { PricingSelectionLayout } from "@/components/pricing/PricingSelectionLayout";
import { PricingSelectionHeader } from "@/components/pricing/PricingSelectionHeader";
import { PricingPlansGrid } from "@/components/pricing/PricingPlansGrid";
import { PricingFooter } from "@/components/pricing/PricingFooter";
import { ProgressIndicator } from "@/components/navigation/ProgressIndicator";
import { BackNavigation } from "@/components/navigation/BackNavigation";
import { NavigationBreadcrumb } from "@/components/navigation/Breadcrumb";
import { Button } from "@/components/ui/button";

const PricingSelection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>(fallbackPlans);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const stepLabels = ['Account Details', 'Complete Setup'];
  const breadcrumbItems = [
    { label: 'Sign Up', href: '/signup' },
    { label: 'Choose Plan', isCurrentPage: true }
  ];

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
      <div className="container mx-auto px-4 py-8">
        <BackNavigation to="/signup" label="Back to Sign Up" />
        
        <NavigationBreadcrumb items={breadcrumbItems} />
        
        <ProgressIndicator 
          currentStep={2} 
          totalSteps={2} 
          stepLabels={stepLabels}
        />
      </div>
      
      <PricingSelectionHeader />
      <PricingPlansGrid
        plans={plans}
        isProcessing={processing}
        selectedPlan={selectedPlan}
        onPlanSelection={handlePlanSelection}
      />
      
      <div className="text-center mt-8 mb-8">
        <Button 
          variant="ghost" 
          onClick={() => {
            const userType = localStorage.getItem('userType') || 'student';
            const dashboardPath = userType === 'teacher' ? '/teacher-dashboard' : userType === 'admin' ? '/admin-dashboard' : '/student-dashboard';
            navigate(dashboardPath);
          }}
          className="text-sm"
        >
          Skip for now - Continue to Dashboard →
        </Button>
      </div>
      
      <PricingFooter />
    </PricingSelectionLayout>
  );
};

export default PricingSelection;
