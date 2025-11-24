import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, DollarSign } from "lucide-react";
import { RecentActivityCard } from "./RecentActivityCard";
import { useState } from "react";
import { StudentDetailDialog } from "./StudentDetailDialog";

interface DashboardTabProps {
  teacherName: string;
  teacherId: string;
}

export const DashboardTab = ({ teacherName, teacherId }: DashboardTabProps) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">Welcome, {teacherName}!</h2>
        <p className="text-muted-foreground">Manage your classes and students</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Active students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0 DZD</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      <RecentActivityCard
        teacherId={teacherId}
        onViewDetails={(studentId) => setSelectedStudentId(studentId)}
      />

      {selectedStudentId && (
        <StudentDetailDialog
          studentId={selectedStudentId}
          studentName="Student"
          onClose={() => setSelectedStudentId(null)}
        />
      )}
    </div>
  );
};
