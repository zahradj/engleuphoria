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
    <div className="min-h-screen bg-gradient-to-br from-joyful-bg via-white to-purple-50">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-joyful-purple via-joyful-pink to-joyful-orange relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-4 h-4 bg-white/30 rounded-full animate-float opacity-80"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-joyful-yellow/50 rounded-full animate-float-delayed opacity-90"></div>
            <div className="absolute bottom-20 left-20 w-5 h-5 bg-white/20 rounded-full animate-float opacity-70"></div>
            <div className="absolute top-1/2 right-10 w-2.5 h-2.5 bg-joyful-yellow/40 rounded-full animate-float-delayed opacity-80"></div>
          </div>

          <div className="container max-w-6xl mx-auto px-4 text-center relative z-10">
            <h1 className="font-fun text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight">
              Join Our Teaching 
              <span className="text-joyful-yellow animate-text-shine"> Community ✨</span>
            </h1>
            <p className="font-body text-xl sm:text-2xl md:text-3xl text-white/90 mb-10 max-w-4xl mx-auto leading-relaxed">
              Share your passion for English teaching with students worldwide. 
              Flexible hours, competitive pay, and a supportive community await you. 🌟
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/teacher-application")}
                className="group bg-white text-joyful-purple hover:bg-white/90 font-bold text-xl px-10 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
              >
                🚀 Apply to Teach
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/become-teacher")}
                className="group border-2 border-white text-white hover:bg-white hover:text-joyful-purple font-bold text-xl px-10 py-5 rounded-full hover:scale-105 transition-all duration-300"
              >
                📚 Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-white via-joyful-bg to-emerald-50 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-3 h-3 bg-joyful-yellow rounded-full animate-float opacity-60"></div>
            <div className="absolute bottom-32 right-20 w-2 h-2 bg-joyful-orange rounded-full animate-float-delayed opacity-70"></div>
            <div className="absolute top-1/2 left-20 w-4 h-4 bg-joyful-pink rounded-full animate-float opacity-50"></div>
          </div>

          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-joyful-purple/20 to-joyful-pink/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <stat.icon className="h-8 w-8 text-joyful-purple group-hover:text-joyful-pink transition-colors duration-300" />
                  </div>
                  <div className="font-fun text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="font-body text-gray-600 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-joyful-bg via-white to-purple-50 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-3 h-3 bg-joyful-yellow rounded-full animate-float opacity-60"></div>
            <div className="absolute bottom-32 left-20 w-2 h-2 bg-joyful-orange rounded-full animate-float-delayed opacity-70"></div>
            
            <div className="absolute -z-10 top-1/4 right-1/4 w-[300px] h-[300px] bg-joyful-purple/10 rounded-full blur-3xl animate-pulse-gentle"></div>
            <div className="absolute -z-10 bottom-1/4 left-1/4 w-[250px] h-[250px] bg-joyful-blue/10 rounded-full blur-3xl animate-pulse-gentle animation-delay-1000"></div>
          </div>

          <div className="container max-w-6xl mx-auto px-4 relative z-10">
            <h2 className="font-fun text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
              Why Teach with 
              <span className="bg-gradient-to-r from-joyful-purple via-joyful-pink to-joyful-orange bg-clip-text text-transparent"> Engleuphoria? ✨</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
              {benefits.map((benefit, index) => (
                <Card key={index} className="group text-center hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                  <CardHeader className="pt-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-joyful-purple/20 to-joyful-pink/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="h-8 w-8 text-joyful-purple group-hover:text-joyful-pink transition-colors duration-300" />
                    </div>
                    <CardTitle className="font-fun text-xl sm:text-2xl group-hover:text-joyful-purple transition-colors duration-300">{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-8">
                    <p className="font-body text-gray-600 text-base sm:text-lg leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-white via-joyful-bg to-emerald-50 relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-3 h-3 bg-joyful-yellow rounded-full animate-float opacity-60"></div>
            <div className="absolute bottom-32 right-20 w-2 h-2 bg-joyful-orange rounded-full animate-float-delayed opacity-70"></div>
            
            <div className="absolute -z-10 top-1/4 left-1/4 w-[300px] h-[300px] bg-joyful-purple/10 rounded-full blur-3xl animate-pulse-gentle"></div>
            <div className="absolute -z-10 bottom-1/4 right-1/4 w-[250px] h-[250px] bg-joyful-blue/10 rounded-full blur-3xl animate-pulse-gentle animation-delay-1000"></div>
          </div>

          <div className="container max-w-5xl mx-auto px-4 relative z-10">
            <h2 className="font-fun text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">
              <span className="bg-gradient-to-r from-joyful-purple via-joyful-pink to-joyful-orange bg-clip-text text-transparent"> Requirements 📋</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
              <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="pt-8">
                  <CardTitle className="font-fun text-2xl sm:text-3xl text-joyful-purple">✅ Essential Requirements</CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <ul className="space-y-4 font-body text-gray-600 text-lg">
                    <li className="flex items-start"><span className="text-joyful-purple mr-3">•</span> Native or fluent English speaker</li>
                    <li className="flex items-start"><span className="text-joyful-purple mr-3">•</span> Bachelor's degree (any field)</li>
                    <li className="flex items-start"><span className="text-joyful-purple mr-3">•</span> Reliable internet connection</li>
                    <li className="flex items-start"><span className="text-joyful-purple mr-3">•</span> Quiet teaching environment</li>
                    <li className="flex items-start"><span className="text-joyful-purple mr-3">•</span> Professional attitude and appearance</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-2xl transition-all duration-500 hover:scale-105 border-0 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader className="pt-8">
                  <CardTitle className="font-fun text-2xl sm:text-3xl text-joyful-pink">⭐ Preferred Qualifications</CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <ul className="space-y-4 font-body text-gray-600 text-lg">
                    <li className="flex items-start"><span className="text-joyful-pink mr-3">•</span> TEFL/TESOL certification</li>
                    <li className="flex items-start"><span className="text-joyful-pink mr-3">•</span> Teaching experience</li>
                    <li className="flex items-start"><span className="text-joyful-pink mr-3">•</span> Experience with online platforms</li>
                    <li className="flex items-start"><span className="text-joyful-pink mr-3">•</span> Additional language skills</li>
                    <li className="flex items-start"><span className="text-joyful-pink mr-3">•</span> Specialized subject expertise</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-joyful-purple via-joyful-pink to-joyful-orange relative overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-4 h-4 bg-white/30 rounded-full animate-float opacity-80"></div>
            <div className="absolute top-32 right-20 w-3 h-3 bg-joyful-yellow/50 rounded-full animate-float-delayed opacity-90"></div>
            <div className="absolute bottom-20 left-20 w-5 h-5 bg-white/20 rounded-full animate-float opacity-70"></div>
          </div>

          <div className="container max-w-5xl mx-auto px-4 text-center relative z-10">
            <h2 className="font-fun text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
              Ready to Start 
              <span className="text-joyful-yellow animate-text-shine"> Teaching? 🚀</span>
            </h2>
            <p className="font-body text-xl sm:text-2xl text-white/90 mb-10 leading-relaxed">
              Join our community of passionate educators and start making a difference today. ✨
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate("/teacher-application")}
              className="group bg-white text-joyful-purple hover:bg-white/90 font-bold text-xl px-12 py-5 rounded-full hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              🎓 Apply Now
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ForTeachers;