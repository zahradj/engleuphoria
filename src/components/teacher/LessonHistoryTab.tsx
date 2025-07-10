
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, MessageCircle, FileText } from "lucide-react";

export const LessonHistoryTab = () => {
  // TODO: Replace with real data from API/database
  const lessonHistory: any[] = [];

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
        {lessonHistory.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Lesson History</h3>
              <p className="text-gray-500 mb-6">Your completed lessons will appear here with details, notes, and recordings.</p>
              <Button variant="outline">
                Schedule Your First Lesson
              </Button>
            </CardContent>
          </Card>
        ) : (
          lessonHistory.map((lesson: any) => (
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
                      {lesson.materials.map((material: string, index: number) => (
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
          ))
        )}
      </div>
    </div>
  );
};
