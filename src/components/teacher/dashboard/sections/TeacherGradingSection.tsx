
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, FileText, Clock, CheckCircle } from "lucide-react";

interface TeacherGradingSectionProps {
  handlers: any;
}

export const TeacherGradingSection = ({ handlers }: TeacherGradingSectionProps) => {
  const pendingAssignments = [
    {
      id: 1,
      student: "Julia, 8 y.o.",
      assignment: "Reading Comprehension - Unit 4",
      submitted: "2 hours ago",
      dueDate: "Today",
      status: "pending"
    },
    {
      id: 2,
      student: "Alex, 10 y.o.", 
      assignment: "Vocabulary Quiz - Animals",
      submitted: "1 day ago",
      dueDate: "Yesterday",
      status: "overdue"
    },
    {
      id: 3,
      student: "Gisele, 9 y.o.",
      assignment: "Speaking Practice Recording",
      submitted: "3 hours ago", 
      dueDate: "Today",
      status: "pending"
    }
  ];

  const recentGrades = [
    {
      id: 1,
      student: "Karim, 8 y.o.",
      assignment: "Grammar Exercise - Past Tense",
      grade: "A",
      score: 95,
      feedback: "Excellent understanding of past tense rules!"
    },
    {
      id: 2,
      student: "Leonora, 11 y.o.",
      assignment: "Reading Comprehension",
      grade: "B+",
      score: 87,
      feedback: "Good progress, work on vocabulary expansion."
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Grading & Assessment</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-orange-600">8</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed This Week</p>
                <p className="text-2xl font-bold text-green-600">24</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold">B+</p>
              </div>
              <Star className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Student Progress</p>
                <p className="text-2xl font-bold text-blue-600">78%</p>
              </div>
              <Progress value={78} className="h-2 mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Assignments */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{assignment.student}</div>
                  <div className="text-sm text-gray-600">{assignment.assignment}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">Submitted: {assignment.submitted}</span>
                    <Badge variant={assignment.status === "overdue" ? "destructive" : "secondary"}>
                      {assignment.status}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Review
                  </Button>
                  <Button size="sm">
                    Grade
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Graded</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentGrades.map((grade) => (
              <div key={grade.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                <div className="flex-1">
                  <div className="font-medium">{grade.student}</div>
                  <div className="text-sm text-gray-600">{grade.assignment}</div>
                  <div className="text-sm text-gray-500 mt-1">{grade.feedback}</div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{grade.grade}</div>
                  <div className="text-sm text-gray-500">{grade.score}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
