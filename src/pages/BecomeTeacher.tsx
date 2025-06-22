
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from "@/components/index/Header";
import { Footer } from "@/components/index/Footer";
import { HeroSection } from "@/components/become-teacher/HeroSection";
import { BenefitsSection } from "@/components/become-teacher/BenefitsSection";
import { RequirementsSection } from "@/components/become-teacher/RequirementsSection";
import { ProcessSection } from "@/components/become-teacher/ProcessSection";
import { CTASection } from "@/components/become-teacher/CTASection";

const BecomeTeacher = () => {
  const navigate = useNavigate();

  const handleApplyClick = () => {
    navigate('/teacher-application');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <HeroSection onApplyClick={handleApplyClick} />
      <BenefitsSection />
      <RequirementsSection />
      <ProcessSection />
      <CTASection onApplyClick={handleApplyClick} />

      <Footer />
    </div>
  );
};

export default BecomeTeacher;
