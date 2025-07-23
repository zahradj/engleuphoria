
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Globe, Award } from "lucide-react";

export const ValuesSection = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion for Learning",
      description: "We believe every child deserves access to quality English education that sparks joy and curiosity."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a supportive community where children, parents, and teachers connect and grow together."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Making English learning accessible to children worldwide, regardless of location or background."
    },
    {
      icon: Award,
      title: "Excellence in Education",
      description: "Committed to the highest standards of educational content and teaching methodologies."
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-br from-joyful-bg via-white to-emerald-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-3 h-3 bg-joyful-yellow rounded-full animate-float opacity-60"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-joyful-orange rounded-full animate-float-delayed opacity-70"></div>
        <div className="absolute top-1/2 right-20 w-4 h-4 bg-joyful-pink rounded-full animate-float opacity-50"></div>
        
        <div className="absolute -z-10 top-1/4 right-1/4 w-[300px] h-[300px] bg-joyful-purple/10 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute -z-10 bottom-1/4 left-1/4 w-[250px] h-[250px] bg-joyful-blue/10 rounded-full blur-3xl animate-pulse-gentle animation-delay-1000"></div>
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-fun text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Our Core 
            <span className="bg-gradient-to-r from-joyful-purple via-joyful-pink to-joyful-orange bg-clip-text text-transparent"> Values ❤️</span>
          </h2>
          <p className="font-body text-xl sm:text-2xl text-gray-600">
            The principles that guide everything we do at EnglEuphoria ✨
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {values.map((value, index) => (
            <Card key={index} className="group text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-gradient-to-br from-joyful-purple/20 to-joyful-pink/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="h-10 w-10 text-joyful-purple group-hover:text-joyful-pink transition-colors duration-300" />
                </div>
                <h3 className="font-fun font-bold mb-4 text-xl group-hover:text-joyful-purple transition-colors duration-300">{value.title}</h3>
                <p className="font-body text-gray-600 text-base leading-relaxed">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
