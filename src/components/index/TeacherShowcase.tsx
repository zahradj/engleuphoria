
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Award, Globe, Clock } from "lucide-react";

export const TeacherShowcase = () => {
  const teachers = [
    {
      name: "Sarah Johnson",
      image: "/avatars/fox.svg",
      credentials: "CELTA Certified",
      experience: "8 years",
      specialty: "Young Learners",
      rating: 4.9,
      lessons: 2500,
      description: "Specializes in making grammar fun through interactive games and storytelling."
    },
    {
      name: "Michael Chen", 
      image: "/avatars/lion.svg",
      credentials: "TESOL Certified",
      experience: "6 years",
      specialty: "Conversation",
      rating: 4.8,
      lessons: 1800,
      description: "Expert in building confidence through engaging conversation practice."
    },
    {
      name: "Emma Williams",
      image: "/avatars/unicorn.svg", 
      credentials: "CELTA & DELTA",
      experience: "10 years",
      specialty: "Pronunciation",
      rating: 5.0,
      lessons: 3200,
      description: "Helps students master clear pronunciation using phonics and visual methods."
    }
  ];

  const trustSignals = [
    { icon: Award, text: "CELTA & TESOL Certified Teachers", color: "text-blue-600" },
    { icon: Globe, text: "Native English Speakers", color: "text-green-600" },
    { icon: Clock, text: "10,000+ Hours of Teaching Experience", color: "text-purple-600" },
    { icon: Star, text: "4.9/5 Average Teacher Rating", color: "text-yellow-600" }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
            👩‍🏫 Expert Teachers
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Learn from
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Certified Native Speakers</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our experienced teachers are specially trained to work with Arabic-speaking children and make English learning enjoyable
          </p>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {trustSignals.map((signal, index) => (
            <Card key={index} className="p-4 text-center border-2 hover:border-blue-200 transition-colors">
              <signal.icon className={`h-8 w-8 mx-auto mb-2 ${signal.color}`} />
              <p className="text-sm font-medium text-gray-900">{signal.text}</p>
            </Card>
          ))}
        </div>

        {/* Teacher Profiles */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {teachers.map((teacher, index) => (
            <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="relative">
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                  <img 
                    src={teacher.image} 
                    alt={teacher.name}
                    className="w-24 h-24 rounded-full bg-white p-2"
                  />
                </div>
                <Badge className="absolute top-3 right-3 bg-white/90 text-gray-900">
                  {teacher.credentials}
                </Badge>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{teacher.name}</h3>
                
                <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {teacher.experience}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {teacher.specialty}
                  </span>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{teacher.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">{teacher.lessons.toLocaleString()} lessons taught</span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{teacher.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Additional Trust Elements */}
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-100">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Parents Trust Our Teachers</h3>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-700">Background Checked</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">5+</div>
                <div className="text-gray-700">Years Average Experience</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-gray-700">Parent Satisfaction</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
