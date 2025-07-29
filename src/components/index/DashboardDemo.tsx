
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, BookOpen, Users, Star, Trophy, BarChart, Video } from "lucide-react";

export const DashboardDemo = () => {
  const [activeDemo, setActiveDemo] = useState("student");

  const studentDashboard = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-blue-900">Level 12</div>
            <div className="text-xs text-blue-700">1,250 XP</div>
          </div>
        </div>
        <div className="text-sm text-blue-800">Next level: 50 XP</div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-green-900">Next Class</div>
            <div className="text-xs text-green-700">Today 4:00 PM</div>
          </div>
        </div>
        <div className="text-sm text-green-800">Speaking Practice</div>
      </Card>

      <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-purple-900">5 Stars</div>
            <div className="text-xs text-purple-700">This Week</div>
          </div>
        </div>
        <div className="text-sm text-purple-800">Great progress!</div>
      </Card>

      <Card className="p-4 md:col-span-2 lg:col-span-3">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Recent Activities
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm">Vocabulary Quiz: Animals</span>
            <Badge className="bg-green-100 text-green-800">+25 XP</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm">Reading: The Magic Garden</span>
            <Badge className="bg-blue-100 text-blue-800">+15 XP</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span className="text-sm">Speaking Practice</span>
            <Badge className="bg-purple-100 text-purple-800">+30 XP</Badge>
          </div>
        </div>
      </Card>
    </div>
  );

  const parentDashboard = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Learning Progress
        </h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Vocabulary</span>
              <span>85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Speaking</span>
              <span>72%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Grammar</span>
              <span>91%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '91%' }}></div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Clock className="h-5 w-5" />
          This Week's Schedule
        </h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
            <div>
              <div className="font-medium text-sm">Monday 4:00 PM</div>
              <div className="text-xs text-gray-600">Conversation Practice</div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">Completed</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
            <div>
              <div className="font-medium text-sm">Wednesday 4:00 PM</div>
              <div className="text-xs text-gray-600">Grammar Lesson</div>
            </div>
            <Badge className="bg-green-100 text-green-800">Today</Badge>
          </div>
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div>
              <div className="font-medium text-sm">Friday 4:00 PM</div>
              <div className="text-xs text-gray-600">Reading Activity</div>
            </div>
            <Badge variant="outline">Upcoming</Badge>
          </div>
        </div>
      </Card>
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            See What You'll Get
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our intuitive dashboards designed for students and parents to track progress and stay engaged
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Tabs value={activeDemo} onValueChange={setActiveDemo} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Student Dashboard
              </TabsTrigger>
              <TabsTrigger value="parent" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Parent Dashboard
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="student" className="space-y-6">
              <Card className="p-6 bg-white shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Welcome back, Emma! 👋</h3>
                    <p className="text-gray-600">Ready to continue your English adventure?</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Video className="h-4 w-4 mr-2" />
                    Join Next Class
                  </Button>
                </div>
                {studentDashboard}
              </Card>
            </TabsContent>
            
            <TabsContent value="parent" className="space-y-6">
              <Card className="p-6 bg-white shadow-lg">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Emma's Learning Journey</h3>
                  <p className="text-gray-600">Track progress, view reports, and support learning at home</p>
                </div>
                {parentDashboard}
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-8">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl">
              Start Free Trial to Explore Dashboard
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
