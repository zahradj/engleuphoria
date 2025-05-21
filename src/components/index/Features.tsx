
import { Card } from "@/components/ui/card";
import { Video, Award, MessageCircle, Globe } from "lucide-react";

export const Features = () => {
  return (
    <section className="py-16 border-t border-border mt-16">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl font-bold mb-3">Why Choose Engleuphoria?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our playful approach to language learning creates an immersive environment where children naturally absorb English vocabulary, grammar, and pronunciation.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard 
          icon="video" 
          title="Interactive Classes" 
          description="Engage in live, interactive sessions led by certified teachers who make learning fun."
          color="purple"
        />
        
        <FeatureCard 
          icon="award" 
          title="Reward System" 
          description="Earn points and unlock achievements to stay motivated throughout your learning journey."
          color="teal"
          delay="300"
        />
        
        <FeatureCard 
          icon="message" 
          title="Practice Speaking" 
          description="Develop confidence through conversation practice in a supportive environment."
          color="orange"
          delay="500"
        />
        
        <FeatureCard 
          icon="globe" 
          title="Cultural Learning" 
          description="Discover cultures from around the world while improving your language skills."
          color="yellow"
          delay="700"
        />
      </div>
    </section>
  );
};

interface FeatureCardProps {
  icon: "video" | "award" | "message" | "globe";
  title: string;
  description: string;
  color: "purple" | "teal" | "orange" | "yellow";
  delay?: string;
}

const FeatureCard = ({ icon, title, description, color, delay = "0" }: FeatureCardProps) => {
  // Render the appropriate icon based on the icon prop
  const renderIcon = () => {
    const className = `h-8 w-8 text-${color}${color === "yellow" ? "-dark" : ""}`;
    
    switch (icon) {
      case "video":
        return <Video className={className} />;
      case "award":
        return <Award className={className} />;
      case "message":
        return <MessageCircle className={className} />;
      case "globe":
        return <Globe className={className} />;
      default:
        return null;
    }
  };

  const animationClass = delay === "0" ? "animate-scale-in" : `animate-scale-in animation-delay-${delay}`;
  
  return (
    <Card className={`p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow ${animationClass}`}>
      <div className={`bg-${color}/20 p-4 rounded-full mb-4`}>
        {renderIcon()}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
};
