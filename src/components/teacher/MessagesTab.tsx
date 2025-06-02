
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const MessagesTab = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Messages</h1>
      <Card>
        <CardHeader>
          <CardTitle>Student Communications</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Messaging functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
