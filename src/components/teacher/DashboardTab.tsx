
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  FileText, 
  MessageCircle,
  Clock,
  Play,
  Eye,
  CheckCircle,
  AlertCircle,
  Star
} from "lucide-react";

interface DashboardTabProps {
  teacherName: string;
}

export const DashboardTab = ({ teacherName }: DashboardTabProps) => {
  const todaysClasses = [
    {
      id: 1,
      title: "Beginner English - Group A",
      time: "9:00 AM",
      student: "Alex, Maria, Li",
      studentCount: 3,
      status: "upcoming"
    },
    {
      id: 2,
      title: "Intermediate Conversation",
      time: "2:00 PM", 
      student: "Emma Johnson",
      studentCount: 1,
      status: "ready"
    },
    {
      id: 3,
      title: "Grammar Fundamentals",
      time: "4:00 PM",
      student: "Carlos, Sophia",
      studentCount: 2,
      status: "upcoming"
    }
  ];

  const pendingHomework = [
    {
      student: "Alex Johnson",
      assignment: "Past Tense Exercises",
      submitted: "2 hours ago",
      urgent: false
    },
    {
      student: "Maria Garcia", 
      assignment: "Vocabulary Practice",
      submitted: "1 day ago",
      urgent: true
    }
  ];

  const notifications = [
    {
      type: "message",
      text: "New message from Emma Johnson",
      time: "5 min ago"
    },
    {
      type: "homework",
      text: "3 homework submissions to grade",
      time: "1 hour ago"
    },
    {
      type: "schedule",
      text: "Class rescheduled by Alex Johnson",
      time: "2 hours ago"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-500 to-indigo-500 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {teacherName}! 🌟</h1>
        <p className="opacity-90 mb-4">You have 3 classes scheduled today and 5 homework submissions to review.</p>
        <div className="flex gap-4">
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="font-semibold">12 Active Students</span>
            </div>
          </div>
          <div className="bg-white/20 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-semibold">4.9 Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-500" />
              Today's Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaysClasses.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">{cls.title}</h4>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {cls.time}
                    </p>
                    <p className="text-sm text-teal-600">{cls.student}</p>
                  </div>
                  <div className="flex gap-2">
                    {cls.status === "ready" ? (
                      <Button size="sm" className="bg-teal-500 hover:bg-teal-600">
                        <Play className="h-4 w-4 mr-1" />
                        Start
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Homework */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-500" />
              Homework to Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingHomework.map((hw, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-800">{hw.student}</h4>
                    <p className="text-sm text-gray-600">{hw.assignment}</p>
                    <p className="text-sm text-indigo-600 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Submitted {hw.submitted}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {hw.urgent && (
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                    )}
                    <Button size="sm" variant="outline">
                      Grade
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-500" />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    notification.type === 'message' ? 'bg-blue-100' :
                    notification.type === 'homework' ? 'bg-green-100' : 'bg-orange-100'
                  }`}>
                    {notification.type === 'message' ? <MessageCircle className="h-4 w-4 text-blue-500" /> :
                     notification.type === 'homework' ? <FileText className="h-4 w-4 text-green-500" /> :
                     <Calendar className="h-4 w-4 text-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{notification.text}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Class
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Create Assignment
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Message
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              View Students
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
