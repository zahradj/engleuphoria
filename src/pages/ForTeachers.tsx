
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Video, Users } from "lucide-react";

const ForTeachers = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col">
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
      
      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
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
            <Card>
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
            
            <Card>
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
            
            <Card className="md:col-span-2">
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

export default ForTeachers;
