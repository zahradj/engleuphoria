import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/index/Header';
import { Footer } from '@/components/index/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  BookOpen, 
  Star, 
  Trophy,
  Clock,
  Globe
} from 'lucide-react';

const ForTeachers = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Earnings",
      description: "Earn competitive rates with flexible scheduling options"
    },
    {
      icon: Calendar,
      title: "Flexible Schedule",
      description: "Set your own hours and work when it suits you best"
    },
    {
      icon: Users,
      title: "Global Students",
      description: "Teach students from around the world and make a global impact"
    },
    {
      icon: BookOpen,
      title: "Rich Resources",
      description: "Access our comprehensive curriculum and teaching materials"
    },
    {
      icon: Star,
      title: "Professional Growth",
      description: "Develop your skills with ongoing training and support"
    },
    {
      icon: Trophy,
      title: "Recognition Program",
      description: "Get recognized for excellent teaching performance"
    }
  ];

  const stats = [
    { label: "Active Teachers", value: "500+", icon: Users },
    { label: "Total Lessons", value: "10,000+", icon: Clock },
    { label: "Countries", value: "25+", icon: Globe },
    { label: "Average Rating", value: "4.9/5", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Join Our Teaching Community
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Share your passion for English teaching with students worldwide. 
              Flexible hours, competitive pay, and a supportive community await you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/teacher-application")}
                className="bg-primary hover:bg-primary/90"
              >
                Apply to Teach
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/become-teacher")}
              >
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Why Teach with Engleuphoria?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <benefit.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                    <CardTitle className="text-xl">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 bg-muted/50">
          <div className="container max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">
              Requirements
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Essential Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Native or fluent English speaker</li>
                    <li>• Bachelor's degree (any field)</li>
                    <li>• Reliable internet connection</li>
                    <li>• Quiet teaching environment</li>
                    <li>• Professional attitude and appearance</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preferred Qualifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• TEFL/TESOL certification</li>
                    <li>• Teaching experience</li>
                    <li>• Experience with online platforms</li>
                    <li>• Additional language skills</li>
                    <li>• Specialized subject expertise</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Ready to Start Teaching?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join our community of passionate educators and start making a difference today.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/teacher-application")}
              className="bg-primary hover:bg-primary/90"
            >
              Apply Now
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ForTeachers;