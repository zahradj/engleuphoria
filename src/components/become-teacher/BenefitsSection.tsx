
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, DollarSign, Clock, Award, Video } from "lucide-react";

export const BenefitsSection = () => {
  const benefits = [
    {
      icon: Globe,
      title: "Teach Globally",
      description: "Connect with students from around the world and share your expertise"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Set your own hours and teach when it's convenient for you"
    },
    {
      icon: DollarSign,
      title: "Competitive Pay",
      description: "Earn competitive rates with weekly payouts"
    },
    {
      icon: Users,
      title: "Small Classes",
      description: "Focus on individual students with one-on-one sessions"
    },
    {
      icon: Award,
      title: "Professional Growth",
      description: "Access to teaching resources and professional development"
    },
    {
      icon: Video,
      title: "Modern Platform",
      description: "State-of-the-art virtual classroom technology"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Why Teach With Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {benefit.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
