
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/index/Header";
import { Footer } from "@/components/index/Footer";
import { CheckCircle, Globe, Users, DollarSign, Clock, Award, Video, FileText } from "lucide-react";

const BecomeTeacher = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Globe,
      title: "Teach Globally",
      description: "Connect with students from around the world and share your expertise"
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Set your own hours and teach when it's convenient for you"
    },
    {
      icon: DollarSign,
      title: "Competitive Pay",
      description: "Earn competitive rates with weekly payouts"
    },
    {
      icon: Users,
      title: "Small Classes",
      description: "Focus on individual students with one-on-one sessions"
    },
    {
      icon: Award,
      title: "Professional Growth",
      description: "Access to teaching resources and professional development"
    },
    {
      icon: Video,
      title: "Modern Platform",
      description: "State-of-the-art virtual classroom technology"
    }
  ];

  const requirements = [
    "Native or near-native English proficiency",
    "Bachelor's degree (any field)",
    "TEFL/TESOL certification preferred",
    "Teaching experience (preferred but not required)",
    "Reliable internet connection (minimum 10 Mbps)",
    "Quiet teaching environment",
    "Professional webcam and headset"
  ];

  const processSteps = [
    {
      number: 1,
      title: "Apply Online",
      description: "Complete our comprehensive application form",
      icon: FileText
    },
    {
      number: 2,
      title: "Equipment Test",
      description: "Test your equipment and internet connection",
      icon: Video
    },
    {
      number: 3,
      title: "Live Interview",
      description: "Meet with our team for a professional interview",
      icon: Users
    },
    {
      number: 4,
      title: "Start Teaching",
      description: "Get approved and begin your teaching journey",
      icon: Award
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Become an Online English Teacher
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our community of passionate educators and help students around the world 
            achieve their English learning goals. Flexible hours, competitive pay, and 
            meaningful impact.
          </p>
          <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
            onClick={() => navigate('/teacher-application')}
          >
            Apply Now
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Application takes about 15 minutes
          </p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Teach With Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Requirements
          </h2>
          <Card>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Application Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-emerald-200 transform -translate-x-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Teaching Journey?
          </h2>
          <p className="text-emerald-100 text-xl mb-8 max-w-2xl mx-auto">
            Join hundreds of teachers who are already making a difference. 
            Apply today and start teaching within a week.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3"
            onClick={() => navigate('/teacher-application')}
          >
            Apply Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BecomeTeacher;
