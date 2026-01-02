import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { TeacherApplicationForm } from "@/components/teacher/TeacherApplicationForm";
import { ApplicationSuccess } from "@/components/teacher/ApplicationSuccess";
import { CheckCircle, FileText, MessageSquare, Clock } from "lucide-react";

const TeacherApplication = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  const handleSubmissionSuccess = (id: string) => {
    setApplicationId(id);
    setSubmitted(true);
  };

  const steps = [
    {
      icon: FileText,
      title: "Complete Application",
      description: "Fill out our comprehensive application form with your qualifications and experience."
    },
    {
      icon: MessageSquare,
      title: "Application Review",
      description: "Our hiring team will review your application within 3-5 business days."
    },
    {
      icon: Clock,
      title: "Interview Process",
      description: "Qualified candidates will be invited for a virtual interview and demo lesson."
    },
    {
      icon: CheckCircle,
      title: "Welcome Aboard",
      description: "Successful candidates receive onboarding materials and access to our teaching platform."
    }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <header className="bg-white/80 backdrop-blur-sm border-b py-4 px-6">
          <div className="container mx-auto flex items-center justify-between">
            <Logo />
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Back to Login
            </Button>
          </div>
        </header>
        <ApplicationSuccess applicationId={applicationId} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      {/* Simple Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b py-4 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Logo />
          <Button variant="ghost" onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Join Our Teaching Team
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Take the first step towards a rewarding career in online ESL education. 
            Complete your application below to get started.
          </p>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-12 bg-white/50">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Application Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Teacher Application Form</CardTitle>
              <CardDescription className="text-center">
                Please fill out all sections completely and accurately. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TeacherApplicationForm onSubmissionSuccess={handleSubmissionSuccess} />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TeacherApplication;
