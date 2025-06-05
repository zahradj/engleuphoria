
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Users, 
  Clock,
  Gift,
  Star
} from "lucide-react";

export const ModernCTA = () => {
  const navigate = useNavigate();

  const benefits = [
    "Free trial lesson with native teacher",
    "AI-generated learning plan",
    "Access to all interactive features",
    "24/7 student support"
  ];

  const urgencyFeatures = [
    { icon: Gift, text: "50% off first month", color: "text-red-500" },
    { icon: Users, text: "Join 10,000+ students", color: "text-blue-500" },
    { icon: Clock, text: "Limited time offer", color: "text-orange-500" }
  ];

  return (
    <div className="relative py-20 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <Sparkles className="absolute top-20 left-1/4 h-6 w-6 text-yellow-300 animate-pulse" />
        <Star className="absolute top-40 right-1/3 h-4 w-4 text-blue-300 animate-bounce" />
        <Sparkles className="absolute bottom-40 left-1/3 h-5 w-5 text-purple-300 animate-pulse animation-delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
            <div className="p-8 lg:p-12 text-center">
              {/* Header Badge */}
              <Badge className="mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-6 py-2 text-sm font-bold">
                🚀 LIMITED TIME OFFER
              </Badge>

              {/* Main Headline */}
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Start Your English
                <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Mastery </span>
                Journey Today
              </h2>

              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
                Join thousands of successful students who transformed their English skills 
                with our AI-powered learning platform. Your success story starts here.
              </p>

              {/* Urgency Features */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                {urgencyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 backdrop-blur-sm">
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                    <span className="text-white font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* Benefits List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 text-left">
                    <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-blue-100">{benefit}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-10 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  onClick={() => navigate("/signup")}
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-2 border-white/30 hover:border-white/50 bg-white/10 hover:bg-white/20 text-white px-10 py-4 text-lg rounded-2xl backdrop-blur-sm transition-all duration-300"
                  onClick={() => navigate("/login")}
                >
                  Already a Student? Sign In
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-200">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    {[1,2,3,4,5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm">4.9/5 from 5,000+ reviews</span>
                </div>
                <div className="text-sm">
                  🔒 <span className="font-medium">Safe & Secure</span> • Money-back guarantee
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
