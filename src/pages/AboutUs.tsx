
import React from "react";
import { Header } from "@/components/index/Header";
import { Footer } from "@/components/index/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Heart, 
  Users, 
  Globe, 
  Award, 
  BookOpen, 
  Star,
  GraduationCap,
  Target,
  Lightbulb
} from "lucide-react";

const AboutUs = () => {
  const navigate = useNavigate();
  const { languageText } = useLanguage();

  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&crop=face",
      description: "Former ESL teacher with 15+ years experience in childhood education."
    },
    {
      name: "Michael Chen",
      role: "Head of Curriculum",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
      description: "PhD in Applied Linguistics, specializing in interactive learning methods."
    },
    {
      name: "Emma Rodriguez",
      role: "Learning Experience Designer",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      description: "Expert in gamification and child psychology in education."
    },
    {
      name: "David Kim",
      role: "Technology Director",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      description: "Leading the development of our innovative learning platform."
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Learning",
      description: "We believe every child deserves access to quality English education that sparks joy and curiosity."
    },
    {
      icon: Users,
      title: "Community First",
      description: "Building a supportive community where children, parents, and teachers connect and grow together."
    },
    {
      icon: Globe,
      title: "Global Accessibility",
      description: "Making English learning accessible to children worldwide, regardless of location or background."
    },
    {
      icon: Award,
      title: "Excellence in Education",
      description: "Committed to the highest standards of educational content and teaching methodologies."
    }
  ];

  const achievements = [
    { number: "50,000+", label: "Happy Students" },
    { number: "1,200+", label: "Certified Teachers" },
    { number: "85+", label: "Countries Reached" },
    { number: "98%", label: "Parent Satisfaction" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container max-w-6xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            {languageText.aboutUs || "About Us"}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Making English Learning Joyful for Every Child
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            At EnglEuphoria, we're on a mission to transform how children learn English through 
            innovative technology, engaging content, and passionate educators from around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Start Learning Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/for-teachers")}
            >
              <Users className="mr-2 h-5 w-5" />
              Join Our Teacher Community
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 bg-white relative overflow-hidden">
        {/* Background effects similar to homepage */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -z-10 top-1/4 left-1/4 w-[300px] h-[300px] bg-purple/20 rounded-full blur-3xl animate-pulse opacity-60"></div>
          <div className="absolute -z-10 bottom-1/4 right-1/4 w-[250px] h-[250px] bg-blue/20 rounded-full blur-3xl animate-pulse opacity-60 animation-delay-1000"></div>
          <div className="absolute -z-10 top-1/3 right-1/3 w-[200px] h-[200px] bg-emerald/20 rounded-full blur-3xl animate-pulse opacity-60 animation-delay-500"></div>
        </div>
        
        <div className="container max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-purple-600 mr-3" />
                <h2 className="text-3xl font-bold">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 mb-6">
                We believe that learning English should be an adventure, not a chore. Our platform 
                combines cutting-edge technology with proven educational methods to create an 
                immersive, interactive experience that keeps children engaged and motivated.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <BookOpen className="h-6 w-6 text-blue-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Comprehensive Curriculum</h3>
                    <p className="text-gray-600">Age-appropriate lessons designed by education experts</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Lightbulb className="h-6 w-6 text-yellow-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Interactive Learning</h3>
                    <p className="text-gray-600">Games, stories, and activities that make learning fun</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Star className="h-6 w-6 text-green-500 mr-3 mt-1" />
                  <div>
                    <h3 className="font-semibold mb-1">Personalized Progress</h3>
                    <p className="text-gray-600">Adaptive learning paths tailored to each child's needs</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center lg:justify-end">
              {/* Background effects for the image */}
              <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/30 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
              <div className="absolute -z-10 bottom-1/4 right-1/4 w-[90%] h-[90%] bg-blue/25 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-300"></div>
              <div className="absolute -z-10 top-1/3 right-1/3 w-[80%] h-[80%] bg-emerald/20 rounded-full blur-3xl animate-pulse-subtle opacity-50 animation-delay-700"></div>
              
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <img 
                  src="/lovable-uploads/1be86621-46cd-4f3c-91da-26cae7b49cb3.png" 
                  alt="3D educational illustration with books, graduation cap, globe, and learning elements"
                  className="w-full max-w-lg h-auto object-contain drop-shadow-2xl scale-110"
                />
                <div className="absolute -bottom-6 -left-6 bg-purple-600 text-white p-4 rounded-lg shadow-lg">
                  <div className="text-2xl font-bold">5+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600">
              The principles that guide everything we do at EnglEuphoria
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">
              Passionate educators and technologists dedicated to your child's success
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-purple-600 font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl opacity-90">
              Making a difference in children's lives around the world
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold mb-2">{achievement.number}</div>
                <div className="text-lg opacity-90">{achievement.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Start your child's English learning journey with EnglEuphoria today. 
            Join thousands of families who trust us with their children's education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/contact")}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
