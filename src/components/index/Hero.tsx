
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

interface HeroProps {
  onStartClick: () => void;
}

export const Hero = ({ onStartClick }: HeroProps) => {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 min-h-[90vh]">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -z-10 top-1/4 left-1/4 w-[300px] h-[300px] bg-purple/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute -z-10 bottom-1/4 right-1/4 w-[250px] h-[250px] bg-blue/20 rounded-full blur-3xl animate-pulse opacity-60 animation-delay-1000"></div>
        <div className="absolute -z-10 top-1/3 right-1/3 w-[200px] h-[200px] bg-emerald/20 rounded-full blur-3xl animate-pulse opacity-60 animation-delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10 h-full">
        <div className="grid lg:grid-cols-5 gap-12 items-center h-full">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  EnglEuphoria
                </span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
                Learn English the Fun Way!
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                Experience personalized English learning with interactive games, expert teachers, and real-time feedback. 
                Perfect for kids and beginners through our comprehensive 8-level curriculum!
              </p>
            </div>
            
            {/* Call to Action Button */}
            <div className="flex justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={onStartClick}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Learning Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Key Feature Highlight */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-lg">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-gray-800 text-lg">8-Level ESL Curriculum</span>
              </div>
              <p className="text-gray-700">
                From Pre-A1 (Starter) to B2 (Upper-Intermediate) with <strong>Drag & Drop</strong>, 
                <strong> Spinning Wheel</strong>, and <strong>Dice Rolling</strong> games!
              </p>
            </div>
          </div>

          {/* Right Column - Enhanced Large Image */}
          <div className="lg:col-span-3 relative flex justify-center lg:justify-end">
            {/* Background effects */}
            <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/30 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
            <div className="absolute -z-10 bottom-1/4 right-1/4 w-[90%] h-[90%] bg-blue/25 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-300"></div>
            <div className="absolute -z-10 top-1/3 right-1/3 w-[80%] h-[80%] bg-emerald/20 rounded-full blur-3xl animate-pulse-subtle opacity-50 animation-delay-700"></div>
            
            <div className="relative transform hover:scale-105 transition-transform duration-500 w-full">
              <img 
                src="/lovable-uploads/27f0b41c-34f2-4a8e-a08b-9a755fe74f97.png" 
                alt="Interactive English Learning" 
                className="w-full max-w-none h-auto object-contain drop-shadow-2xl scale-110"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
