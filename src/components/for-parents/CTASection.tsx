
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-joyful-purple via-joyful-pink to-joyful-orange relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-4 h-4 bg-white/30 rounded-full animate-float opacity-80"></div>
        <div className="absolute top-32 right-20 w-3 h-3 bg-joyful-yellow/50 rounded-full animate-float-delayed opacity-90"></div>
        <div className="absolute bottom-20 left-20 w-5 h-5 bg-white/20 rounded-full animate-float opacity-70"></div>
        <div className="absolute top-1/2 right-10 w-2.5 h-2.5 bg-joyful-yellow/40 rounded-full animate-float-delayed opacity-80"></div>
      </div>

      <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
        <h2 className="font-fun text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-8 px-2 leading-tight">
          Ready to Start Your Child's 
          <span className="text-joyful-yellow animate-text-shine"> English Journey? ✨</span>
        </h2>
        <p className="font-body text-xl sm:text-2xl text-white/90 mb-8 sm:mb-10 px-4 leading-relaxed">
          Join thousands of families worldwide and give your child the advantage of English fluency. 🌟
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-8 sm:mb-10 px-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/signup')}
            className="group bg-white text-joyful-purple hover:bg-white/90 font-bold text-lg px-10 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto"
          >
            🚀 Start Free Trial Today
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="group border-2 border-white text-white hover:bg-white hover:text-joyful-purple font-semibold text-lg px-10 py-4 rounded-full hover:scale-105 transition-all duration-300 w-full sm:w-auto"
          >
            <Mail className="mr-2 h-5 w-5" />
            💬 Contact Support
          </Button>
        </div>
        <p className="font-body text-white/80 text-lg sm:text-xl px-4">
          Questions? Email us at <a href="mailto:support@engleuphoria.com" className="underline text-joyful-yellow hover:text-white transition-colors font-semibold">support@engleuphoria.com</a> 📧
        </p>
      </div>
    </section>
  );
};
