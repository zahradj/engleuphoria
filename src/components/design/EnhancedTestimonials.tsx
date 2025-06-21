
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote } from "lucide-react";

export const EnhancedTestimonials = () => {
  const testimonials = [
    {
      name: "Amira Hassan",
      role: "University Student",
      location: "Algiers, Algeria",
      image: "/avatars/fox.svg",
      rating: 5,
      quote: "The AI assistant helped me improve my grammar so much! My IELTS score went from 6.0 to 8.5 in just 3 months.",
      achievement: "IELTS 8.5 Achievement"
    },
    {
      name: "Youssef Benali",
      role: "Business Professional",
      location: "Oran, Algeria",
      image: "/avatars/lion.svg",
      rating: 5,
      quote: "The 1-on-1 classes with native speakers gave me the confidence to present in English at international conferences.",
      achievement: "Career Advancement"
    },
    {
      name: "Salma Zerrouki",
      role: "High School Student",
      location: "Constantine, Algeria",
      image: "/avatars/unicorn.svg",
      rating: 5,
      quote: "I love the interactive games and rewards system! Learning English feels like playing my favorite video game.",
      achievement: "Top Student Award"
    },
    {
      name: "Ahmed Boumediene",
      role: "Engineer",
      location: "Annaba, Algeria",
      image: "/avatars/bear.svg",
      rating: 5,
      quote: "The flexible scheduling allowed me to fit English lessons around my work. The mobile app is fantastic!",
      achievement: "Completed 100+ Lessons"
    },
    {
      name: "Leila Mansouri",
      role: "Mother of 2",
      location: "Tlemcen, Algeria",
      image: "/avatars/rabbit.svg",
      rating: 5,
      quote: "Both my children love their English classes. The teachers are patient and the progress tracking helps me stay involved.",
      achievement: "Family Learning Success"
    },
    {
      name: "Omar Khelifi",
      role: "Medical Student",
      location: "Batna, Algeria",
      image: "/avatars/penguin.svg",
      rating: 5,
      quote: "The medical English vocabulary lessons were exactly what I needed for my international medical exams.",
      achievement: "Medical English Certified"
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200 px-4 py-2">
            ⭐ Student Success Stories
          </Badge>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Join Thousands of
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent"> Successful </span>
            Students
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real students, real results. See how our platform has transformed English learning 
            for students across Algeria and beyond.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 group bg-white/80 backdrop-blur-sm">
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="h-12 w-12 text-purple-600" />
              </div>
              
              <CardContent className="p-6">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </blockquote>

                {/* Achievement Badge */}
                <Badge className="mb-4 bg-green-100 text-green-700 border-green-200 text-xs">
                  🏆 {testimonial.achievement}
                </Badge>

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-blue-400 p-0.5">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.name}
                      className="w-full h-full rounded-full bg-white p-1"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">10,000+</div>
            <div className="text-gray-600 font-medium">Happy Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600 font-medium">Satisfaction Rate</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">4.9/5</div>
            <div className="text-gray-600 font-medium">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">50,000+</div>
            <div className="text-gray-600 font-medium">Lessons Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
};
