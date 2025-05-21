
import { Card } from "@/components/ui/card";

export const Testimonials = () => {
  return (
    <section className="py-16 border-t border-border">
      <div className="text-center mb-12 animate-fade-in">
        <h2 className="text-3xl font-bold mb-3">What Parents Say</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Don't just take our word for it - hear from our happy families!
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TestimonialCard
          initials="SM"
          name="Sarah M."
          role="Parent of 8-year-old"
          quote="My daughter used to be shy about speaking English. After three months with Engleuphoria, she's constantly practicing and even teaching her younger brother!"
          color="purple"
        />
        
        <TestimonialCard
          initials="JT"
          name="James T."
          role="Parent of 6-year-old twins"
          quote="The gamification is brilliant! My boys are so competitive with the points system that they're learning without even realizing it."
          color="teal"
          delay="300"
        />
        
        <TestimonialCard
          initials="LR"
          name="Lisa R."
          role="Parent of 10-year-old"
          quote="The teachers are exceptional - so patient and encouraging. My son's confidence in English has improved dramatically in just a few weeks."
          color="orange"
          delay="500"
        />
      </div>
    </section>
  );
};

interface TestimonialCardProps {
  initials: string;
  name: string;
  role: string;
  quote: string;
  color: "purple" | "teal" | "orange";
  delay?: string;
}

const TestimonialCard = ({ initials, name, role, quote, color, delay = "0" }: TestimonialCardProps) => {
  const animationClass = delay === "0" ? "animate-scale-in" : `animate-scale-in animation-delay-${delay}`;
  
  return (
    <Card className={`p-6 ${animationClass}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`bg-${color}/20 w-12 h-12 rounded-full flex items-center justify-center`}>
          <span className={`font-bold text-${color}`}>{initials}</span>
        </div>
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <p className="italic">{quote}</p>
    </Card>
  );
};
