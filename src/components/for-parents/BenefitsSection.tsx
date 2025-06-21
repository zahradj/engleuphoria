
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Why Parents Choose EnglEuphoria
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of satisfied parents who have seen their children thrive with our proven approach.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <benefit.icon className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
