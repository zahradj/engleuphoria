
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, Users, Cube, Sphere } from "lucide-react";
import { ThreeDShapes } from "@/components/ThreeDShapes";
import { FloatingShapes } from "@/components/FloatingShapes";
import { WavingBackground } from "@/components/WavingBackground";

const ForParents = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <WavingBackground />
      
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-3 px-4">
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
      
      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 relative">
        <FloatingShapes className="absolute inset-0 z-0" />
        
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Watch Your Child's English Skills 
            <span className="bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
              {" "}Flourish
            </span>
          </h1>
          
          <div className="w-full mb-8">
            <ThreeDShapes className="rounded-xl border shadow-md" />
          </div>
          
          <p className="text-lg mb-8 text-muted-foreground">
            Engleuphoria gives parents visibility into their child's learning journey with detailed progress tracking, 
            milestone celebrations, and easy communication with teachers.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
              <CardHeader>
                <div className="bg-purple/20 w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <BookOpen className="text-purple h-6 w-6" />
                </div>
                <CardTitle>Progress Tracking</CardTitle>
                <CardDescription>
                  Follow your child's learning journey with detailed progress reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our intuitive dashboard shows which skills your child is mastering and where they might need additional support.
                </p>
              </CardContent>
            </Card>
            
            <Card className="transition-all hover:shadow-lg hover:scale-[1.02] duration-300">
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
                  Ask questions, receive updates, and participate in your child's language learning journey.
                </p>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 transition-all hover:shadow-lg hover:scale-[1.01] duration-300">
              <CardHeader>
                <div className="bg-yellow/20 w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <GraduationCap className="text-yellow-dark h-6 w-6" />
                </div>
                <CardTitle>Supportive Learning Environment</CardTitle>
                <CardDescription>
                  Designed to nurture confidence and foster a love for language
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our curriculum balances fun activities with structured learning, ensuring your child builds fundamental language skills while enjoying every moment.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button size="lg" onClick={() => navigate('/signup')} className="gap-2">
              Join Engleuphoria Today
            </Button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-6">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="text-xl font-bold bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
                Engleuphoria
              </div>
              <p className="text-sm text-muted-foreground">
                Making English learning joyful and effective
              </p>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground">
                About Us
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                For Parents
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                For Teachers
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Engleuphoria. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ForParents;
