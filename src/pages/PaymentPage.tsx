
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentPlansGrid } from "@/components/payment/PaymentPlansGrid";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { PaymentHeader } from "@/components/payment/PaymentHeader";
import { ContactInfoForm } from "@/components/payment/ContactInfoForm";
import { SecurityNotice } from "@/components/payment/SecurityNotice";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import { usePaymentForm } from "@/hooks/usePaymentForm";

const PaymentPage = () => {
  const { paymentSuccess } = usePaymentVerification();
  const { formData, handleInputChange, handlePlanSelect } = usePaymentForm();

  if (paymentSuccess) {
    return <PaymentSuccess />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <PaymentHeader />

        <ContactInfoForm 
          formData={formData}
          onInputChange={handleInputChange}
        />

        <Card>
          <CardHeader>
            <CardTitle>Select Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentPlansGrid onPlanSelect={handlePlanSelect} />
          </CardContent>
        </Card>

        <SecurityNotice />
      </div>
    </div>
  );
};

export default PaymentPage;
