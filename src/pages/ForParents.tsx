
import React from 'react';
import { Header } from "@/components/index/Header";
import { Footer } from "@/components/index/Footer";
import { HeroSection } from "@/components/for-parents/HeroSection";
import { BenefitsSection } from "@/components/for-parents/BenefitsSection";
import { FeaturesSection } from "@/components/for-parents/FeaturesSection";
import { TestimonialsSection } from "@/components/for-parents/TestimonialsSection";
import { CTASection } from "@/components/for-parents/CTASection";

const ForParents = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-blue-50">
      <Header />
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default ForParents;
