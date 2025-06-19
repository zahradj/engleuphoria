
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

          {/* Right Column - Enhanced Educational Illustration */}
          <div className="relative">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-blue-400/20 to-emerald-400/20 rounded-3xl blur-xl transform scale-110"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-300/10 via-pink-300/10 to-purple-300/10 rounded-3xl blur-2xl transform scale-105 animate-pulse-subtle"></div>
            
            {/* Multiple shadow layers for depth */}
            <div className="absolute inset-0 bg-black/10 rounded-3xl blur-lg transform translate-x-2 translate-y-2"></div>
            <div className="absolute inset-0 bg-black/5 rounded-3xl blur-md transform translate-x-1 translate-y-1"></div>
            
            {/* Colored light spots */}
            <div className="absolute top-4 left-4 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-sm opacity-60 animate-bounce-light"></div>
            <div className="absolute top-1/3 right-6 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-sm opacity-60 animate-float"></div>
            <div className="absolute bottom-8 left-8 w-5 h-5 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-sm opacity-60 animate-pulse-subtle"></div>
            <div className="absolute bottom-1/3 right-12 w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-400 rounded-full blur-sm opacity-60 animate-bounce-light"></div>
            
            {/* Main image with enhanced styling */}
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-300">
              <img 
                src="/lovable-uploads/27f0b41c-34f2-4a8e-a08b-9a755fe74f97.png" 
                alt="Interactive English Learning" 
                className="w-full max-w-2xl mx-auto drop-shadow-2xl filter brightness-110 contrast-105 saturate-110"
                style={{
                  filter: 'drop-shadow(0 25px 50px rgba(0, 0, 0, 0.15)) drop-shadow(0 15px 30px rgba(139, 92, 246, 0.1)) drop-shadow(0 8px 16px rgba(59, 130, 246, 0.1))'
                }}
              />
            </div>
            
            {/* Floating elements around the image */}
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-float opacity-80"></div>
            <div className="absolute top-8 -right-4 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full animate-bounce-light opacity-80"></div>
            <div className="absolute -bottom-4 left-12 w-5 h-5 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full animate-pulse-subtle opacity-80"></div>
            <div className="absolute bottom-12 -right-2 w-4 h-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full animate-float opacity-80"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
