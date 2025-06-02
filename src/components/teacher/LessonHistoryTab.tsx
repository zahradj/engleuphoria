
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LessonHistoryTab = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Lesson History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Past Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Lesson history functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
