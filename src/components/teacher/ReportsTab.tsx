import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download } from "lucide-react";
import { useTeacherAnalytics } from "@/hooks/useTeacherAnalytics";
import { EngagementMetrics } from "./analytics/EngagementMetrics";
import { StudentProgressChart } from "./analytics/StudentProgressChart";
import { ClassOverview } from "./analytics/ClassOverview";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export const ReportsTab = () => {
  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data.user;
    },
  });

  const { studentStats, classMetrics, sessionData, isLoading } = useTeacherAnalytics(user?.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <EngagementMetrics metrics={classMetrics} upcoming={sessionData?.upcoming || 0} />
      <StudentProgressChart students={studentStats} />
      <ClassOverview students={studentStats} />
    </div>
  );
};
