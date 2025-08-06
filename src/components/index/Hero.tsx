
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";

interface HeroProps {
  onStartClick: () => void;
}

export const Hero = ({ onStartClick }: HeroProps) => {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-violet-50 via-sky-50 via-emerald-50 to-yellow-50 min-h-[90vh]">
      {/* Enhanced Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating bubbles */}
        <div className="absolute -z-10 top-1/4 left-1/4 w-[300px] h-[300px] bg-gradient-to-r from-purple-300/30 to-pink-300/30 rounded-full blur-3xl animate-bounce opacity-60" style={{animationDuration: '4s'}}></div>
        <div className="absolute -z-10 bottom-1/4 right-1/4 w-[250px] h-[250px] bg-gradient-to-r from-blue-300/30 to-cyan-300/30 rounded-full blur-3xl animate-bounce opacity-60" style={{animationDuration: '6s', animationDelay: '1s'}}></div>
        <div className="absolute -z-10 top-1/3 right-1/3 w-[200px] h-[200px] bg-gradient-to-r from-emerald-300/30 to-lime-300/30 rounded-full blur-3xl animate-bounce opacity-60" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
        <div className="absolute -z-10 bottom-1/2 left-1/2 w-[180px] h-[180px] bg-gradient-to-r from-yellow-300/30 to-orange-300/30 rounded-full blur-3xl animate-bounce opacity-60" style={{animationDuration: '7s', animationDelay: '3s'}}></div>
        
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10 h-full">
        <div className="grid lg:grid-cols-5 gap-12 items-center h-full">
          {/* Left Column - Enhanced Content */}
          <div className="lg:col-span-2 space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              {/* Fun badge */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 px-4 py-2 rounded-full border border-pink-200 shadow-sm">
                <span className="text-lg">🎉</span>
                <span className="text-purple-700 font-medium text-sm">Learning Made Fun!</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight font-fredoka">
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent animate-pulse">
                  EnglEuphoria
                </span>
              </h1>
              <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 font-comfortaa">
                Learn English the 
                <span className="text-transparent bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text"> Fun </span>
                Way! 🚀
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl font-inter">
                Experience <span className="font-semibold text-purple-600">personalized English learning</span> with interactive games, 
                expert teachers, and real-time feedback. Perfect for kids and beginners through our 
                <span className="font-semibold text-blue-600"> comprehensive 8-level curriculum!</span> 🎯
              </p>
            </div>
            
            {/* Enhanced Call to Action Button */}
            <div className="flex justify-center lg:justify-start">
              <Button 
                size="lg" 
                onClick={onStartClick}
                className="relative bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white px-8 py-6 text-lg shadow-2xl hover:shadow-purple-300/50 transition-all duration-300 transform hover:scale-105 rounded-2xl font-comfortaa font-semibold"
              >
                <span className="flex items-center gap-2">
                  🎮 Start Your Adventure
                  <ArrowRight className="ml-2 h-5 w-5 animate-bounce" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-2xl animate-pulse"></div>
              </Button>
            </div>

            {/* Enhanced Key Feature Highlight */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-2xl shadow-lg animate-bounce">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-gray-800 text-xl font-fredoka">8-Level ESL Curriculum 🎓</span>
              </div>
              <p className="text-gray-700 font-inter">
                From <span className="font-semibold text-green-600">Pre-A1 (Starter)</span> to <span className="font-semibold text-blue-600">B2 (Upper-Intermediate)</span> with 
                <span className="font-semibold text-purple-600"> Drag & Drop</span>, 
                <span className="font-semibold text-pink-600"> Spinning Wheel</span>, and 
                <span className="font-semibold text-emerald-600"> Dice Rolling</span> games! 🎲✨
              </p>
            </div>

            {/* Fun stats */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full border border-green-200">
                <span className="text-green-700 font-semibold text-sm">👥 10,000+ Students</span>
              </div>
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full border border-blue-200">
                <span className="text-blue-700 font-semibold text-sm">⭐ 4.9/5 Rating</span>
              </div>
              <div className="bg-gradient-to-r from-orange-100 to-yellow-100 px-4 py-2 rounded-full border border-orange-200">
                <span className="text-orange-700 font-semibold text-sm">🏆 Award Winning</span>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced Large Image */}
          <div className="lg:col-span-3 relative flex justify-center lg:justify-end">
            {/* Enhanced colorful background shadow effects */}
            <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/30 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
            <div className="absolute -z-10 bottom-1/4 right-1/4 w-[90%] h-[90%] bg-teal/25 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-300"></div>
            <div className="absolute -z-10 top-1/3 right-1/3 w-[80%] h-[80%] bg-orange/20 rounded-full blur-3xl animate-pulse-subtle opacity-50 animation-delay-700"></div>
            <div className="absolute -z-10 bottom-1/3 left-1/3 w-[70%] h-[70%] bg-yellow/25 rounded-full blur-2xl animate-pulse-subtle opacity-65 animation-delay-500"></div>
            <div className="absolute -z-10 top-[15%] right-[15%] w-[60%] h-[60%] bg-purple-light/30 rounded-full blur-2xl animate-pulse-subtle opacity-55 animation-delay-900"></div>
            <div className="absolute -z-10 bottom-[20%] left-[20%] w-[85%] h-[85%] bg-teal-light/20 rounded-full blur-3xl animate-pulse-subtle opacity-45 animation-delay-1100"></div>
            <div className="absolute -z-10 top-[50%] left-[10%] w-[65%] h-[65%] bg-orange-light/25 rounded-full blur-2xl animate-pulse-subtle opacity-60 animation-delay-1300"></div>
            
            <div className="relative transform hover:scale-105 transition-transform duration-500 w-full">
              <img 
                src="/lovable-uploads/27f0b41c-34f2-4a8e-a08b-9a755fe74f97.png" 
                alt="Interactive English Learning" 
                className="relative w-full max-w-none h-auto object-contain drop-shadow-2xl scale-110 rounded-2xl"
              />
              {/* Floating emojis around the image */}
              <div className="absolute top-0 left-0 text-4xl animate-bounce" style={{animationDuration: '3s'}}>🎨</div>
              <div className="absolute top-16 right-8 text-3xl animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>📚</div>
              <div className="absolute bottom-12 left-8 text-3xl animate-bounce" style={{animationDuration: '3.5s', animationDelay: '2s'}}>🎯</div>
              <div className="absolute bottom-0 right-0 text-4xl animate-bounce" style={{animationDuration: '5s', animationDelay: '1.5s'}}>🌈</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
