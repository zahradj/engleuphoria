
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6 px-2">
          Ready to Start Your Child's English Journey?
        </h2>
        <p className="text-lg sm:text-xl text-blue-100 mb-6 sm:mb-8 px-4">
          Join thousands of families worldwide and give your child the advantage of English fluency.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="bg-white text-purple-600 hover:bg-gray-100 text-sm sm:text-base w-full sm:w-auto"
          >
            Start Free Trial Today
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white text-white hover:bg-white hover:text-purple-600 text-sm sm:text-base w-full sm:w-auto"
          >
            <Mail className="mr-2 h-4 w-4" />
            Contact Support
          </Button>
        </div>
        <p className="text-blue-100 text-sm sm:text-base px-4">
          Questions? Email us at <a href="mailto:support@engleuphoria.com" className="underline font-semibold">support@engleuphoria.com</a>
        </p>
      </div>
    </section>
  );
};
