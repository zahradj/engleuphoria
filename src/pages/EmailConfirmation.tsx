import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Mail, ArrowRight } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const EmailConfirmation = () => {
  const [status, setStatus] = useState<'checking' | 'confirmed' | 'error'>('checking');
  const navigate = useNavigate();

  useEffect(() => {
    // Check URL parameters for confirmation status
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    const error = urlParams.get('error');

    if (error) {
      setStatus('error');
    } else if (type === 'signup') {
      setStatus('confirmed');
    } else {
      // Default to confirmed for now
      setStatus('confirmed');
    }
  }, []);

  const getStatusContent = () => {
    switch (status) {
      case 'confirmed':
        return {
          icon: <CheckCircle className="h-16 w-16 text-green-500" />,
          title: "Email Confirmed!",
          description: "Your email has been successfully verified. You can now sign in to your account.",
          buttonText: "Go to Login",
          buttonAction: () => navigate('/login')
        };
      case 'error':
        return {
          icon: <XCircle className="h-16 w-16 text-red-500" />,
          title: "Confirmation Failed",
          description: "There was an issue confirming your email. Please try signing up again or contact support.",
          buttonText: "Back to Sign Up",
          buttonAction: () => navigate('/signup')
        };
      default:
        return {
          icon: <Mail className="h-16 w-16 text-blue-500 animate-pulse" />,
          title: "Processing...",
          description: "We're confirming your email address.",
          buttonText: null,
          buttonAction: null
        };
    }
  };

  const content = getStatusContent();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <AnimatedBackground />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm border-0 animate-fade-in">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {content.icon}
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {content.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600 text-lg leading-relaxed">
              {content.description}
            </p>
            
            {content.buttonText && content.buttonAction && (
              <Button 
                onClick={content.buttonAction}
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                {content.buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            
            <div className="pt-4 border-t">
              <Button 
                variant="link" 
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 hover:text-purple-600"
              >
                ← Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmation;