
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PaymentService } from '@/services/paymentService';

export const usePaymentVerification = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    paymentId?: string;
    error?: string;
  } | null>(null);
  const { toast } = useToast();

  const verifyPayment = async (paymentData: any) => {
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Process payment using PaymentService
      const result = await PaymentService.processPayment(paymentData);
      
      setVerificationResult(result);
      
      if (result.success) {
        toast({
          title: "Payment Successful",
          description: "Your payment has been processed successfully.",
        });
      } else {
        toast({
          title: "Payment Failed",
          description: result.error || "Payment processing failed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      const result = {
        success: false,
        error: "An unexpected error occurred during payment verification."
      };
      setVerificationResult(result);
      toast({
        title: "Payment Error",
        description: result.error,
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    isVerifying,
    verificationResult,
    verifyPayment,
  };
};
