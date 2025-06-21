
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/index/Header";
import { Footer } from "@/components/index/Footer";
import { 
  BookOpen, 
  Users, 
  Star, 
  Award, 
  Clock, 
  Shield, 
  MessageCircle, 
  TrendingUp,
  Heart,
  CheckCircle,
  Mail,
  Phone
} from "lucide-react";

const ForParents = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Shield,
      title: "Safe Learning Environment",
      description: "Certified teachers, secure platform, and monitored classes ensure your child's safety."
    },
    {
      icon: Star,
      title: "Proven Results",
      description: "95% of students show measurable improvement within 3 months of starting."
    },
    {
      icon: Clock,
      title: "Flexible Scheduling",
      description: "Classes that fit your family's schedule, with easy rescheduling options."
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Real-time reports on your child's learning progress and achievements."
    },
    {
      icon: MessageCircle,
      title: "Direct Communication",
      description: "Regular updates from teachers and direct messaging for any concerns."
    },
    {
      icon: Award,
      title: "International Standards",
      description: "CEFR-aligned curriculum preparing your child for global opportunities."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "California, USA",
      testimonial: "My 8-year-old Emma went from being shy about speaking English to confidently chatting with her teacher. The games and interactive lessons make learning so enjoyable!",
      rating: 5,
      childAge: "8 years old"
    },
    {
      name: "Ahmed Al-Hassan",
      location: "Dubai, UAE",
      testimonial: "The progress reports help me understand exactly how my son is developing. The teachers are patient and professional.",
      rating: 5,
      childAge: "10 years old"
    },
    {
      name: "Maria Rodriguez",
      location: "Madrid, Spain",
      testimonial: "EnglEuphoria has made English learning fun for my daughter. She looks forward to every class!",
      rating: 5,
      childAge: "6 years old"
    }
  ];

  const features = [
    "Live one-on-one classes with certified teachers",
    "Interactive games and activities",
    "Age-appropriate curriculum (4-18 years)",
    "Regular progress reports",
    "24/7 customer support",
    "Flexible scheduling",
    "Money-back guarantee",
    "Certificate upon completion"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
              For Parents
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Give Your Child the Gift of 
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> English Fluency</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Watch your child gain confidence, improve grades, and unlock global opportunities 
              through our personalized English learning program designed specifically for young learners.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                Start Free Trial
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/classroom')}
              >
                Watch Demo Class
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
              Why Parents Choose EnglEuphoria
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied parents who have seen their children thrive with our proven approach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <benefit.icon className="h-6 w-6 text-purple-600" />
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

      {/* Features Checklist */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 relative overflow-hidden">
        {/* Background effects similar to home page */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -z-10 top-1/4 left-1/4 w-[300px] h-[300px] bg-purple/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
          <div className="absolute -z-10 bottom-1/4 right-1/4 w-[250px] h-[250px] bg-blue/20 rounded-full blur-3xl animate-pulse opacity-60 animation-delay-1000"></div>
          <div className="absolute -z-10 top-1/3 right-1/3 w-[200px] h-[200px] bg-emerald/20 rounded-full blur-3xl animate-pulse opacity-60 animation-delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Everything Your Child Needs to Excel
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Our comprehensive program includes all the tools and support your child needs 
                to master English effectively and enjoyably.
              </p>
              <div className="space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              {/* Background effects for the image */}
              <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/30 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
              <div className="absolute -z-10 bottom-1/4 right-1/4 w-[90%] h-[90%] bg-blue/25 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-300"></div>
              <div className="absolute -z-10 top-1/3 right-1/3 w-[80%] h-[80%] bg-emerald/20 rounded-full blur-3xl animate-pulse-subtle opacity-50 animation-delay-700"></div>
              
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="/lovable-uploads/cba853dc-1886-464e-bdbd-67aea13a21b3.png" 
                  alt="Child learning English with interactive educational tools and progress tracking"
                  className="w-full max-w-lg h-auto object-contain drop-shadow-2xl scale-110"
                />
                <div className="absolute -bottom-6 -left-6 bg-purple-600 text-white p-4 rounded-lg shadow-lg">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm">Parent Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              What Parents Are Saying
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from real families who have transformed their children's English skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{testimonial.name}</CardTitle>
                  <CardDescription>
                    {testimonial.location} • {testimonial.childAge}
                  </CardDescription>
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
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Child's English Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of families worldwide and give your child the advantage of English fluency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-white text-purple-600 hover:bg-gray-100"
            >
              Start Free Trial Today
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-white text-white hover:bg-white hover:text-purple-600"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
          <p className="text-blue-100">
            Questions? Email us at <a href="mailto:support@engleuphoria.com" className="underline font-semibold">support@engleuphoria.com</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ForParents;
