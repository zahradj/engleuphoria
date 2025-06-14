
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { PaymentPlansGrid } from "@/components/payment/PaymentPlansGrid";
import { PaymentSuccess } from "@/components/payment/PaymentSuccess";
import { PaymentHeader } from "@/components/payment/PaymentHeader";
import { ContactInfoForm } from "@/components/payment/ContactInfoForm";
import { SecurityNotice } from "@/components/payment/SecurityNotice";
import { paymentService } from "@/services/paymentService";

const PaymentPage = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load pending user data from localStorage
    const pendingUser = localStorage.getItem('pendingUser');
    if (pendingUser) {
      const userData = JSON.parse(pendingUser);
      setFormData(prev => ({
        ...prev,
        name: userData.name || "",
        email: userData.email || ""
      }));
    }

    // Check for payment success
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const result = await paymentService.verifyPayment(sessionId);
      
      if (result.success && result.status === 'paid') {
        setPaymentSuccess(true);
        localStorage.removeItem('pendingUser');
        toast({
          title: "Payment Successful!",
          description: "Your payment has been processed successfully.",
        });
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        toast({
          title: "Payment Verification",
          description: "Payment is still being processed. Please check back later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Failed to verify payment. Please contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlanSelect = (planId: string, gateway: string) => {
    console.log(`Plan ${planId} selected with ${gateway} gateway`);
    toast({
      title: "Redirecting to Payment",
      description: `Opening ${gateway} payment gateway...`,
    });
  };

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
