
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Star, Clock, ArrowRight } from "lucide-react";

export const TeachersTab = () => {
  const navigate = useNavigate();

  const featuredTeachers = [
    {
      id: 1,
      name: "Sarah Johnson",
      accent: "American",
      rating: 4.9,
      reviews: 127,
      specializations: ["Business English", "Conversation"],
      experience: 8,
      rate: "2,500 DZD/hour",
      image: "/avatars/teacher1.jpg"
    },
    {
      id: 2,
      name: "Ahmed Benali",
      accent: "British",
      rating: 4.8,
      reviews: 95,
      specializations: ["IELTS Prep", "Grammar"],
      experience: 6,
      rate: "2,200 DZD/hour",
      image: "/avatars/teacher2.jpg"
    },
    {
      id: 3,
      name: "Emma Wilson",
      accent: "Australian",
      rating: 4.9,
      reviews: 156,
      specializations: ["Kids English", "Pronunciation"],
      experience: 10,
      rate: "2,800 DZD/hour",
      image: "/avatars/teacher3.jpg"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Find Your Perfect Teacher</h2>
            <p className="text-purple-100">
              Browse qualified teachers and book your next lesson
            </p>
          </div>
          <Users className="h-12 w-12 text-purple-200" />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => navigate('/teacher-discovery')}>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Browse All Teachers</h3>
                <p className="text-gray-600 text-sm">Search by specialization, accent, or rating</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Quick Book</h3>
                <p className="text-gray-600 text-sm">Find available teachers for today</p>
              </div>
              <ArrowRight className="h-5 w-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Teachers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-500" />
            Featured Teachers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTeachers.map((teacher) => (
              <div key={teacher.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-purple-600">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{teacher.name}</h4>
                    <p className="text-sm text-gray-600">{teacher.accent} accent</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{teacher.rating}</span>
                  <span className="text-sm text-gray-500">({teacher.reviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {teacher.specializations.map((spec, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="text-gray-600">{teacher.experience} years exp.</span>
                  <span className="font-semibold text-purple-600">{teacher.rate}</span>
                </div>

                <Button 
                  className="w-full" 
                  size="sm"
                  onClick={() => navigate('/teacher-discovery')}
                >
                  View Profile
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <Button 
              variant="outline" 
              onClick={() => navigate('/teacher-discovery')}
              className="px-8"
            >
              View All Teachers
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">50+</div>
            <div className="text-sm text-gray-600">Qualified Teachers</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">4.8</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">95%</div>
            <div className="text-sm text-gray-600">Student Satisfaction</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
