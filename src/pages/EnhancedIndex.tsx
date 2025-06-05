
import React from "react";
import { EnhancedHero } from "@/components/design/EnhancedHero";
import { ModernFeatures } from "@/components/design/ModernFeatures";
import { EnhancedTestimonials } from "@/components/design/EnhancedTestimonials";
import { ModernCTA } from "@/components/design/ModernCTA";
import { Footer } from "@/components/dashboard/Footer";

const EnhancedIndex = () => {
  return (
    <div className="min-h-screen">
      <EnhancedHero />
      <ModernFeatures />
      <EnhancedTestimonials />
      <ModernCTA />
      <Footer />
    </div>
  );
};

export default EnhancedIndex;
