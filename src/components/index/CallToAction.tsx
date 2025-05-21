
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedButton } from "@/components/AnimatedButton";

interface CallToActionProps {
  onStartClick: () => void;
}

export const CallToAction = ({ onStartClick }: CallToActionProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-12 my-8 bg-gradient-to-r from-purple/10 to-teal/10 rounded-2xl">
      <div className="text-center px-4 animate-fade-in">
        <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Child's English Adventure?</h2>
        <p className="text-lg mb-6 max-w-2xl mx-auto">
          Join thousands of families who've discovered the joy of learning English with Engleuphoria.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <AnimatedButton size="lg" onClick={onStartClick} className="gap-2 bg-purple hover:bg-purple/90" animationType="bounce">
            Get Started <ArrowRight className="h-4 w-4" />
          </AnimatedButton>
          <AnimatedButton size="lg" variant="outline" onClick={() => navigate('/for-parents')} animationType="scale" delay="300">
            Learn More
          </AnimatedButton>
        </div>
      </div>
    </section>
  );
};
