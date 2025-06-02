
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const EarningsTab = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Earnings & Payments</h1>
      <Card>
        <CardHeader>
          <CardTitle>Payment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Earnings tracking functionality coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};
