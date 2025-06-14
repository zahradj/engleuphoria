
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentPlansGrid } from "@/components/payment/PaymentPlansGrid";

interface PricingPlansSectionProps {
  onPlanSelect: (planId: string, gateway: string) => void;
}

export const PricingPlansSection: React.FC<PricingPlansSectionProps> = ({ 
  onPlanSelect 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Your Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <PaymentPlansGrid onPlanSelect={onPlanSelect} />
      </CardContent>
    </Card>
  );
};
