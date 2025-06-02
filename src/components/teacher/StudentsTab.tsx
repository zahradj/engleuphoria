
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, MessageCircle, Calendar, BarChart3 } from "lucide-react";

export const StudentsTab = () => {
  const students = [
    {
      id: 1,
      name: "Alex Johnson",
      level: "Beginner",
      nextClass: "Today, 2:00 PM",
      progress: 75,
      attendance: "95%",
      homework: "Completed"
    },
    {
      id: 2,
      name: "Maria Garcia", 
      level: "Intermediate",
      nextClass: "Tomorrow, 10:00 AM",
      progress: 60,
      attendance: "88%",
      homework: "Pending"
    },
    {
      id: 3,
      name: "Li Wei",
      level: "Advanced",
      nextClass: "Dec 8, 3:00 PM",
      progress: 90,
      attendance: "100%",
      homework: "Completed"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">My Students</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {students.map((student) => (
          <Card key={student.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-teal-100 text-teal-700">
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{student.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <Badge variant="outline">{student.level}</Badge>
                      <span>Next: {student.nextClass}</span>
                      <span>Attendance: {student.attendance}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Schedule
                  </Button>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Progress
                  </Button>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{student.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-teal-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
