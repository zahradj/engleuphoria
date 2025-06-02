
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Download, MessageCircle, Clock } from "lucide-react";

export const AssignmentsTab = () => {
  const assignments = [
    {
      id: 1,
      title: "Past Tense Practice",
      assignedTo: ["Alex Johnson", "Maria Garcia"],
      dueDate: "Dec 8, 2024",
      status: "pending",
      submissions: 1,
      totalStudents: 2,
      description: "Complete exercises 1-5 on past tense forms"
    },
    {
      id: 2,
      title: "Vocabulary Quiz - Travel",
      assignedTo: ["Emma Johnson"],
      dueDate: "Dec 7, 2024",
      status: "submitted",
      submissions: 1,
      totalStudents: 1,
      description: "Quiz on travel-related vocabulary from Unit 3"
    },
    {
      id: 3,
      title: "Reading Comprehension",
      assignedTo: ["Carlos Martinez", "Sophia Ahmed", "Li Wei"],
      dueDate: "Dec 10, 2024",
      status: "pending",
      submissions: 0,
      totalStudents: 3,
      description: "Read the short story and answer comprehension questions"
    }
  ];

  const submissions = [
    {
      id: 1,
      student: "Emma Johnson",
      assignment: "Vocabulary Quiz - Travel",
      submittedDate: "Dec 6, 2024",
      status: "submitted",
      needsGrading: true
    },
    {
      id: 2,
      student: "Alex Johnson", 
      assignment: "Past Tense Practice",
      submittedDate: "Dec 5, 2024",
      status: "graded",
      grade: "85%",
      needsGrading: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Assignments & Homework</h1>
        <Button className="bg-teal-500 hover:bg-teal-600">
          <Plus className="h-4 w-4 mr-2" />
          Create Assignment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Active Assignments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                    <Badge 
                      variant={assignment.status === "submitted" ? "default" : "secondary"}
                    >
                      {assignment.submissions}/{assignment.totalStudents} submitted
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Due: {assignment.dueDate}
                    </div>
                    <span>Students: {assignment.assignedTo.length}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Remind
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{submission.student}</h3>
                    {submission.needsGrading ? (
                      <Badge variant="destructive">Needs Grading</Badge>
                    ) : (
                      <Badge variant="default">Graded: {submission.grade}</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{submission.assignment}</p>
                  <p className="text-xs text-gray-500 mb-3">
                    Submitted: {submission.submittedDate}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    {submission.needsGrading ? (
                      <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">
                        Grade Now
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Feedback
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
