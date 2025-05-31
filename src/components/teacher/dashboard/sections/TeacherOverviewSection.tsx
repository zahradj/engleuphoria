
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Star,
  MessageSquare,
  CheckCircle
} from "lucide-react";

interface TeacherOverviewSectionProps {
  handlers: {
    handleCreateLessonPlan: () => void;
    handleScheduleClass: () => void;
    handleStartScheduledClass: (className: string) => void;
  };
}

export const TeacherOverviewSection = ({ handlers }: TeacherOverviewSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total lessons</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-gray-500 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total students</p>
                <p className="text-2xl font-bold">32</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+3</span>
              <span className="text-gray-500 ml-1">new this week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Regular students</p>
                <p className="text-2xl font-bold">10</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Retention rate: 85%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Trial students</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-gray-500">Conversion rate: 75%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Lesson */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Next lesson
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">23 May 2025, 10:30 AM-10:25 AM</p>
                  <p className="text-sm text-gray-600">starts in 00:14:36 Friday</p>
                </div>
                <Button size="sm" onClick={() => handlers.handleStartScheduledClass("Magic Academy Extra Speaking Practice")}>
                  Enter classroom
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Lesson</span>
                  <span className="text-sm">L-1 Unit L10 - Magic Academy Extra Speaking Practice Unit 4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Student</span>
                  <span className="text-sm">Julia, 8 y.o., #924532RTP, female 😊</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last feedback</span>
                  <span className="text-sm text-blue-600 cursor-pointer">Open</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics for May */}
        <Card>
          <CardHeader>
            <CardTitle>Statistics for May</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total lessons</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Regular students</p>
                <p className="text-2xl font-bold">10</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total students</p>
                <p className="text-2xl font-bold">32</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trial students</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Lesson completed: Magic Academy Extra Reading Practice Unit 2</p>
                <p className="text-xs text-gray-500">Student: Karim, 8 y.o. - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New student enrolled: Leonora Lopez</p>
                <p className="text-xs text-gray-500">Trial lesson scheduled for tomorrow</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Feedback submitted for Julia's lesson</p>
                <p className="text-xs text-gray-500">Parent rating: 5 stars</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="h-16 flex flex-col gap-2" onClick={handlers.handleCreateLessonPlan}>
          <BookOpen className="h-5 w-5" />
          Create Lesson Plan
        </Button>
        <Button variant="outline" className="h-16 flex flex-col gap-2" onClick={handlers.handleScheduleClass}>
          <Calendar className="h-5 w-5" />
          Schedule Class
        </Button>
        <Button variant="outline" className="h-16 flex flex-col gap-2">
          <MessageSquare className="h-5 w-5" />
          Send Message
        </Button>
      </div>
    </div>
  );
};
