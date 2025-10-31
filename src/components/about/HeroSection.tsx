
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
    <section className="py-20 px-4">
      <div className="container max-w-6xl mx-auto text-center">
        <Badge variant="secondary" className="mb-4">
          {languageText.aboutUs || "About Us"}
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary-light bg-clip-text text-transparent">
          Making English Learning Joyful for Every Child
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          At EnglEuphoria, we're on a mission to transform how children learn English through 
          innovative technology, engaging content, and passionate educators from around the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light"
          >
            <GraduationCap className="mr-2 h-5 w-5" />
            Start Learning Today
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => navigate("/for-teachers")}
          >
            <Users className="mr-2 h-5 w-5" />
            Join Our Teacher Community
          </Button>
        </div>
      </div>
    </section>
  );
};
