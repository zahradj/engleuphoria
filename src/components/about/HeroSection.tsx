
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { GraduationCap, Users } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();
  const { languageText } = useLanguage();

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-br from-joyful-bg via-white to-purple-50 relative overflow-hidden">
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

      <div className="container max-w-6xl mx-auto text-center relative z-10">
        <Badge variant="secondary" className="mb-6 bg-joyful-yellow/20 text-joyful-purple border-joyful-yellow/30 text-lg px-6 py-2 hover:scale-105 transition-transform">
          ✨ {languageText.aboutUs || "About Us"}
        </Badge>
        <h1 className="font-fun text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
          Making English Learning 
          <span className="bg-gradient-to-r from-joyful-purple via-joyful-pink to-joyful-orange bg-clip-text text-transparent animate-text-shine"> Joyful ✨</span>
          <br />for Every Child 🌟
        </h1>
        <p className="font-body text-xl sm:text-2xl md:text-3xl text-gray-600 mb-10 max-w-5xl mx-auto leading-relaxed">
          At EnglEuphoria, we're on a mission to transform how children learn English through 
          innovative technology, engaging content, and passionate educators from around the world. 🚀
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/signup")}
            className="group bg-gradient-to-r from-joyful-purple to-joyful-pink hover:from-joyful-purple/90 hover:to-joyful-pink/90 text-white font-bold text-xl px-10 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          >
            <GraduationCap className="mr-3 h-6 w-6" />
            🎓 Start Learning Today
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/for-teachers")}
            className="group border-2 border-joyful-purple text-joyful-purple hover:bg-joyful-purple hover:text-white font-bold text-xl px-10 py-5 rounded-full hover:scale-105 transition-all duration-300"
          >
            <Users className="mr-3 h-6 w-6" />
            👥 Join Our Teacher Community
          </Button>
        </div>
      </div>
    </section>
  );
};
