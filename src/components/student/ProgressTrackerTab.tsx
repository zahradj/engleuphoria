
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { TrendingUp, Award, Target, BarChart3, Settings } from "lucide-react";
import { EnhancedProgressTracker } from "@/components/analytics/EnhancedProgressTracker";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { useAuth } from "@/hooks/useAuth";

export const ProgressTrackerTab = () => {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<'overview' | 'analytics'>('overview');
  
  // Mock student ID for demo - in real app, this would come from auth
  const studentId = user?.id || 'demo-student-id';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Progress & Analytics</h1>
        <div className="flex gap-2">
          <Button
            variant={activeView === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveView('overview')}
            size="sm"
          >
            <Target className="h-4 w-4 mr-2" />
            Overview
          </Button>
          <Button
            variant={activeView === 'analytics' ? 'default' : 'outline'}
            onClick={() => setActiveView('analytics')}
            size="sm"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {activeView === 'overview' ? (
        <EnhancedProgressTracker 
          studentId={studentId}
          studentName={user?.full_name || 'Student'}
        />
      ) : (
        <AnalyticsDashboard studentId={studentId} />
      )}
    </div>
  );
};
