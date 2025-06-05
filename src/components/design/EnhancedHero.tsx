
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BookOpen, 
  Video, 
  Star, 
  Globe, 
  Award,
  ArrowRight,
  Play,
  CheckCircle
} from "lucide-react";

export const EnhancedHero = () => {
  const navigate = useNavigate();

  const features = [
    "Live 1-on-1 Classes",
    "AI-Powered Learning",
    "Interactive Whiteboard",
    "Progress Tracking"
  ];

  const stats = [
    { icon: Users, label: "Happy Students", value: "10,000+" },
    { icon: BookOpen, label: "Lessons Completed", value: "50,000+" },
    { icon: Star, label: "Average Rating", value: "4.9/5" },
    { icon: Globe, label: "Countries", value: "25+" }
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="bg-purple-100 text-purple-700 border-purple-200 px-4 py-2 text-sm font-medium">
                🚀 #1 ESL Learning Platform in Algeria
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Master English with
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> AI-Powered </span>
                Learning
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Join thousands of students learning English through personalized 1-on-1 classes, 
                interactive games, and AI-assisted curriculum designed specifically for Arabic speakers.
              </p>
            </div>

            {/* Features List */}
            <div className="grid grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                onClick={() => navigate("/signup")}
              >
                Start Learning Today
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-gray-300 hover:border-purple-300 px-8 py-4 text-lg font-semibold rounded-xl hover:bg-purple-50 transition-all duration-300"
                onClick={() => navigate("/login")}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-2">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 border-2 border-white"></div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-semibold">Join 10,000+</span> happy students
              </div>
            </div>
          </div>

          {/* Right Column - Interactive Demo Card */}
          <div className="relative">
            <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Experience Live Learning
                  </h3>
                  <p className="text-gray-600">
                    See how our AI-powered platform works
                  </p>
                </div>

                {/* Mock Video Interface */}
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </Button>
                  </div>
                  
                  {/* Mock UI Elements */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white">🔴 LIVE</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 rounded-lg p-3 text-white text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <Video className="h-4 w-4" />
                        <span>Ms. Sarah Johnson</span>
                      </div>
                      <p>"Let's practice pronunciation together!"</p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">30min</div>
                    <div className="text-sm text-green-700">Class Duration</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">1:1</div>
                    <div className="text-sm text-blue-700">Personal Attention</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center bg-white/60 backdrop-blur-sm border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              <stat.icon className="h-8 w-8 mx-auto mb-3 text-purple-600" />
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
