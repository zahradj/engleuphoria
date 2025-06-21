
import React from "react";
import { Header } from "@/components/index/Header";
import { Footer } from "@/components/index/Footer";
import { HeroSection } from "@/components/about/HeroSection";
import { MissionSection } from "@/components/about/MissionSection";
import { ValuesSection } from "@/components/about/ValuesSection";
import { TeamSection } from "@/components/about/TeamSection";
import { AchievementsSection } from "@/components/about/AchievementsSection";
import { CTASection } from "@/components/about/CTASection";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <Header />
      <HeroSection />
      <MissionSection />
      <ValuesSection />
      <TeamSection />
      <AchievementsSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default AboutUs;
