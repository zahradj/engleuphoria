
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export const TeamSection = () => {
  const teamMembers = [
    {
      name: "Fatima Zahra Djaanine",
      role: "Founder & CEO",
      image: "/lovable-uploads/c22e641a-fede-47a3-8585-e8d1ebdaaf66.png",
      description: "Visionary leader passionate about transforming English education through innovative technology and engaging learning experiences."
    },
    {
      name: "Michael Chen",
      role: "Head of Curriculum",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "PhD in Applied Linguistics, specializing in interactive learning methods."
    },
    {
      name: "Emma Rodriguez",
      role: "Learning Experience Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Expert in gamification and child psychology in education."
    },
    {
      name: "David Kim",
      role: "Technology Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Leading the development of our innovative learning platform."
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 px-4 bg-gradient-to-br from-white via-joyful-bg to-purple-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-3 h-3 bg-joyful-yellow rounded-full animate-float opacity-60"></div>
        <div className="absolute top-32 right-20 w-2 h-2 bg-joyful-orange rounded-full animate-float-delayed opacity-70"></div>
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-joyful-pink rounded-full animate-float opacity-50"></div>
        
        <div className="absolute -z-10 top-1/4 left-1/4 w-[300px] h-[300px] bg-joyful-purple/10 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute -z-10 bottom-1/4 right-1/4 w-[250px] h-[250px] bg-joyful-blue/10 rounded-full blur-3xl animate-pulse-gentle animation-delay-1000"></div>
      </div>

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-fun text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Meet Our 
            <span className="bg-gradient-to-r from-joyful-purple via-joyful-pink to-joyful-orange bg-clip-text text-transparent"> Team 👥</span>
          </h2>
          <p className="font-body text-xl sm:text-2xl text-gray-600">
            Passionate educators and technologists dedicated to your child's success ✨
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
          {teamMembers.map((member, index) => (
            <Card key={index} className="group text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
              <CardContent className="p-8">
                <div className="relative inline-block mb-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover ring-4 ring-joyful-purple/20 group-hover:ring-joyful-pink/30 transition-all duration-300"
                  />
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-joyful-yellow to-joyful-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
                    ✨
                  </div>
                </div>
                <h3 className="font-fun font-bold mb-2 text-xl group-hover:text-joyful-purple transition-colors duration-300">{member.name}</h3>
                <p className="text-joyful-purple font-semibold mb-4 text-lg">{member.role}</p>
                <p className="font-body text-gray-600 text-base leading-relaxed">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
