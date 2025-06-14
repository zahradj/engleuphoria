import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle, ArrowLeft } from "lucide-react";
import { PaymentPlansGrid } from "@/components/payment/PaymentPlansGrid";
import { paymentService } from "@/services/paymentService";

const PaymentPage = () => {
  const navigate = useNavigate();
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your payment has been processed and your account is now active.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard in a few seconds...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Learning Plan</h1>
          <p className="text-gray-600">Select the perfect plan for your English learning journey</p>
        </div>

        {/* User Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Plans */}
        <Card>
          <CardHeader>
            <CardTitle>Select Your Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentPlansGrid onPlanSelect={handlePlanSelect} />
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="mt-8 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Your payment information is encrypted and secure. We support multiple payment methods including international cards and local Algerian payment systems.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;
