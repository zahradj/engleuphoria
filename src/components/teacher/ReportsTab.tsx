
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, BarChart3, Users, TrendingUp } from "lucide-react";

export const ReportsTab = () => {
  const studentReports = [
    {
      id: 1,
      student: "Alex Johnson",
      level: "Beginner",
      attendance: 95,
      homeworkCompletion: 88,
      progressScore: 78,
      lastAssessment: "B+",
      strengths: ["Vocabulary", "Listening"],
      improvements: ["Grammar", "Speaking confidence"]
    },
    {
      id: 2,
      student: "Maria Garcia",
      level: "Intermediate", 
      attendance: 88,
      homeworkCompletion: 92,
      progressScore: 85,
      lastAssessment: "A-",
      strengths: ["Reading", "Writing"],
      improvements: ["Pronunciation", "Fluency"]
    },
    {
      id: 3,
      student: "Li Wei",
      level: "Advanced",
      attendance: 100,
      homeworkCompletion: 95,
      progressScore: 92,
      lastAssessment: "A",
      strengths: ["Grammar", "Writing", "Comprehension"],
      improvements: ["Speaking speed"]
    }
  ];

  const classAnalytics = {
    totalStudents: 12,
    averageAttendance: 91,
    averageProgress: 83,
    completedLessons: 45,
    upcomingLessons: 8
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Reports & Feedback</h1>
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

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{classAnalytics.totalStudents}</p>
                <p className="text-sm text-gray-600">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{classAnalytics.averageAttendance}%</p>
                <p className="text-sm text-gray-600">Avg Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{classAnalytics.averageProgress}%</p>
                <p className="text-sm text-gray-600">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{classAnalytics.completedLessons}</p>
                <p className="text-sm text-gray-600">Lessons Done</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-teal-500" />
              <div>
                <p className="text-2xl font-bold">{classAnalytics.upcomingLessons}</p>
                <p className="text-sm text-gray-600">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Student Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Student Progress Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {studentReports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{report.student}</h3>
                    <Badge variant="outline">{report.level}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Generate Report
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{report.attendance}%</p>
                    <p className="text-sm text-gray-600">Attendance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{report.homeworkCompletion}%</p>
                    <p className="text-sm text-gray-600">Homework</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">{report.progressScore}%</p>
                    <p className="text-sm text-gray-600">Progress</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{report.lastAssessment}</p>
                    <p className="text-sm text-gray-600">Last Grade</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2">Strengths:</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.strengths.map((strength, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange-700 mb-2">Areas for Improvement:</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.improvements.map((improvement, index) => (
                        <Badge key={index} className="bg-orange-100 text-orange-800">
                          {improvement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
