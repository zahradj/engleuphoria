
import React from 'react';
import { CheckCircle } from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    "Live one-on-one classes with certified teachers",
    "Interactive games and activities",
    "Age-appropriate curriculum (4-18 years)",
    "Regular progress reports",
    "24/7 customer support",
    "Flexible scheduling",
    "Money-back guarantee",
    "Certificate upon completion"
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 relative overflow-hidden">
      {/* Background effects similar to home page */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -z-10 top-1/4 left-1/4 w-[300px] h-[300px] bg-purple/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute -z-10 bottom-1/4 right-1/4 w-[250px] h-[250px] bg-blue/20 rounded-full blur-3xl animate-pulse opacity-60 animation-delay-1000"></div>
        <div className="absolute -z-10 top-1/3 right-1/3 w-[200px] h-[200px] bg-emerald/20 rounded-full blur-3xl animate-pulse opacity-60 animation-delay-500"></div>
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Everything Your Child Needs to Excel
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our comprehensive program includes all the tools and support your child needs 
              to master English effectively and enjoyably.
            </p>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            {/* Background effects for the image */}
            <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/30 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
            <div className="absolute -z-10 bottom-1/4 right-1/4 w-[90%] h-[90%] bg-blue/25 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-300"></div>
            <div className="absolute -z-10 top-1/3 right-1/3 w-[80%] h-[80%] bg-emerald/20 rounded-full blur-3xl animate-pulse-subtle opacity-50 animation-delay-700"></div>
            
            <div className="relative transform hover:scale-105 transition-transform duration-500">
              <img 
                src="/lovable-uploads/cba853dc-1886-464e-bdbd-67aea13a21b3.png" 
                alt="Child learning English with interactive educational tools and progress tracking"
                className="w-full max-w-lg h-auto object-contain drop-shadow-2xl scale-110"
              />
              <div className="absolute -bottom-6 -left-6 bg-purple-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm">Parent Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
