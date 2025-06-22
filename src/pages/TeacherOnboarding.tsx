
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { TeacherOnboardingFlow } from '@/components/teacher/TeacherOnboardingFlow';
import { Header } from '@/components/index/Header';
import { Footer } from '@/components/index/Footer';

const TeacherOnboarding = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Please log in to continue
            </h1>
            <p className="text-gray-600">
              You need to be logged in to access the teacher onboarding flow.
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1">
        <TeacherOnboardingFlow userEmail={user.email || ''} />
      </div>
      <Footer />
    </div>
  );
};

export default TeacherOnboarding;
