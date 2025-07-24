
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-8 sm:py-12 md:py-16 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 sm:mb-12">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200 text-xs sm:text-sm">
            For Parents
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-2">
            Give Your Child the Gift of 
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> English Fluency</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            Watch your child gain confidence, improve grades, and unlock global opportunities 
            through our personalized English learning program designed specifically for young learners.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-sm sm:text-base w-full sm:w-auto"
            >
              Start Free Trial
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/classroom')}
              className="text-sm sm:text-base w-full sm:w-auto"
            >
              Watch Demo Class
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
