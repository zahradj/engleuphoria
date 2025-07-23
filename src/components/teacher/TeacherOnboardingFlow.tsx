
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, XCircle, User, FileText, Settings, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { TeacherApplicationForm } from "./TeacherApplicationForm";
import { EquipmentTest } from "./EquipmentTest";
import { InterviewBooking } from "./InterviewBooking";
import type { TeacherApplicationStage } from "@/types/teacher";

interface TeacherOnboardingFlowProps {
  userEmail: string;
}

export const TeacherOnboardingFlow: React.FC<TeacherOnboardingFlowProps> = ({ userEmail }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStage, setCurrentStage] = useState<TeacherApplicationStage>('application_submitted');
  const [applicationId, setApplicationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const stages = [
    {
      id: 'application_submitted',
      title: 'Application',
      description: 'Complete your teaching application',
      icon: FileText,
      progress: 20
    },
    {
      id: 'equipment_test',
      title: 'Equipment Test',
      description: 'Test your teaching equipment',
      icon: Settings,
      progress: 40
    },
    {
      id: 'interview_scheduled',
      title: 'Interview',
      description: 'Schedule and complete interview',
      icon: User,
      progress: 70
    },
    {
      id: 'approved',
      title: 'Approved',
      description: 'Welcome to the team!',
      icon: Award,
      progress: 100
    }
  ];

  useEffect(() => {
    checkApplicationStatus();
  }, [userEmail]);

  const checkApplicationStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .eq('email', userEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setApplicationId(data.id);
        setCurrentStage(data.current_stage as TeacherApplicationStage);
      }
    } catch (error) {
      // No application found - user needs to create one
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationSuccess = (id: string) => {
    setApplicationId(id);
    setCurrentStage('equipment_test');
    toast({ title: "Application submitted successfully!" });
  };

  const handleEquipmentTestComplete = (passed: boolean) => {
    if (passed) {
      setCurrentStage('interview_scheduled');
      toast({ title: "Equipment test completed!" });
    } else {
      toast({ 
        title: "Equipment test needs improvement",
        description: "Please ensure you meet the minimum requirements.",
        variant: "destructive"
      });
    }
  };

  const handleInterviewBooked = (interviewId: string) => {
    setCurrentStage('interview_scheduled');
    toast({ title: "Interview booked successfully!" });
  };

  const getStageStatus = (stageId: string) => {
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    const stageIndex = stages.findIndex(s => s.id === stageId);
    
    if (stageIndex < currentIndex) return 'completed';
    if (stageIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getCurrentProgress = () => {
    const currentStageData = stages.find(s => s.id === currentStage);
    return currentStageData?.progress || 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Header */}
        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Teacher Onboarding</CardTitle>
            <CardDescription>
              Complete these steps to become an approved teacher
            </CardDescription>
            <Progress value={getCurrentProgress()} className="mt-4" />
          </CardHeader>
        </Card>

        {/* Stage Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {stages.map((stage, index) => {
            const status = getStageStatus(stage.id);
            const Icon = stage.icon;
            
            return (
              <Card key={stage.id} className={`${status === 'current' ? 'ring-2 ring-emerald-500' : ''}`}>
                <CardContent className="p-4 text-center">
                  <div className="flex justify-center mb-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      status === 'completed' ? 'bg-green-100 text-green-600' :
                      status === 'current' ? 'bg-emerald-100 text-emerald-600' :
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {status === 'completed' ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Icon className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-sm">{stage.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{stage.description}</p>
                  <Badge 
                    variant={
                      status === 'completed' ? 'default' :
                      status === 'current' ? 'secondary' : 'outline'
                    }
                    className="mt-2 text-xs"
                  >
                    {status === 'completed' ? 'Complete' :
                     status === 'current' ? 'In Progress' : 'Pending'}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Current Stage Content */}
        <div className="space-y-6">
          {currentStage === 'application_submitted' && !applicationId && (
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Application</CardTitle>
                <CardDescription>
                  Fill out the comprehensive teacher application form
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TeacherApplicationForm onSubmissionSuccess={handleApplicationSuccess} />
              </CardContent>
            </Card>
          )}

          {currentStage === 'equipment_test' && applicationId && (
            <Card>
              <CardHeader>
                <CardTitle>Equipment & Internet Test</CardTitle>
                <CardDescription>
                  Verify your teaching equipment meets our requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EquipmentTest 
                  applicationId={applicationId}
                  onTestComplete={handleEquipmentTestComplete}
                />
              </CardContent>
            </Card>
          )}

          {currentStage === 'interview_scheduled' && applicationId && (
            <Card>
              <CardHeader>
                <CardTitle>Schedule Your Interview</CardTitle>
                <CardDescription>
                  Book a time for your professional teaching interview
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InterviewBooking 
                  applicationId={applicationId}
                  onInterviewBooked={handleInterviewBooked}
                />
              </CardContent>
            </Card>
          )}

          {currentStage === 'approved' && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-800">
                  Congratulations! 🎉
                </CardTitle>
                <CardDescription className="text-green-700">
                  You've been approved as a teacher. Welcome to our team!
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button 
                  size="lg" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => navigate('/teacher')}
                >
                  Access Teacher Dashboard
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStage === 'rejected' && (
            <Card className="bg-red-50 border-red-200">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl text-red-800">
                  Application Not Approved
                </CardTitle>
                <CardDescription className="text-red-700">
                  We appreciate your interest. You may reapply after 30 days.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
