
import React from "react";
import { Target, BookOpen, Lightbulb, Star } from "lucide-react";

export const MissionSection = () => {
  return (
    <section className="py-16 px-4 bg-white relative overflow-hidden">
      {/* Background effects similar to homepage */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -z-10 top-1/4 left-1/4 w-[300px] h-[300px] bg-purple/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
        <div className="absolute -z-10 bottom-1/4 right-1/4 w-[250px] h-[250px] bg-blue/20 rounded-full blur-3xl animate-pulse opacity-60 animation-delay-1000"></div>
        <div className="absolute -z-10 top-1/3 right-1/3 w-[200px] h-[200px] bg-emerald/20 rounded-full blur-3xl animate-pulse opacity-60 animation-delay-500"></div>
      </div>
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 text-purple-600 mr-3" />
              <h2 className="text-3xl font-bold">Our Mission</h2>
            </div>
            <p className="text-lg text-gray-600 mb-6">
              We believe that learning English should be an adventure, not a chore. Our platform 
              combines cutting-edge technology with proven educational methods to create an 
              immersive, interactive experience that keeps children engaged and motivated.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <BookOpen className="h-6 w-6 text-blue-500 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Comprehensive Curriculum</h3>
                  <p className="text-gray-600">Age-appropriate lessons designed by education experts</p>
                </div>
              </div>
              <div className="flex items-start">
                <Lightbulb className="h-6 w-6 text-yellow-500 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Interactive Learning</h3>
                  <p className="text-gray-600">Games, stories, and activities that make learning fun</p>
                </div>
              </div>
              <div className="flex items-start">
                <Star className="h-6 w-6 text-green-500 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Personalized Progress</h3>
                  <p className="text-gray-600">Adaptive learning paths tailored to each child's needs</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            {/* Background effects for the image */}
            <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/30 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
            <div className="absolute -z-10 bottom-1/4 right-1/4 w-[90%] h-[90%] bg-blue/25 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-300"></div>
            <div className="absolute -z-10 top-1/3 right-1/3 w-[80%] h-[80%] bg-emerald/20 rounded-full blur-3xl animate-pulse-subtle opacity-50 animation-delay-700"></div>
            
            <div className="relative transform hover:scale-105 transition-transform duration-500">
              <img 
                src="/lovable-uploads/1be86621-46cd-4f3c-91da-26cae7b49cb3.png" 
                alt="3D educational illustration with books, graduation cap, globe, and learning elements"
                className="w-full max-w-lg h-auto object-contain drop-shadow-2xl scale-110"
              />
              <div className="absolute -bottom-6 -left-6 bg-purple-600 text-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold">5+</div>
                <div className="text-sm">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
