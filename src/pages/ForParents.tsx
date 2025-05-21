import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, BarChart, Award } from "lucide-react";

const ForParents = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-background">
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-4 px-4 sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="bg-purple/20 rounded-full p-2">
              <span className="text-xl font-bold text-purple">E!</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
              Engleuphoria
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="font-semibold" onClick={() => navigate('/for-parents')}>
              For Parents
            </Button>
            <Button variant="ghost" onClick={() => navigate('/for-teachers')}>
              For Teachers
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}>Log In</Button>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 container max-w-7xl mx-auto px-4 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-purple/10 rounded-full text-purple font-medium text-sm mb-2">
              For Parents
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Watch Your Child's English Skills 
              <span className="bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
                {" "}Flourish
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground">
              Engleuphoria gives parents visibility into their child's learning journey with detailed progress tracking, 
              milestone celebrations, and easy communication with teachers.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" onClick={() => navigate('/signup')} className="gap-2">
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/for-teachers')}>
                Learn More
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute -z-10 -inset-1 bg-gradient-to-r from-purple/20 to-teal/20 blur-xl rounded-3xl"></div>
            <img 
              src="/lovable-uploads/0629e331-727e-44d8-abdf-01f030c8a277.png" 
              alt="Book with speech bubbles showing language learning"
              className="w-full h-auto max-h-[500px] object-contain"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30 relative">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Offer Parents</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides everything you need to support your child's English learning journey.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-all hover:shadow-lg hover:scale-[1.02] duration-300 border-t-4 border-t-purple">
              <CardHeader>
                <div className="bg-purple/20 w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <BookOpen className="text-purple h-6 w-6" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Follow your child's learning journey in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our intuitive dashboard shows which skills your child is mastering and where they might need additional support, with detailed analytics and progress reports.
                </p>
              </CardContent>
            </Card>
            
            <Card className="transition-all hover:shadow-lg hover:scale-[1.02] duration-300 border-t-4 border-t-teal">
              <CardHeader>
                <div className="bg-teal/20 w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <Users className="text-teal h-6 w-6" />
                </div>
                <CardTitle>Teacher Communication</CardTitle>
                <CardDescription>
                  Direct messaging with your child's instructors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Ask questions, receive updates, and participate in your child's language learning journey with our secure communication platform.
                </p>
              </CardContent>
            </Card>
            
            <Card className="transition-all hover:shadow-lg hover:scale-[1.02] duration-300 border-t-4 border-t-yellow">
              <CardHeader>
                <div className="bg-yellow/20 w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <Award className="text-yellow-dark h-6 w-6" />
                </div>
                <CardTitle>Milestone Celebrations</CardTitle>
                <CardDescription>
                  Recognize and celebrate your child's achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Get notifications when your child reaches important milestones and achievements, helping to build confidence and motivation.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 container max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-8 border rounded-xl bg-white shadow-sm">
            <div className="text-4xl font-bold text-purple mb-2">95%</div>
            <p className="text-muted-foreground">Parents report improved English skills</p>
          </div>
          
          <div className="text-center p-8 border rounded-xl bg-white shadow-sm">
            <div className="text-4xl font-bold text-teal mb-2">87%</div>
            <p className="text-muted-foreground">Increase in confidence with language</p>
          </div>
          
          <div className="text-center p-8 border rounded-xl bg-white shadow-sm">
            <div className="text-4xl font-bold text-yellow-dark mb-2">12+</div>
            <p className="text-muted-foreground">Engaging activities per week</p>
          </div>
        </div>
      </section>
      
      {/* Testimonial */}
      <section className="py-16 bg-gradient-to-r from-purple/10 to-teal/10">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <svg className="w-12 h-12 mx-auto mb-6 text-muted-foreground/30" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-xl md:text-2xl font-medium mb-6">
              "Engleuphoria has transformed my daughter's approach to learning English. She's excited for her lessons and I can see her progress in real-time."
            </p>
            <div className="font-semibold">Rachel T.</div>
            <div className="text-sm text-muted-foreground">Parent of Sophie, 9 years old</div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 container max-w-7xl mx-auto px-4">
        <Card className="border-0 shadow-xl bg-gradient-to-r from-purple/80 to-teal/80 text-white">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Ready to Start Your Child's English Journey?</h2>
                <p className="mb-6 text-white/90">
                  Join thousands of families who have transformed their children's English learning experience with Engleuphoria.
                </p>
                <Button size="lg" variant="secondary" onClick={() => navigate('/signup')} className="gap-2">
                  Sign Up Now
                </Button>
              </div>
              <div className="hidden md:block">
                <BarChart className="h-48 w-48 mx-auto opacity-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple/20 rounded-full p-2">
                  <span className="text-xl font-bold text-purple">E!</span>
                </div>
                <div className="text-xl font-bold bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
                  Engleuphoria
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Making English learning joyful and effective for children worldwide.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Features</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Curriculum</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Resources</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">About Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Careers</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Blog</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Engleuphoria. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForParents;
