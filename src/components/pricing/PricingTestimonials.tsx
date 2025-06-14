
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const PricingTestimonials = () => {
  const testimonials = [
    {
      name: "Ahmed Benali",
      location: "Algiers, Algeria",
      text: "The Standard Plan helped me improve my English significantly. The AI assistant is incredibly helpful!",
      rating: 5
    },
    {
      name: "Fatima Zahra",
      location: "Oran, Algeria",
      text: "Excellent value for money. The teachers are professional and the platform is easy to use.",
      rating: 5
    },
    {
      name: "Youssef Mansouri",
      location: "Constantine, Algeria",
      text: "I started with the trial lesson and immediately upgraded to Premium. Worth every dinar!",
      rating: 5
    }
  ];

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-center mb-8">What Our Students Say</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.location}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
