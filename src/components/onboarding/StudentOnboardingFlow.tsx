import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useStudentLevel, getStudentDashboardRoute, StudentLevel } from '@/hooks/useStudentLevel';
import { WelcomeStep } from './steps/WelcomeStep';
import { InterestsStep } from './steps/InterestsStep';
import { QuickAssessmentStep } from './steps/QuickAssessmentStep';
import { LearningPathStep } from './steps/LearningPathStep';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

export interface OnboardingData {
  interests: string[];
  assessmentScore: number;
  learningPath: any | null;
}

const StudentOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { studentLevel, refetch } = useStudentLevel();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    interests: [],
    assessmentScore: 0,
    learningPath: null,
  });

  const steps = ['Welcome', 'Interests', 'Quick Check', 'Your Path'];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleInterestsSelected = (interests: string[]) => {
    setOnboardingData(prev => ({ ...prev, interests }));
    handleNext();
  };

  const handleAssessmentComplete = (score: number) => {
    setOnboardingData(prev => ({ ...prev, assessmentScore: score }));
    handleNext();
  };

  const handleLearningPathGenerated = (path: any) => {
    setOnboardingData(prev => ({ ...prev, learningPath: path }));
  };

  const handleComplete = async () => {
    if (!user?.id || !studentLevel) return;

    setIsLoading(true);
    try {
      // Save learning path to personalized_learning_paths
      if (onboardingData.learningPath) {
        await supabase.from('personalized_learning_paths').insert({
          student_id: user.id,
          path_name: onboardingData.learningPath.path_name || `${studentLevel} Learning Journey`,
          total_steps: onboardingData.learningPath.total_lessons || 20,
          path_data: onboardingData.learningPath,
          learning_style: 'mixed',
          difficulty_preference: 'adaptive',
          estimated_completion_days: 28,
          ai_generated: true,
        });
      }

      // Update student profile
      await supabase.from('student_profiles')
        .update({
          onboarding_completed: true,
          interests: onboardingData.interests,
          placement_test_score: onboardingData.assessmentScore,
        })
        .eq('user_id', user.id);

      // Refetch to update state
      await refetch();

      // Navigate to appropriate dashboard
      const dashboardRoute = getStudentDashboardRoute(studentLevel);
      navigate(dashboardRoute, { replace: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!studentLevel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Progress Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-primary">
              {steps[currentStep]}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {currentStep === 0 && (
          <WelcomeStep 
            studentLevel={studentLevel} 
            onNext={handleNext} 
          />
        )}
        {currentStep === 1 && (
          <InterestsStep
            studentLevel={studentLevel}
            selectedInterests={onboardingData.interests}
            onComplete={handleInterestsSelected}
            onBack={handleBack}
          />
        )}
        {currentStep === 2 && (
          <QuickAssessmentStep
            studentLevel={studentLevel}
            onComplete={handleAssessmentComplete}
            onBack={handleBack}
          />
        )}
        {currentStep === 3 && (
          <LearningPathStep
            studentLevel={studentLevel}
            interests={onboardingData.interests}
            onPathGenerated={handleLearningPathGenerated}
            onComplete={handleComplete}
            onBack={handleBack}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default StudentOnboardingFlow;
