
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, Users } from "lucide-react";

export const CalendarTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const scheduledClasses = [
    {
      id: 1,
      title: "Beginner English - Group A",
      time: "9:00 AM - 10:00 AM",
      students: ["Alex", "Maria", "Li"],
      date: new Date(),
      type: "group"
    },
    {
      id: 2,
      title: "Intermediate Conversation",
      time: "2:00 PM - 3:00 PM", 
      students: ["Emma Johnson"],
      date: new Date(),
      type: "individual"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Calendar & Schedule</h1>
        <Button className="bg-teal-500 hover:bg-teal-600">
          <Plus className="h-4 w-4 mr-2" />
          Schedule Class
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border pointer-events-auto"
            />
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {scheduledClasses.map((cls) => (
                <div key={cls.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{cls.title}</h3>
                    <Badge variant={cls.type === "group" ? "default" : "secondary"}>
                      {cls.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {cls.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {cls.students.length} student{cls.students.length > 1 ? 's' : ''}
                    </div>
                  </div>
                  <div className="mt-2">
                    <Button size="sm" className="mr-2">Join Class</Button>
                    <Button size="sm" variant="outline">Reschedule</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
