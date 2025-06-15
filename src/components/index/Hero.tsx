
import { Button } from "@/components/ui/button";
import { ArrowRight, Gamepad2, Sparkles } from "lucide-react";

interface HeroProps {
  onStartClick: () => void;
}

export const Hero = ({ onStartClick }: HeroProps) => {
  return (
    <section className="text-center py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
          Learn English with AI-Powered Fun!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          Experience personalized English learning with interactive games, AI tutors, and real-time feedback. 
          Perfect for kids and beginners!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button 
            size="lg" 
            onClick={onStartClick}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white px-8 py-4 text-lg"
          >
            Start Learning Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            onClick={() => window.location.href = '/classroom'}
            className="border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg"
          >
            <Gamepad2 className="mr-2 h-5 w-5" />
            Try AI Games Now
          </Button>
        </div>

        <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-emerald-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <span className="font-semibold text-purple-800">New AI Features!</span>
          </div>
          <p className="text-purple-700">
            Try our AI-powered games: <strong>Drag & Drop Match</strong>, <strong>Spinning Wheel</strong>, 
            and <strong>Dice Rolling</strong> games with smart content generation!
          </p>
        </div>
      </div>
    </section>
  );
};
