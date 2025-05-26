
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Smartphone, Building2, Globe, CheckCircle, ArrowLeft } from "lucide-react";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    amount: "2500" // Default amount for student subscription
  });
  const [isLoading, setIsLoading] = useState(false);
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
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      toast({
        title: "Error", 
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }
    if (!formData.amount.trim() || parseFloat(formData.amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const handlePayment = async (method: string, redirectUrl: string) => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Processing payment with ${method}:`, {
        ...formData,
        method,
        redirectUrl
      });

      toast({
        title: "Redirecting to Payment",
        description: `Redirecting to ${method} payment gateway...`,
      });

      // For now, just show a success simulation
      setTimeout(() => {
        toast({
          title: "Payment Initiated",
          description: `Payment of ${formData.amount} DA has been initiated via ${method}`,
        });
        
        // After successful payment, clear pending user data and redirect to dashboard
        localStorage.removeItem('pendingUser');
        setTimeout(() => navigate("/dashboard"), 2000);
      }, 2000);

    } catch (error) {
      toast({
        title: "Payment Error",
        description: "An error occurred while processing your payment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Registration</h1>
          <p className="text-gray-600">Choose your preferred payment method to activate your student account</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Student Subscription Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <div>
              <Label htmlFor="amount">Monthly Subscription (DA)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="2500"
                min="1"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
              <p className="text-sm text-gray-500 mt-1">Monthly subscription for full access to English learning courses</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <div className="grid gap-6 md:grid-cols-1">
          {/* CIB Card (SATIM) Payment */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">CIB Card</h3>
                    <p className="text-sm text-gray-600">Pay with SATIM Gateway</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Recommended</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Secure payment using your CIB card through SATIM's official payment gateway
              </p>
              <Button 
                onClick={() => handlePayment("CIB Card (SATIM)", "https://satim-payment-gateway.com/pay")}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? "Processing..." : "Pay with CIB Card"}
              </Button>
            </CardContent>
          </Card>

          {/* BaridiMob (Edahabia) Payment */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-yellow-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">BaridiMob</h3>
                    <p className="text-sm text-gray-600">Edahabia Card Payment</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Popular</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Pay using your Edahabia card through Algérie Poste secure payment system
              </p>
              <Button 
                onClick={() => handlePayment("BaridiMob (Edahabia)", "https://baridimob-pay.dz/checkout")}
                disabled={isLoading}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                {isLoading ? "Processing..." : "Pay with BaridiMob"}
              </Button>
            </CardContent>
          </Card>

          {/* International Payment (Stripe/PayPal) */}
          <Card className="hover:shadow-lg transition-shadow border-2 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">International Payment</h3>
                    <p className="text-sm text-gray-600">Stripe & PayPal</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">International</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Pay with international credit/debit cards or PayPal account
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => handlePayment("Stripe", "https://checkout.stripe.com")}
                  disabled={isLoading}
                  variant="outline"
                  className="border-blue-300 hover:bg-blue-50"
                >
                  {isLoading ? "..." : "Stripe"}
                </Button>
                <Button 
                  onClick={() => handlePayment("PayPal", "https://paypal.com/checkout")}
                  disabled={isLoading}
                  variant="outline"
                  className="border-blue-300 hover:bg-blue-50"
                >
                  {isLoading ? "..." : "PayPal"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Notice */}
        <Card className="mt-8 bg-gray-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span>Your payment information is encrypted and secure</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentPage;
