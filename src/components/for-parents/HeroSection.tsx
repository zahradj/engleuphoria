
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-joyful-bg via-white to-emerald-50 relative overflow-hidden">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-joyful-yellow rounded-full animate-float opacity-60"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-joyful-orange rounded-full animate-float-delayed opacity-70"></div>
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-joyful-pink rounded-full animate-float opacity-50"></div>
        <div className="absolute top-1/2 right-10 w-2.5 h-2.5 bg-joyful-purple rounded-full animate-float-delayed opacity-60"></div>
        
        {/* Background blurs */}
        <div className="absolute -z-10 top-1/4 left-1/4 w-[400px] h-[400px] bg-joyful-purple/10 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute -z-10 bottom-1/4 right-1/4 w-[300px] h-[300px] bg-joyful-blue/10 rounded-full blur-3xl animate-pulse-gentle animation-delay-1000"></div>
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="mb-6 bg-joyful-yellow/20 text-joyful-purple border-joyful-yellow/30 text-sm sm:text-base hover:scale-105 transition-transform">
            ✨ For Loving Parents
          </Badge>
          <h1 className="font-fun text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 px-2 leading-tight">
            Give Your Child the Gift of 
            <span className="bg-gradient-to-r from-joyful-purple via-joyful-pink to-joyful-orange bg-clip-text text-transparent animate-text-shine"> English Fluency ✨</span>
          </h1>
          <p className="font-body text-lg sm:text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 sm:mb-10 px-4 leading-relaxed">
            Watch your child gain confidence, improve grades, and unlock global opportunities 
            through our personalized English learning program designed specifically for young learners. 🌟
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="group bg-gradient-to-r from-joyful-purple to-joyful-pink hover:from-joyful-purple/90 hover:to-joyful-pink/90 text-white font-semibold text-lg px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-auto"
            >
              🚀 Start Free Trial
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/classroom')}
              className="group border-2 border-joyful-purple text-joyful-purple hover:bg-joyful-purple hover:text-white font-semibold text-lg px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto"
            >
              🎬 Watch Demo Class
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
