
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, MessageCircle, FileText } from "lucide-react";

export const LessonHistoryTab = () => {
  const lessonHistory = [
    {
      id: 1,
      title: "Beginner English - Group A",
      date: "Dec 5, 2024",
      time: "9:00 AM - 10:00 AM",
      students: ["Alex Johnson", "Maria Garcia", "Li Wei"],
      topic: "Past Tense Review",
      materials: ["Grammar worksheet", "Audio exercises"],
      notes: "Good progress on irregular verbs. Alex needs more practice.",
      recording: true
    },
    {
      id: 2,
      title: "Intermediate Conversation",
      date: "Dec 4, 2024",
      time: "2:00 PM - 3:00 PM",
      students: ["Emma Johnson"],
      topic: "Travel Vocabulary",
      materials: ["Travel phrases handout"],
      notes: "Excellent pronunciation improvement. Ready for advanced topics.",
      recording: true
    },
    {
      id: 3,
      title: "Grammar Fundamentals",
      date: "Dec 3, 2024",
      time: "4:00 PM - 5:00 PM",
      students: ["Carlos Martinez", "Sophia Ahmed"],
      topic: "Present Perfect Tense",
      materials: ["Grammar charts", "Exercise sheets"],
      notes: "Both students grasped the concept well. Assign practice homework.",
      recording: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Lesson History</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Filter by Student
          </Button>
          <Button variant="outline" size="sm">
            Filter by Date
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {lessonHistory.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{lesson.title}</CardTitle>
                  <p className="text-sm text-gray-600">
                    {lesson.date} • {lesson.time}
                  </p>
                </div>
                <Badge variant="outline">{lesson.topic}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Students:</h4>
                  <p className="text-sm">{lesson.students.join(", ")}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Materials Used:</h4>
                  <div className="flex flex-wrap gap-2">
                    {lesson.materials.map((material, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-1">Class Notes:</h4>
                  <p className="text-sm text-gray-600">{lesson.notes}</p>
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    Materials
                  </Button>
                  {lesson.recording && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Recording
                    </Button>
                  )}
                  <Button size="sm" variant="outline">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Send Summary
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
