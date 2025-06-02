
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Calendar } from "lucide-react";

export const LessonHistoryTab = () => {
  const lessons = [
    {
      id: 1,
      title: "Introduction to Present Perfect",
      date: "Dec 5, 2024",
      teacher: "Ms. Sarah",
      materials: 3,
      hasRecording: true
    },
    {
      id: 2,
      title: "Vocabulary: Food & Drinks", 
      date: "Dec 3, 2024",
      teacher: "Mr. John",
      materials: 2,
      hasRecording: false
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Lesson History</h1>
      
      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{lesson.title}</h3>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{lesson.date}</span>
                    </div>
                    <span>Teacher: {lesson.teacher}</span>
                    <Badge variant="outline">{lesson.materials} materials</Badge>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BookOpen className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Materials
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
