
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, User } from "lucide-react";

export const UpcomingClassesTab = () => {
  const classes = [
    {
      id: 1,
      title: "Conversation Practice: Daily Routines",
      date: "Dec 7, 2024",
      time: "2:00 PM",
      duration: "60 min",
      teacher: "Ms. Sarah Johnson",
      type: "Group Class",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Grammar Focus: Past Tense",
      date: "Dec 8, 2024", 
      time: "10:00 AM",
      duration: "45 min",
      teacher: "Mr. John Smith",
      type: "1-on-1",
      status: "upcoming"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Upcoming Classes</h1>
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Calendar className="h-4 w-4 mr-2" />
          Schedule New Class
        </Button>
      </div>

      <div className="grid gap-4">
        {classes.map((cls) => (
          <Card key={cls.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{cls.title}</h3>
                    <Badge variant={cls.type === "1-on-1" ? "default" : "secondary"}>
                      {cls.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-6 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{cls.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{cls.time} ({cls.duration})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{cls.teacher}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button size="sm" className="bg-green-500 hover:bg-green-600">
                    <Video className="h-4 w-4 mr-1" />
                    Join Class
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
