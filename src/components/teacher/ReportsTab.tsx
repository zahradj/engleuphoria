
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ReportsTab = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reports & Feedback</h1>
      <Card>
        <CardHeader>
          <CardTitle>Student Progress Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Reporting functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
