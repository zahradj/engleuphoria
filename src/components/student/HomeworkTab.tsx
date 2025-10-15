
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { homeworkService, HomeworkAssignmentWithSubmission } from "@/services/homeworkService";
import { useAuth } from "@/contexts/AuthContext";
import { HomeworkSubmissionModal } from "./HomeworkSubmissionModal";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export const HomeworkTab = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [assignments, setAssignments] = useState<HomeworkAssignmentWithSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignment, setSelectedAssignment] = useState<HomeworkAssignmentWithSubmission | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);

  useEffect(() => {
    loadAssignments();
  }, [user]);

  const loadAssignments = async () => {
    if (!user) return;
    
    setLoading(true);
    const data = await homeworkService.getStudentAssignments(user.id);
    setAssignments(data);
    setLoading(false);
  };

  const handleSubmit = async (submission: { text: string; files: File[] }) => {
    if (!selectedAssignment || !user) return;

    const result = await homeworkService.submitHomework(
      selectedAssignment.id,
      user.id,
      submission.text,
      [] // TODO: Upload files to storage
    );

    if (result.success) {
      toast({
        title: "✅ Homework Submitted",
        description: "Your homework has been submitted successfully!",
      });
      setIsSubmissionModalOpen(false);
      loadAssignments();
    } else {
      toast({
        title: "❌ Submission Failed",
        description: result.error || "Failed to submit homework",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (assignment: HomeworkAssignmentWithSubmission) => {
    const submission = assignment.submission;
    
    if (submission?.status === 'graded') {
      return <Badge className="bg-green-500 text-white">✓ Graded</Badge>;
    }
    
    if (submission?.status === 'submitted' || submission?.status === 'late') {
      return <Badge className="bg-blue-500 text-white">📤 Submitted</Badge>;
    }
    
    const isOverdue = new Date(assignment.due_date) < new Date();
    if (isOverdue) {
      return <Badge variant="destructive">⚠️ Overdue</Badge>;
    }
    
    return <Badge variant="outline" className="bg-yellow-100">⏳ Pending</Badge>;
  };

  const getStatusIcon = (assignment: HomeworkAssignmentWithSubmission) => {
    const submission = assignment.submission;
    
    if (submission?.status === 'graded') {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    
    if (submission?.status === 'submitted' || submission?.status === 'late') {
      return <Clock className="w-5 h-5 text-blue-500" />;
    }
    
    const isOverdue = new Date(assignment.due_date) < new Date();
    if (isOverdue) {
      return <AlertCircle className="w-5 h-5 text-red-500" />;
    }
    
    return <Clock className="w-5 h-5 text-yellow-500" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Homework Assignments</h1>
        <Card>
          <CardContent className="py-12 text-center text-gray-500">
            Loading assignments...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Homework Assignments</h1>
      
      <div className="grid gap-4">
        {assignments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Homework Assignments</h3>
              <p className="text-gray-500">You don't have any homework assignments at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(assignment)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{assignment.title}</CardTitle>
                        {getStatusBadge(assignment)}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                      {assignment.instructions && (
                        <p className="text-xs text-gray-500 italic">{assignment.instructions}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-primary mb-1">{assignment.points} points</p>
                    <p className="text-xs text-gray-500">
                      Due: {format(new Date(assignment.due_date), 'MMM dd, yyyy')}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {assignment.submission?.status === 'graded' && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-green-900">Grade:</span>
                      <span className="text-lg font-bold text-green-600">
                        {assignment.submission.points_earned} / {assignment.points}
                      </span>
                    </div>
                    {assignment.submission.teacher_feedback && (
                      <div>
                        <p className="text-xs text-green-800 font-medium mb-1">Teacher Feedback:</p>
                        <p className="text-sm text-green-700">{assignment.submission.teacher_feedback}</p>
                      </div>
                    )}
                  </div>
                )}

                {assignment.submission?.status === 'submitted' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-700">
                      ✓ Submitted on {format(new Date(assignment.submission.submitted_at!), 'MMM dd, yyyy HH:mm')}
                    </p>
                    {assignment.submission.text_response && (
                      <p className="text-xs text-blue-600 mt-2">Waiting for teacher to grade...</p>
                    )}
                  </div>
                )}

                {!assignment.submission && (
                  <Button 
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setIsSubmissionModalOpen(true);
                    }}
                    className="w-full"
                  >
                    📝 Submit Homework
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {selectedAssignment && (
        <HomeworkSubmissionModal
          isOpen={isSubmissionModalOpen}
          onClose={() => {
            setIsSubmissionModalOpen(false);
            setSelectedAssignment(null);
          }}
          assignmentTitle={selectedAssignment.title}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};
