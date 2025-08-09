
import { ArrowRight } from "lucide-react";
import { AnimatedButton } from "@/components/AnimatedButton";
import { useTranslation } from 'react-i18next';

interface HowItWorksProps {
  onStartClick: () => void;
}

export const HowItWorks = ({ onStartClick }: HowItWorksProps) => {
  const { t } = useTranslation();
    <section className="py-16 border-t border-border">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl font-bold mb-3">{t('homepage.howItWorks.heading', { defaultValue: 'How It Works' })}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {t('homepage.howItWorks.intro', { defaultValue: 'Getting started with Engleuphoria is easy and fun!' })}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <Step 
          number={1} 
          title={t('homepage.howItWorks.steps.createProfile.title', { defaultValue: 'Create Your Profile' })}
          description={t('homepage.howItWorks.steps.createProfile.description', { defaultValue: 'Sign up and choose your favorite avatar to start your adventure.' })}
          color="purple"
        />
        
        <Step 
          number={2} 
          title={t('homepage.howItWorks.steps.joinClasses.title', { defaultValue: 'Join Classes & Activities' })}
          description={t('homepage.howItWorks.steps.joinClasses.description', { defaultValue: 'Participate in live classes and complete fun learning activities.' })}
          color="teal"
          delay="300"
        />
        
        <Step 
          number={3} 
          title={t('homepage.howItWorks.steps.trackProgress.title', { defaultValue: 'Track Progress' })}
          description={t('homepage.howItWorks.steps.trackProgress.description', { defaultValue: "Watch your English skills improve as you earn points and badges." })}
          color="orange"
          delay="500"
        />
      </div>
      
      <div className="text-center mt-12">
        <AnimatedButton size="lg" onClick={onStartClick} className="gap-2" animationType="bounce">
          {t('homepage.howItWorks.cta', { defaultValue: 'Start Learning Today' })} <ArrowRight className="h-4 w-4" />
        </AnimatedButton>
      </div>
    </section>
  );
};

interface StepProps {
  number: number;
  title: string;
  description: string;
  color: "purple" | "teal" | "orange";
  delay?: string;
}

const Step = ({ number, title, description, color, delay = "0" }: StepProps) => {
  const animationClass = delay === "0" ? "animate-fade-in" : `animate-fade-in animation-delay-${delay}`;
  const bounceAnimationClass = delay === "0" ? "animate-bounce-light" : `animate-bounce-light animation-delay-${delay}`;
  
  return (
    <div className={`flex flex-col items-center text-center ${animationClass}`}>
      <div className={`bg-${color} w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 ${bounceAnimationClass}`}>
        {number}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};
