
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Shield, 
  Star, 
  Clock, 
  TrendingUp,
  MessageCircle, 
  Award
} from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Shield,
      title: "Safe Learning Environment",
      description: "Certified teachers, secure platform, and monitored classes ensure your child's safety."
    },
    {
      icon: Star,
      title: "Proven Results",
      description: "95% of students show measurable improvement within 3 months of starting."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Classes that fit your family's schedule, with easy rescheduling options."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Real-time reports on your child's learning progress and achievements."
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Regular updates from teachers and direct messaging for any concerns."
    },
    {
      icon: Award,
      title: "International Standards",
      description: "CEFR-aligned curriculum preparing your child for global opportunities."
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-white via-joyful-bg to-emerald-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-joyful-yellow rounded-full animate-float opacity-60"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-joyful-orange rounded-full animate-float-delayed opacity-70"></div>
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-joyful-pink rounded-full animate-float opacity-50"></div>
        
        <div className="absolute -z-10 top-1/4 left-1/4 w-[300px] h-[300px] bg-joyful-purple/10 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute -z-10 bottom-1/4 right-1/4 w-[250px] h-[250px] bg-joyful-blue/10 rounded-full blur-3xl animate-pulse-gentle animation-delay-1000"></div>
        <div className="absolute -z-10 top-1/3 right-1/3 w-[200px] h-[200px] bg-emerald/10 rounded-full blur-3xl animate-pulse-gentle animation-delay-500"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-fun text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 px-2">
            Why Parents Choose 
            <span className="bg-gradient-to-r from-joyful-purple via-joyful-pink to-joyful-orange bg-clip-text text-transparent"> EnglEuphoria ✨</span>
          </h2>
          <p className="font-body text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto px-4">
            Join thousands of satisfied parents who have seen their children thrive with our proven approach. 🌟
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {benefits.map((benefit, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
              <CardHeader className="pb-4 pt-8">
                <div className="w-16 h-16 bg-gradient-to-br from-joyful-purple/20 to-joyful-pink/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <benefit.icon className="h-8 w-8 text-joyful-purple group-hover:text-joyful-pink transition-colors duration-300" />
                </div>
                <CardTitle className="font-fun text-xl sm:text-2xl group-hover:text-joyful-purple transition-colors duration-300">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="font-body text-gray-600 text-base sm:text-lg leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
