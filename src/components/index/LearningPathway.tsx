
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Trophy, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const LearningPathway = () => {
  const { languageText } = useLanguage();

  const levels = [
    {
      level: "A1 - Beginner",
      duration: "3 months",
      lessons: "48 lessons",
      topics: ["Greetings & Introductions", "Family & Friends", "Colors & Numbers", "Basic Conversations"],
      color: "from-green-400 to-emerald-500"
    },
    {
      level: "A2 - Elementary", 
      duration: "3 months",
      lessons: "48 lessons",
      topics: ["Daily Routines", "Shopping & Food", "Past & Future", "Travel & Directions"],
      color: "from-blue-400 to-cyan-500"
    },
    {
      level: "B1 - Intermediate",
      duration: "4 months", 
      lessons: "64 lessons",
      topics: ["Work & Career", "Health & Lifestyle", "Environment", "Technology"],
      color: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2">
            🎯 Learning Path
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Your Child's English Journey
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Clear progression from beginner to confident English speaker with our structured curriculum
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {levels.map((level, index) => (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${level.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              
              <div className="relative p-6">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{level.level}</h3>
                
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{level.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4" />
                    <span>{level.lessons}</span>
                  </div>
                </div>
                
                <div className="space-y-2 mb-6">
                  {level.topics.map((topic, topicIndex) => (
                    <div key={topicIndex} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Complete Journey: Beginner to Intermediate in 10 Months
          </h3>
          <p className="text-gray-600 mb-6">
            4 lessons per week • Live teachers • Interactive activities • Progress tracking
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl">
            Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};
