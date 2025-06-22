
import React from 'react';
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  onApplyClick: () => void;
}

export const CTASection = ({ onApplyClick }: CTASectionProps) => {
  return (
    <section className="py-16 bg-emerald-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Start Your Teaching Journey?
        </h2>
        <p className="text-emerald-100 text-xl mb-8 max-w-2xl mx-auto">
          Join hundreds of teachers who are already making a difference. 
          Apply today and start teaching within a week.
        </p>
        <Button 
          size="lg" 
          variant="secondary"
          className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3"
          onClick={onApplyClick}
        >
          Apply Now
        </Button>
      </div>
    </section>
  );
};
