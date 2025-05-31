
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Plus } from "lucide-react";

interface TeacherScheduleSectionProps {
  handlers: {
    handleScheduleClass: () => void;
    handleStartScheduledClass: (className: string) => void;
  };
}

export const TeacherScheduleSection = ({ handlers }: TeacherScheduleSectionProps) => {
  const upcomingLessons = [
    {
      id: 1,
      time: "10:30 AM-10:55 AM",
      date: "Friday",
      student: "Julia, 8 y.o.",
      lesson: "Magic Academy Level 1: Trial Lesson",
      status: "ready",
      type: "individual"
    },
    {
      id: 2,
      time: "11:00 AM-11:25 AM", 
      date: "Friday",
      student: "Alex, 10 y.o.",
      lesson: "Welcome to My World",
      status: "ready",
      type: "individual"
    },
    {
      id: 3,
      time: "11:30 AM-11:55 AM",
      date: "Friday", 
      student: "Gisele, 9 y.o.",
      lesson: "Magic Academy Extra Reading Practice Unit 2",
      status: "scheduled",
      type: "individual"
    },
    {
      id: 4,
      time: "12:00 PM-12:25 PM",
      date: "Friday",
      student: "Mehmet, 10 y.o.",
      lesson: "Magic Academy Quest 2: My Circus Returns",
      status: "scheduled", 
      type: "individual"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Schedule</h2>
        <Button onClick={handlers.handleScheduleClass}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule New Lesson
        </Button>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Lessons - Friday, May 23</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingLessons.map((lesson) => (
              <div key={lesson.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-medium text-sm">{lesson.time}</div>
                    <div className="text-xs text-gray-500">{lesson.date}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{lesson.student}</div>
                    <div className="text-sm text-gray-600">{lesson.lesson}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={lesson.type === "individual" ? "default" : "secondary"}>
                        {lesson.type}
                      </Badge>
                      <Badge variant={lesson.status === "ready" ? "default" : "outline"}>
                        {lesson.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  {lesson.status === "ready" ? (
                    <Button 
                      size="sm"
                      onClick={() => handlers.handleStartScheduledClass(lesson.lesson)}
                    >
                      Enter classroom
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>This Week Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Total lessons</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Individual lessons</span>
                <span className="font-medium">20</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Group lessons</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total hours</span>
                <span className="font-medium">12 hours</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Completion rate</span>
                <span className="font-medium text-green-600">96%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Average rating</span>
                <span className="font-medium">4.8/5.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Student satisfaction</span>
                <span className="font-medium text-green-600">98%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Reschedule requests</span>
                <span className="font-medium">2</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
