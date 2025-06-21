
import React from "react";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { usePricingForm } from "@/hooks/usePricingForm";
import { useLocationPricing } from "@/hooks/useLocationPricing";
import { PricingLayout } from "@/components/pricing/PricingLayout";
import { PricingHeader } from "@/components/pricing/PricingHeader";
import { PricingContactForm } from "@/components/pricing/PricingContactForm";
import { RegionSelector } from "@/components/pricing/RegionSelector";
import { EnhancedPaymentPlansGrid } from "@/components/payment/EnhancedPaymentPlansGrid";
import { PricingSecurityNotice } from "@/components/pricing/PricingSecurityNotice";
import { PricingTestimonials } from "@/components/pricing/PricingTestimonials";
import { PricingComparison } from "@/components/pricing/PricingComparison";
import { PricingFAQ } from "@/components/pricing/PricingFAQ";
import { PricingGuarantee } from "@/components/pricing/PricingGuarantee";

const PaymentPage = () => {
  const { paymentSuccess } = usePaymentVerification();
  const { formData, handleInputChange, handlePlanSelect } = usePricingForm();
  const { selectedRegion, locationInfo, isLoading, handleRegionChange } = useLocationPricing();

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
      
      {!isLoading && (
        <RegionSelector
          selectedRegion={selectedRegion}
          onRegionChange={handleRegionChange}
          detectedLocation={locationInfo?.country}
          autoDetected={locationInfo?.detected}
        />
      )}
      
      <div className="mb-8">
        <EnhancedPaymentPlansGrid 
          selectedRegion={selectedRegion}
          onPlanSelect={handlePlanSelect} 
        />
      </div>
      
      <PricingComparison />
      <PricingGuarantee />
      <PricingTestimonials />
      <PricingFAQ />
      <PricingSecurityNotice />
    </PricingLayout>
  );
};

export default PaymentPage;
