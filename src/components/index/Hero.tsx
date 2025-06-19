
import { Button } from "@/components/ui/button";
import { ArrowRight, Gamepad2, Sparkles } from "lucide-react";

interface HeroProps {
  onStartClick: () => void;
}

export const Hero = ({ onStartClick }: HeroProps) => {
  return (
    <section className="text-center py-20 px-4 relative overflow-hidden">
      {/* Enhanced background with gradients and lighting effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 opacity-60"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-100/30 via-transparent to-blue-100/30"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Logo and Title Section */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src="/lovable-uploads/a38a7187-5f12-41aa-bcc6-ef6ffb768fbf.png" 
            alt="EnglEuphoria Logo" 
            className="w-24 h-24 mb-4"
          />
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent">
            EnglEuphoria
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
            Learn English the Fun Way!
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Experience personalized English learning with interactive games, expert teachers, and real-time feedback. 
              Perfect for kids and beginners through our comprehensive 8-level curriculum!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
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
                Try Games Now
              </Button>
            </div>

            <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-emerald-50 rounded-xl p-6 border border-purple-100">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <span className="font-semibold text-purple-800">8-Level ESL Curriculum!</span>
              </div>
              <p className="text-purple-700">
                From Pre-A1 (Starter) to B2 (Upper-Intermediate): <strong>Drag & Drop Match</strong>, <strong>Spinning Wheel</strong>, 
                and <strong>Dice Rolling</strong> games with smart content generation!
              </p>
            </div>
          </div>

          {/* Right Column - Enhanced Educational Illustration with ForParents style background */}
          <div className="relative">
            {/* Circular shadow effects like ForParents page */}
            <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/30 rounded-full blur-3xl animate-pulse-subtle opacity-90"></div>
            <div className="absolute -z-10 bottom-1/4 right-1/4 w-[90%] h-[90%] bg-teal/25 rounded-full blur-3xl animate-pulse-subtle opacity-85 animation-delay-300"></div>
            <div className="absolute -z-10 top-1/3 right-1/3 w-[80%] h-[80%] bg-orange/20 rounded-full blur-3xl animate-pulse-subtle opacity-75 animation-delay-700"></div>
            
            <img 
              src="/lovable-uploads/27f0b41c-34f2-4a8e-a08b-9a755fe74f97.png" 
              alt="Interactive English Learning" 
              className="w-full h-auto max-h-[500px] object-contain animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
