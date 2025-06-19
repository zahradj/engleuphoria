
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Clock, Star } from "lucide-react";

export const CurriculumFramework = () => {
  const levels = [
    {
      id: "pre-a1",
      name: "Pre-A1 Starter",
      ageGroup: "4-7 years",
      description: "Young learners begin their English journey with songs, games, and basic vocabulary",
      color: "bg-pink-100 text-pink-800 border-pink-200",
      hours: "30-50 hours",
      skills: ["Basic vocabulary", "Simple phrases", "Songs & rhymes"]
    },
    {
      id: "a1",
      name: "A1 Beginner",
      ageGroup: "6-11 years",
      description: "Elementary students learn fundamental English structures and everyday expressions",
      color: "bg-green-100 text-green-800 border-green-200",
      hours: "80-120 hours",
      skills: ["Present tense", "Basic conversations", "Family & friends"]
    },
    {
      id: "a1-plus",
      name: "A1+ Elementary",
      ageGroup: "8-12 years",
      description: "Building confidence with expanded vocabulary and simple past tense",
      color: "bg-green-100 text-green-800 border-green-200",
      hours: "100-140 hours",
      skills: ["Past tense", "Describing activities", "School subjects"]
    },
    {
      id: "a2",
      name: "A2 Pre-Intermediate",
      ageGroup: "10-14 years",
      description: "Pre-teens develop communication skills for familiar topics and situations",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      hours: "120-160 hours",
      skills: ["Future tense", "Comparisons", "Travel & hobbies"]
    },
    {
      id: "a2-plus",
      name: "A2+ Intermediate",
      ageGroup: "12-16 years",
      description: "Teenagers express opinions and handle more complex conversations",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      hours: "140-180 hours",
      skills: ["Modal verbs", "Expressing opinions", "Technology & media"]
    },
    {
      id: "b1",
      name: "B1 Intermediate",
      ageGroup: "14-17 years",
      description: "Students navigate real-life situations and express ideas clearly",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      hours: "160-220 hours",
      skills: ["Conditional sentences", "Abstract topics", "Work & career"]
    },
    {
      id: "b1-plus",
      name: "B1+ Upper-Intermediate",
      ageGroup: "15-18 years",
      description: "Advanced teens handle complex texts and spontaneous conversations",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      hours: "180-240 hours",
      skills: ["Complex grammar", "Debates", "Academic topics"]
    },
    {
      id: "b2",
      name: "B2 Advanced",
      ageGroup: "16+ years",
      description: "Young adults achieve fluency for academic and professional contexts",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      hours: "200-300 hours",
      skills: ["Advanced writing", "Presentations", "Professional English"]
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            8-Level ESL Curriculum Framework
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive curriculum follows CEFR standards, designed specifically for different age groups 
            to ensure optimal learning progression from absolute beginner to advanced proficiency.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-sm text-gray-600">CEFR Levels</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">4-18+</div>
              <div className="text-sm text-gray-600">Age Range</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="h-8 w-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold text-gray-900">1,200+</div>
              <div className="text-sm text-gray-600">Total Hours</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Star className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">100%</div>
              <div className="text-sm text-gray-600">Age-Appropriate</div>
            </CardContent>
          </Card>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {levels.map((level, index) => (
            <Card key={level.id} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge className={level.color}>
                    {level.name}
                  </Badge>
                  <span className="text-xs text-gray-500">Level {index + 1}</span>
                </div>
                <CardTitle className="text-lg">{level.ageGroup}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {level.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{level.hours}</span>
                </div>
                <div className="space-y-1">
                  {level.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="text-xs bg-gray-100 rounded px-2 py-1 inline-block mr-1">
                      {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Each level is carefully designed with age-appropriate content, interactive activities, and progressive skill building.
          </p>
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            Explore Our Curriculum
          </Button>
        </div>
      </div>
    </section>
  );
};
