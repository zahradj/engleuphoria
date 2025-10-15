
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import { useTranslation } from 'react-i18next';

interface HeroProps {
  onStartClick: () => void;
}

export const Hero = ({ onStartClick }: HeroProps) => {
  const { t } = useTranslation();
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-br from-background via-accent/5 to-secondary/5 min-h-[85vh] flex items-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-56 h-56 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <span className="text-lg">🎉</span>
                <span className="text-primary font-semibold text-sm">
                  {t('homepage.hero.badge', { defaultValue: 'Learning Made Fun!' })}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  EnglEuphoria
                </span>
              </h1>
              
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                {t('homepage.hero.tagline', { defaultValue: 'Learn English the Fun Way! 🚀' })}
              </h2>
              
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('homepage.hero.description', { 
                  defaultValue: 'Experience personalized English learning with interactive games, expert teachers, and real-time feedback. Perfect for kids and beginners!' 
                })}
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={onStartClick}
                className="h-14 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <span className="flex items-center gap-2">
                  {t('homepage.hero.cta', { defaultValue: 'Start Your Adventure' })}
                  <ArrowRight className="h-5 w-5" />
                </span>
              </Button>
            </div>

            {/* Feature Highlight */}
            <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-primary p-2.5 rounded-xl">
                  <Star className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground text-lg">
                  {t('homepage.hero.curriculumTitle', { defaultValue: '8-Level ESL Curriculum 🎓' })}
                </span>
              </div>
              <p className="text-muted-foreground">
                {t('homepage.hero.curriculumText', { 
                  defaultValue: 'From Pre-A1 (Starter) to B2 (Upper-Intermediate) with interactive games and activities!' 
                })}
              </p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <div className="bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                <span className="text-primary font-semibold text-sm">
                  {t('homepage.hero.stats.students', { defaultValue: '👥 10,000+ Students' })}
                </span>
              </div>
              <div className="bg-secondary/10 px-4 py-2 rounded-full border border-secondary/20">
                <span className="text-secondary font-semibold text-sm">
                  {t('homepage.hero.stats.rating', { defaultValue: '⭐ 4.9/5 Rating' })}
                </span>
              </div>
              <div className="bg-accent/10 px-4 py-2 rounded-full border border-accent/20">
                <span className="text-accent-foreground font-semibold text-sm">
                  {t('homepage.hero.stats.awards', { defaultValue: '🏆 Award Winning' })}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-2xl">
              <img 
                src="/lovable-uploads/27f0b41c-34f2-4a8e-a08b-9a755fe74f97.png" 
                alt={t('homepage.hero.imageAlt', { defaultValue: 'Interactive English Learning' })} 
                className="w-full h-auto object-contain drop-shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
