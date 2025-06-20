
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/index/Header";
import { Footer } from "@/components/index/Footer";
import { 
  BookOpen, 
  Video, 
  Users, 
  DollarSign, 
  Clock, 
  Award, 
  Globe, 
  TrendingUp,
  CheckCircle,
  Star,
  ArrowRight,
  Mail,
  Briefcase
} from "lucide-react";

const ForTeachers = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Earn $15-25/hour with performance bonuses and flexible scheduling."
    },
    {
      icon: Clock,
      title: "Flexible Schedule",
      description: "Work from anywhere, set your own hours, perfect work-life balance."
    },
    {
      icon: Users,
      title: "Global Student Base",
      description: "Teach students from around the world and make a real impact."
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Professional development opportunities and advancement paths."
    },
    {
      icon: Award,
      title: "Recognition Program",
      description: "Monthly awards, teacher spotlights, and achievement badges."
    },
    {
      icon: BookOpen,
      title: "Ready-Made Materials",
      description: "Access extensive curriculum library and teaching resources."
    }
  ];

  const requirements = [
    "Bachelor's degree in Education, English, or related field",
    "ESL/TEFL certification (CELTA, TESOL, or equivalent)",
    "Minimum 2 years of teaching experience",
    "Native or near-native English proficiency",
    "Reliable internet connection and quiet teaching space",
    "Passion for teaching and working with children"
  ];

  const features = [
    {
      icon: Video,
      title: "Interactive Teaching Platform",
      description: "State-of-the-art virtual classroom with whiteboard, games, and multimedia tools."
    },
    {
      icon: BookOpen,
      title: "Comprehensive Curriculum",
      description: "CEFR-aligned lessons for all levels from Pre-A1 to B2 with detailed teaching guides."
    },
    {
      icon: Users,
      title: "Teaching Support",
      description: "Dedicated teacher support team, regular training sessions, and peer mentoring."
    }
  ];

  const testimonials = [
    {
      name: "Jennifer Smith",
      role: "ESL Teacher, 3 years with EnglEuphoria",
      testimonial: "Teaching with EnglEuphoria has been incredibly rewarding. The platform is user-friendly, and I love seeing my students progress. The flexible schedule allows me to balance my career and family life perfectly.",
      rating: 5
    },
    {
      name: "David Chen",
      role: "Senior ESL Instructor",
      testimonial: "The support from the EnglEuphoria team is outstanding. They provide excellent resources and are always available to help. I've grown professionally and personally in this role.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200">
              For Teachers
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Shape Young Minds and
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent"> Build Your Career</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join our global community of certified ESL teachers. Make a meaningful impact 
              while enjoying competitive compensation, flexible schedules, and professional growth opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/teacher-application')}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Apply to Teach
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/signup')}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Why Teach with EnglEuphoria?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We provide everything you need to succeed as an online ESL teacher while making a real difference in students' lives.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Teaching Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              World-Class Teaching Tools
            </h2>
            <p className="text-xl text-gray-600">
              Access professional-grade tools designed to make online teaching effective and enjoyable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Teacher Requirements
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                We're looking for qualified, passionate educators who want to make a difference 
                in students' English learning journey.
              </p>
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{requirement}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/teacher-application')}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                >
                  Start Application
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/lovable-uploads/27f0b41c-34f2-4a8e-a08b-9a755fe74f97.png" 
                alt="Teacher teaching online" 
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Our Teachers Say
            </h2>
            <p className="text-xl text-gray-600">
              Hear from experienced teachers who have built successful careers with EnglEuphoria.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 italic">"{testimonial.testimonial}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Teaching Journey?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join our team of dedicated educators and help students around the world achieve English fluency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/teacher-application')}
              className="bg-white text-emerald-600 hover:bg-gray-100"
            >
              <Briefcase className="mr-2 h-4 w-4" />
              Apply Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-emerald-600"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </Button>
          </div>
          <p className="text-emerald-100">
            Have questions? Email us at <a href="mailto:support@engleuphoria.com" className="underline font-semibold">support@engleuphoria.com</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForTeachers;
