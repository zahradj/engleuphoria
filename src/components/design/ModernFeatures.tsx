
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Users, 
  Video, 
  PenTool, 
  Trophy, 
  Clock, 
  Globe, 
  Shield,
  Smartphone,
  BookOpen,
  MessageCircle,
  BarChart
} from "lucide-react";

export const ModernFeatures = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: "AI-Powered Learning Assistant",
      description: "Get personalized lesson plans, instant worksheet generation, and adaptive learning paths powered by advanced AI.",
      gradient: "from-purple-500 to-pink-500",
      benefits: ["Auto-generated content", "Personalized curriculum", "Smart progress tracking"]
    },
    {
      icon: Video,
      title: "Live Interactive Classrooms",
      description: "Experience face-to-face learning with HD video, interactive whiteboard, and real-time collaboration tools.",
      gradient: "from-blue-500 to-cyan-500",
      benefits: ["HD video calls", "Interactive whiteboard", "Screen sharing"]
    },
    {
      icon: Users,
      title: "Expert Native Teachers",
      description: "Learn from certified English teachers with years of experience teaching Arabic-speaking students.",
      gradient: "from-green-500 to-emerald-500",
      benefits: ["Certified teachers", "Cultural understanding", "Flexible scheduling"]
    }
  ];

  const additionalFeatures = [
    { icon: PenTool, title: "Interactive Whiteboard", description: "Draw, write, and collaborate in real-time" },
    { icon: Trophy, title: "Gamified Learning", description: "Earn points, badges, and unlock achievements" },
    { icon: Clock, title: "Flexible Scheduling", description: "Book classes that fit your schedule" },
    { icon: Globe, title: "Multi-Language Support", description: "Interface available in Arabic, English, French" },
    { icon: Shield, title: "Safe Learning Environment", description: "Secure platform with parental controls" },
    { icon: Smartphone, title: "Mobile Friendly", description: "Learn on any device, anywhere" },
    { icon: BookOpen, title: "Rich Content Library", description: "Access thousands of lessons and materials" },
    { icon: MessageCircle, title: "24/7 Support", description: "Get help whenever you need it" },
    { icon: BarChart, title: "Progress Analytics", description: "Track learning progress with detailed reports" }
  ];

  return (
    <div className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
            ✨ Powerful Features
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Excel in English</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform combines cutting-edge technology with proven teaching methods 
            to deliver the most effective English learning experience.
          </p>
        </div>

        {/* Main Features */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {mainFeatures.map((feature, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <CardHeader className="relative">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">{feature.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="relative">
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient}`}></div>
                      <span className="text-sm font-medium text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additionalFeatures.map((feature, index) => (
            <Card key={index} className="p-6 border border-gray-200 hover:border-purple-200 hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
