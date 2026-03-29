import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import type { StudentStat } from '@/hooks/useTeacherAnalytics';

interface ClassOverviewProps {
  students: StudentStat[];
}

export const ClassOverview: React.FC<ClassOverviewProps> = ({ students }) => {
  if (students.length === 0) {
    return (
      <Card>
        <CardHeader><CardTitle>Student Reports</CardTitle></CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No students assigned yet. Students will appear here after booking sessions.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {students.map(student => (
          <div key={student.student_id} className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{student.student_name}</h3>
                <Badge variant="outline">{student.cefr_level}</Badge>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <FileText className="h-4 w-4 mr-1" />
                  Report
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xl font-bold text-primary">{student.lessons_completed}</p>
                <p className="text-xs text-muted-foreground">Lessons</p>
              </div>
              <div>
                <p className="text-xl font-bold text-green-600">{student.avg_score}%</p>
                <p className="text-xs text-muted-foreground">Avg Score</p>
              </div>
              <div>
                <p className="text-xl font-bold text-blue-600">{student.total_sessions}</p>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
