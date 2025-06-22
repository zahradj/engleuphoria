
import React from "react";
import { PricingPlanCard } from "./PricingPlanCard";
import { SubscriptionPlan } from "@/types/pricing";

interface PricingPlansGridProps {
  plans: SubscriptionPlan[];
  isProcessing: boolean;
  selectedPlan: string | null;
  onPlanSelection: (planId: string, isTrialPlan: boolean) => void;
}

export const PricingPlansGrid: React.FC<PricingPlansGridProps> = ({
  plans,
  isProcessing,
  selectedPlan,
  onPlanSelection
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {plans.map((plan) => (
        <PricingPlanCard
          key={plan.id}
          plan={plan}
          isPopular={plan.name === 'Smart Learner'}
          isProcessing={isProcessing}
          selectedPlan={selectedPlan}
          onPlanSelection={onPlanSelection}
        />
      ))}
    </div>
  );
};
