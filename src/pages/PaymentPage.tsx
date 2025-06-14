
import React from "react";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { usePricingForm } from "@/hooks/usePricingForm";
import { PricingLayout } from "@/components/pricing/PricingLayout";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingContactForm } from "@/components/pricing/PricingContactForm";
import { PricingPlansSection } from "@/components/pricing/PricingPlansSection";
import { PricingSecurityNotice } from "@/components/pricing/PricingSecurityNotice";
import { PricingTestimonials } from "@/components/pricing/PricingTestimonials";
import { PricingComparison } from "@/components/pricing/PricingComparison";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { PricingGuarantee } from "@/components/pricing/PricingGuarantee";

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
      <PricingComparison />
      <PricingGuarantee />
      <PricingTestimonials />
      <PricingFAQ />
      <PricingSecurityNotice />
    </PricingLayout>
  );
};

export default PaymentPage;
