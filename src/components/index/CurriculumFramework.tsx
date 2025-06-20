
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, Star, GraduationCap } from "lucide-react";

export const CurriculumFramework = () => {
  const levels = [
    {
      id: "pre-a1",
      name: "Pre-A1",
      title: "Starter",
      ageGroup: "4-7 years",
      description: "Songs, games, and basic vocabulary for young learners",
      color: "bg-pink-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-700",
      hours: "30-50h"
    },
    {
      id: "a1",
      name: "A1",
      title: "Beginner", 
      ageGroup: "6-11 years",
      description: "Fundamental structures and everyday expressions",
      color: "bg-green-500",
      bgColor: "bg-green-50",
      textColor: "text-green-700",
      hours: "80-120h"
    },
    {
      id: "a1-plus",
      name: "A1+",
      title: "Elementary",
      ageGroup: "8-12 years",
      description: "Expanded vocabulary and simple past tense",
      color: "bg-blue-500",
      bgColor: "bg-blue-50", 
      textColor: "text-blue-700",
      hours: "100-140h"
    },
    {
      id: "a2",
      name: "A2",
      title: "Pre-Intermediate",
      ageGroup: "10-14 years",
      description: "Communication skills for familiar situations",
      color: "bg-purple-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      hours: "120-160h"
    },
    {
      id: "a2-plus", 
      name: "A2+",
      title: "Intermediate",
      ageGroup: "12-16 years",
      description: "Express opinions and handle complex conversations",
      color: "bg-orange-500",
      bgColor: "bg-orange-50",
      textColor: "text-orange-700",
      hours: "140-180h"
    },
    {
      id: "b1",
      name: "B1",
      title: "Upper-Intermediate",
      ageGroup: "14-17 years", 
      description: "Navigate real-life situations confidently",
      color: "bg-indigo-500",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-700",
      hours: "160-220h"
    }
  ];

  const stats = [
    { icon: GraduationCap, label: "CEFR Levels", value: "6", color: "text-blue-600" },
    { icon: Users, label: "Age Groups", value: "4-17", color: "text-green-600" },
    { icon: Clock, label: "Total Hours", value: "800+", color: "text-orange-600" },
    { icon: Star, label: "Success Rate", value: "95%", color: "text-purple-600" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-sm font-medium">
            📚 CEFR Aligned Curriculum
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Structured Learning Path
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive curriculum follows international standards, designed for optimal 
            learning progression from absolute beginner to advanced proficiency.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 border-0 shadow-lg">
              <stat.icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
              <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {levels.map((level, index) => (
            <Card key={level.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden">
              <CardHeader className={`${level.bgColor} pb-4`}>
                <div className="flex items-center justify-between mb-2">
                  <div className={`${level.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                    {level.name}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Level {index + 1}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-gray-900">
                  {level.title}
                </CardTitle>
                <div className={`text-sm font-medium ${level.textColor}`}>
                  {level.ageGroup}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {level.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{level.hours}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6 text-lg">
            Each level includes interactive games, live classes, and progress tracking
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300">
            <BookOpen className="mr-2 h-5 w-5" />
            Explore Curriculum
          </Button>
        </div>
      </div>
    </section>
  );
};
