
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, Users } from "lucide-react";

const ForTeachers = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-3 px-4 relative z-10">
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
            <Button variant="ghost" onClick={() => navigate('/for-parents')}>
              For Parents
            </Button>
            <Button variant="ghost" className="font-semibold" onClick={() => navigate('/for-teachers')}>
              For Teachers
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')}>Log In</Button>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
          </div>
        </div>
      </header>
      
      {/* Background circular effects for the entire page */}
      <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/20 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
      <div className="absolute -z-10 bottom-1/3 right-1/4 w-[90%] h-[90%] bg-teal/15 rounded-full blur-3xl animate-pulse-subtle opacity-65 animation-delay-300"></div>
      <div className="absolute -z-10 top-1/2 left-1/2 w-[80%] h-[80%] bg-orange/10 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-700"></div>
      
      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8 relative z-10">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">
            Powerful Tools to Make
            <span className="bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
              {" "}Teaching English{" "}
            </span>
            Delightful
          </h1>
          
          <p className="text-lg mb-8 text-muted-foreground">
            Engleuphoria empowers teachers with intuitive tools for engaging, interactive lessons.
            Spend less time on lesson planning and more time inspiring your students.
          </p>
          
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="relative overflow-hidden">
              {/* Card inner glow effects */}
              <div className="absolute -z-10 top-0 left-0 w-[80%] h-[80%] bg-purple/10 rounded-full blur-2xl"></div>
              
              <CardHeader>
                <div className="bg-purple/20 w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <Video className="text-purple h-6 w-6" />
                </div>
                <CardTitle>Interactive Video Classes</CardTitle>
                <CardDescription>
                  Teach with engaging tools built for young learners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our custom video platform offers whiteboard integration, breakout rooms, fun reactions, and child-friendly controls.
                </p>
              </CardContent>
            </Card>
            
            <Card className="relative overflow-hidden">
              {/* Card inner glow effects */}
              <div className="absolute -z-10 bottom-0 right-0 w-[80%] h-[80%] bg-teal/10 rounded-full blur-2xl"></div>
              
              <CardHeader>
                <div className="bg-teal/20 w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <BookOpen className="text-teal h-6 w-6" />
                </div>
                <CardTitle>Ready-Made Materials</CardTitle>
                <CardDescription>
                  Access our library of age-appropriate resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Browse hundreds of activities, worksheets, games and lesson plans designed by experienced ESL teachers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2 relative overflow-hidden">
              {/* Card inner glow effects */}
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-orange/10 rounded-full blur-2xl"></div>
              
              <CardHeader>
                <div className="bg-orange/20 w-12 h-12 flex items-center justify-center rounded-full mb-3">
                  <Users className="text-orange h-6 w-6" />
                </div>
                <CardTitle>Student Progress Analytics</CardTitle>
                <CardDescription>
                  Track achievements and identify areas for improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our comprehensive dashboard gives you insights into each student's progress, helping you tailor your teaching approach to individual needs.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-center">
            <Button size="lg" onClick={() => navigate('/signup')} className="gap-2">
              Join as a Teacher
            </Button>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-6 relative z-10">
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

export default ForTeachers;
