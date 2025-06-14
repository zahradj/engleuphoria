
import React from "react";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { usePricingForm } from "@/hooks/usePricingForm";
import { PricingLayout } from "@/components/pricing/PricingLayout";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingContactForm } from "@/components/pricing/PricingContactForm";
import { PricingPlansSection } from "@/components/pricing/PricingPlansSection";
import { PricingSecurityNotice } from "@/components/pricing/PricingSecurityNotice";

const PaymentPage = () => {
  const { paymentSuccess } = usePaymentVerification();
  const { formData, handleInputChange, handlePlanSelect } = usePricingForm();

  if (paymentSuccess) {
    return <PaymentSuccess />;
  }

  return (
    <PricingLayout>
      <PricingHeader />
      <PricingContactForm 
        formData={formData}
        onInputChange={handleInputChange}
      />
      <PricingPlansSection onPlanSelect={handlePlanSelect} />
      <PricingSecurityNotice />
    </PricingLayout>
  );
};

export default PaymentPage;
