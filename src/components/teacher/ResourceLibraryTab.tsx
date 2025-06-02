
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ResourceLibraryTab = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Resource Library</h1>
      <Card>
        <CardHeader>
          <CardTitle>Teaching Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Resource library functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
