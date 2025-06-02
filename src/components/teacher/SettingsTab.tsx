
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SettingsTabProps {
  teacherName: string;
}

export const SettingsTab = ({ teacherName }: SettingsTabProps) => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Settings for {teacherName} coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
