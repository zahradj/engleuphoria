
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const AssignmentsTab = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Assignments & Homework</h1>
      <Card>
        <CardHeader>
          <CardTitle>Homework Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Assignment management functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
