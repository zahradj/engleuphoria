
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeroProps {
  onStartClick: () => void;
}

export const Hero = ({ onStartClick }: HeroProps) => {
  const navigate = useNavigate();
  const { languageText } = useLanguage();

  return (
    <div className="flex flex-col-reverse md:flex-row gap-8 items-center">
      <div className="flex-1 md:max-w-[40%]">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 animate-fade-in">
          <span className="bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
            {languageText.learnEnglish}
          </span> {languageText.funWay}
        </h1>
        
        <p className="text-lg mb-6 text-muted-foreground animate-fade-in animation-delay-300">
          {languageText.heroDescription}
        </p>
        
        <div className="flex flex-wrap gap-4 mb-8">
          <FeatureCard 
            icon="video" 
            title={languageText.interactiveClasses} 
            description={languageText.liveVideoLessons} 
            color="purple"
          />
          
          <FeatureCard 
            icon="book" 
            title={languageText.funActivities} 
            description={languageText.gamesAndQuizzes} 
            color="teal"
            delay="300"
          />
          
          <FeatureCard 
            icon="users" 
            title={languageText.community} 
            description={languageText.learnWithFriends} 
            color="orange"
            delay="500"
          />
        </div>
        
        <AnimatedButton size="lg" onClick={onStartClick} className="gap-2" animationType="bounce">
          {languageText.getStarted} <ArrowRight className="h-4 w-4" />
        </AnimatedButton>
      </div>
      
      <div className="flex-1 md:flex-grow md:max-w-[60%] relative">
        {/* Faded circular shadow effects using radial gradients */}
        <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/15 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
        <div className="absolute -z-10 bottom-1/4 right-1/4 w-[90%] h-[90%] bg-teal/15 rounded-full blur-3xl animate-pulse-subtle opacity-65 animation-delay-300"></div>
        <div className="absolute -z-10 top-1/3 right-1/3 w-[80%] h-[80%] bg-orange/10 rounded-full blur-3xl animate-pulse-subtle opacity-55 animation-delay-700"></div>
        
        <img 
          src="/lovable-uploads/94b3a265-e3c7-4819-9be4-de2aa5cdc590.png"
          alt="3D learning illustration with educational elements"
          className="w-full h-auto object-contain mx-auto max-h-[800px] relative z-5 animate-float"
        />
        <div className="absolute -top-4 -right-4 bg-yellow/90 text-yellow-dark font-bold px-4 py-2 rounded-full animate-bounce-light z-20">
          {languageText.joinNow}
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: "video" | "book" | "users";
  title: string;
  description: string;
  color: "purple" | "teal" | "orange";
  delay?: string;
}

const FeatureCard = ({ icon, title, description, color, delay = "0" }: FeatureCardProps) => {
  // Import icons dynamically based on the icon prop
  const renderIcon = () => {
    const className = `text-${color} h-6 w-6`;
    
    switch (icon) {
      case "video":
        return <Video className={className} />;
      case "book":
        return <BookOpen className={className} />;
      case "users":
        return <Users className={className} />;
      default:
        return null;
    }
  };

  const animationClass = delay === "0" ? "animate-scale-in" : `animate-scale-in animation-delay-${delay}`;
  
  return (
    <Card className={`p-4 flex items-center gap-3 w-full sm:w-auto ${animationClass}`}>
      <div className={`bg-${color}/20 p-2 rounded-full`}>
        {renderIcon()}
      </div>
      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};

// Add the imports here to avoid unused imports in the file
import { Video, BookOpen, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
