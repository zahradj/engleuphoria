
import { Card } from "@/components/ui/card";
import { Video, Award, MessageCircle, Users, Star, Trophy } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: Video,
      title: "Live Interactive Classes",
      description: "Join live sessions with certified teachers who make learning engaging and fun.",
      color: "purple",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Award,
      title: "Gamified Learning",
      description: "Earn points, unlock badges, and level up as you progress through your English journey.",
      color: "blue",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: MessageCircle,
      title: "Speaking Practice",
      description: "Build confidence through conversation practice in a supportive, encouraging environment.",
      color: "emerald",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Users,
      title: "Age-Appropriate Content",
      description: "Curriculum designed specifically for different age groups from 4 to 18+ years old.",
      color: "orange",
      gradient: "from-orange-500 to-orange-600"
    },
    {
      icon: Star,
      title: "Progress Tracking",
      description: "Monitor learning outcomes with detailed analytics and comprehensive progress reports.",
      color: "pink",
      gradient: "from-pink-500 to-pink-600"
    },
    {
      icon: Trophy,
      title: "8-Level Curriculum",
      description: "Complete CEFR-aligned curriculum from Pre-A1 Starter to B2 Advanced levels.",
      color: "indigo",
      gradient: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Why Choose EnglEuphoria?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive approach combines the best of traditional teaching with modern technology 
            to create an immersive English learning experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50"
            >
              <div className="text-center space-y-4">
                <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
