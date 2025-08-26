
import { Card } from "@/components/ui/card";
import { Video, Award, MessageCircle, Users, Star, Trophy } from "lucide-react";
import { useTranslation } from 'react-i18next';

export const Features = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: Video,
      title: t('homepage.features.items.liveClasses.title', { defaultValue: 'Live Interactive Classes' }),
      description: t('homepage.features.items.liveClasses.description', { defaultValue: 'Join live sessions with certified teachers who make learning engaging and fun with games and activities!' }),
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      emoji: "🎥",
      hoverColor: "hover:shadow-purple-300/30"
    },
    {
      icon: Award,
      title: t('homepage.features.items.gamified.title', { defaultValue: 'Gamified Learning' }),
      description: t('homepage.features.items.gamified.description', { defaultValue: 'Earn coins, unlock badges, and level up as you progress through your English journey with exciting rewards!' }),
    },
    {
      icon: MessageCircle,
      title: t('homepage.features.items.speaking.title', { defaultValue: 'Speaking Practice' }),
      description: t('homepage.features.items.speaking.description', { defaultValue: 'Build confidence through conversation practice in a supportive, encouraging environment with real feedback!' }),
      color: "emerald",
      gradient: "from-emerald-500 to-teal-500",
      emoji: "💬",
      hoverColor: "hover:shadow-emerald-300/30"
    },
    {
      icon: Users,
      title: t('homepage.features.items.ageContent.title', { defaultValue: 'Age-Appropriate Content' }),
      description: t('homepage.features.items.ageContent.description', { defaultValue: 'Curriculum designed specifically for different age groups from 4 to 18+ years old with personalized learning paths!' }),
      color: "orange",
      gradient: "from-orange-500 to-yellow-500",
      emoji: "👨‍👩‍👧‍👦",
      hoverColor: "hover:shadow-orange-300/30"
    },
    {
      icon: Star,
      title: t('homepage.features.items.progress.title', { defaultValue: 'Progress Tracking' }),
      description: t('homepage.features.items.progress.description', { defaultValue: 'Monitor learning outcomes with detailed analytics, beautiful charts, and comprehensive progress reports!' }),
      color: "pink",
      gradient: "from-pink-500 to-rose-500",
      emoji: "📊",
      hoverColor: "hover:shadow-pink-300/30"
    },
    {
      icon: Trophy,
      title: t('homepage.features.items.curriculum.title', { defaultValue: '8-Level Curriculum' }),
      description: t('homepage.features.items.curriculum.description', { defaultValue: 'Complete CEFR-aligned curriculum from Pre-A1 Starter to B2 Advanced levels with interactive assessments!' }),
      color: "indigo",
      gradient: "from-indigo-500 to-purple-500",
      emoji: "🎓",
      hoverColor: "hover:shadow-indigo-300/30"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-gradient-to-r from-purple-200/30 to-pink-200/30 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-gradient-to-r from-blue-200/30 to-cyan-200/30 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-3/4 left-1/4 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          {/* Fun heading badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 px-6 py-3 rounded-full border border-yellow-200 shadow-sm mb-6">
            <span className="text-2xl">✨</span>
            <span className="text-orange-700 font-semibold text-lg font-comfortaa">{t('homepage.features.badge', { defaultValue: 'Amazing Features' })}</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-8 font-fredoka">
            {t('homepage.features.heading', { defaultValue: 'Why Choose EnglEuphoria? 🚀' })}
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto font-inter leading-relaxed">
            {t('homepage.features.subheading', { defaultValue: 'Our comprehensive approach combines the best of traditional teaching with modern technology to create an immersive English learning experience that kids absolutely love! 🎯' })}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={`group p-8 hover:shadow-2xl ${feature.hoverColor} transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 border-0 bg-gradient-to-br from-white to-gray-50/80 backdrop-blur-sm rounded-3xl`}
            >
              <div className="text-center space-y-6">
                {/* Enhanced icon with emoji */}
                <div className="relative mx-auto w-20 h-20">
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} shadow-xl group-hover:shadow-2xl transition-all duration-300 animate-pulse`}></div>
                  <div className="relative w-full h-full rounded-3xl bg-gradient-to-r from-white/90 to-white/50 backdrop-blur-sm flex items-center justify-center">
                    <feature.icon className="h-10 w-10 text-gray-800 relative z-10" />
                  </div>
                  {/* Floating emoji */}
                  <div className="absolute -top-2 -right-2 text-2xl animate-bounce" style={{animationDuration: `${3 + index}s`}}>
                    {feature.emoji}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 font-fredoka group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed font-inter text-lg group-hover:text-gray-700 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Fun interactive element */}
                <div className="flex justify-center">
                  <div className={`w-16 h-1 rounded-full bg-gradient-to-r ${feature.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom call-to-action section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100 rounded-3xl p-8 border-2 border-purple-200 shadow-xl backdrop-blur-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 font-fredoka">
              {t('homepage.features.cta.heading', { defaultValue: "Ready to Start Your Child's English Adventure? 🌟" })}
            </h3>
          <p className="text-lg text-gray-600 mb-6 font-inter">
            {t('homepage.features.cta.subheading', { defaultValue: 'Join thousands of happy families who have discovered the joy of learning English with EnglEuphoria!' })}
          </p>
            <div className="flex flex-wrap gap-4 justify-center">
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="text-gray-700 font-medium">{t('homepage.features.cta.points.games', { defaultValue: '🎮 Interactive Games' })}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
            <span className="text-gray-700 font-medium">{t('homepage.features.cta.points.teachers', { defaultValue: '👨‍🏫 Expert Teachers' })}</span>
          </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
