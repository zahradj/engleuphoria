
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            What Parents Are Saying
          </h2>
          <p className="text-xl text-gray-600">
            Real stories from real families who have transformed their children's English skills.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                <CardDescription>
                  {testimonial.location} • {testimonial.childAge}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
