
import React from 'react';
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onApplyClick: () => void;
}

export const HeroSection = ({ onApplyClick }: HeroSectionProps) => {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <div className="container mx-auto max-w-4xl text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Become an Online English Teacher
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join our community of passionate educators and help students around the world 
          achieve their English learning goals. Flexible hours, competitive pay, and 
          meaningful impact.
        </p>
        <Button 
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
          onClick={onApplyClick}
        >
          Apply Now
        </Button>
        <p className="text-sm text-gray-500 mt-4">
          Application takes about 15 minutes
        </p>
      </div>
    </section>
  );
};
