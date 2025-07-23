
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "California, USA",
      testimonial: "My 8-year-old Emma went from being shy about speaking English to confidently chatting with her teacher. The games and interactive lessons make learning so enjoyable!",
      rating: 5,
      childAge: "8 years old"
    },
    {
      name: "Ahmed Al-Hassan",
      location: "Dubai, UAE",
      testimonial: "The progress reports help me understand exactly how my son is developing. The teachers are patient and professional.",
      rating: 5,
      childAge: "10 years old"
    },
    {
      name: "Maria Rodriguez",
      location: "Madrid, Spain",
      testimonial: "EnglEuphoria has made English learning fun for my daughter. She looks forward to every class!",
      rating: 5,
      childAge: "6 years old"
    }
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-joyful-bg via-white to-purple-50 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-3 h-3 bg-joyful-yellow rounded-full animate-float opacity-60"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-joyful-orange rounded-full animate-float-delayed opacity-70"></div>
        <div className="absolute top-1/2 right-20 w-4 h-4 bg-joyful-pink rounded-full animate-float opacity-50"></div>
        
        <div className="absolute -z-10 top-1/4 right-1/4 w-[300px] h-[300px] bg-joyful-purple/10 rounded-full blur-3xl animate-pulse-gentle"></div>
        <div className="absolute -z-10 bottom-1/4 left-1/4 w-[250px] h-[250px] bg-joyful-blue/10 rounded-full blur-3xl animate-pulse-gentle animation-delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="font-fun text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6 sm:mb-8 px-2">
            What Parents Are 
            <span className="bg-gradient-to-r from-joyful-purple via-joyful-pink to-joyful-orange bg-clip-text text-transparent"> Saying 💬</span>
          </h2>
          <p className="font-body text-xl sm:text-2xl text-gray-600 px-4">
            Real stories from real families who have transformed their children's English skills. ✨
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden relative">
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-joyful-yellow/20 to-transparent rounded-bl-3xl"></div>
              
              <CardHeader className="pb-4 pt-8">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-joyful-yellow text-joyful-yellow group-hover:scale-110 transition-transform duration-300" style={{animationDelay: `${i * 100}ms`}} />
                  ))}
                </div>
                <CardTitle className="font-fun text-lg sm:text-xl group-hover:text-joyful-purple transition-colors duration-300">{testimonial.name}</CardTitle>
                <CardDescription className="font-body text-base text-gray-500">
                  📍 {testimonial.location} • 👶 {testimonial.childAge}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <p className="font-body text-gray-600 italic text-base sm:text-lg leading-relaxed">"{testimonial.testimonial}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
