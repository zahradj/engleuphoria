import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

interface CallToActionProps {
  onStartClick: () => void;
}

export const CallToAction = ({ onStartClick }: CallToActionProps) => {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 via-pink-500 to-orange-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-yellow-300/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-pink-300/20 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* Floating emojis */}
        <div className="absolute top-16 left-16 text-4xl animate-bounce opacity-80" style={{animationDuration: '3s'}}>🎉</div>
        <div className="absolute top-32 right-20 text-3xl animate-bounce opacity-80" style={{animationDuration: '4s', animationDelay: '1s'}}>✨</div>
        <div className="absolute bottom-20 left-32 text-4xl animate-bounce opacity-80" style={{animationDuration: '5s', animationDelay: '2s'}}>🚀</div>
        <div className="absolute bottom-32 right-16 text-3xl animate-bounce opacity-80" style={{animationDuration: '3.5s', animationDelay: '3s'}}>🌟</div>
        <div className="absolute top-64 left-64 text-2xl animate-bounce opacity-80" style={{animationDuration: '4.5s', animationDelay: '1.5s'}}>🎯</div>
        <div className="absolute bottom-64 right-64 text-3xl animate-bounce opacity-80" style={{animationDuration: '6s', animationDelay: '2.5s'}}>🎮</div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full border border-white/30 shadow-lg mb-8">
            <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
            <span className="text-white font-semibold text-lg font-comfortaa">Start Your Journey Today!</span>
          </div>

          {/* Main heading */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 font-fredoka leading-tight">
            Ready to Make English 
            <span className="block text-transparent bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text animate-pulse">
              Super Fun? 🎊
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed font-inter">
            Join <span className="font-bold text-yellow-300">10,000+ happy students</span> who are already on their English adventure! 
            Start with a <span className="font-bold text-pink-300">FREE trial lesson</span> and discover why kids love learning with us! 🌈
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button
              size="lg"
              onClick={onStartClick}
              className="relative bg-white text-purple-600 hover:bg-yellow-100 px-8 py-6 text-xl shadow-2xl hover:shadow-white/30 transition-all duration-300 transform hover:scale-105 rounded-2xl font-comfortaa font-bold border-4 border-white/20"
            >
              <span className="flex items-center gap-3">
                🎮 Start FREE Trial
                <ArrowRight className="h-6 w-6 animate-bounce" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-pink-400/20 rounded-2xl animate-pulse"></div>
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-3 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-6 text-xl shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl font-comfortaa font-bold"
            >
              <span className="flex items-center gap-3">
                📞 Talk to Expert
              </span>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-3">⭐⭐⭐⭐⭐</div>
              <div className="text-white font-bold text-lg font-fredoka">4.9/5 Rating</div>
              <div className="text-white/80 font-inter">From happy parents</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-3">🏆</div>
              <div className="text-white font-bold text-lg font-fredoka">Award Winning</div>
              <div className="text-white/80 font-inter">Recognized excellence</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-3xl mb-3">🔒</div>
              <div className="text-white font-bold text-lg font-fredoka">100% Safe</div>
              <div className="text-white/80 font-inter">Secure platform</div>
            </div>
          </div>

          {/* Fun guarantee */}
          <div className="mt-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl p-6 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <h3 className="text-2xl font-bold text-white mb-2 font-fredoka">🎉 Fun Guarantee!</h3>
            <p className="text-white font-inter">
              If your child doesn't have fun in their first lesson, we'll give you a full refund - no questions asked! 💯
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};