
import React from "react";
import { EnhancedProgressTracker } from "@/components/analytics/EnhancedProgressTracker";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, BarChart3 } from "lucide-react";

export const ProgressTrackerTab = () => {
  // Mock student data - in a real app, this would come from auth context
  const studentId = "student-456";
  const studentName = "Alex";

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Progress Tracker</h2>
        <p className="text-gray-600">Track your learning journey and see detailed analytics</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Progress Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Detailed Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <EnhancedProgressTracker 
            studentId={studentId}
            studentName={studentName}
          />
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <AnalyticsDashboard studentId={studentId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
