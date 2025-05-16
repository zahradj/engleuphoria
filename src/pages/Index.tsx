import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarSelection } from "@/components/AvatarSelection";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Video } from "lucide-react";

const Index = () => {
  const [step, setStep] = useState<"welcome" | "login" | "avatar">("welcome");
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | undefined>(undefined);
  
  const navigate = useNavigate();
  
  const handleStart = () => {
    setStep("login");
  };
  
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setStep("avatar");
    }
  };
  
  const handleAvatarSelect = (avatar: { id: number }) => {
    setSelectedAvatar(avatar.id);
  };
  
  const handleComplete = () => {
    // In a real app, we'd save this info to a backend
    localStorage.setItem("studentName", name);
    localStorage.setItem("avatarId", String(selectedAvatar));
    localStorage.setItem("points", "50"); // Starting points
    
    navigate("/dashboard");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-3 px-4">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-purple/20 rounded-full p-2">
              <span className="text-xl font-bold text-purple">E!</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
              Engleuphoria
            </h1>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/for-parents')}>For Parents</Button>
            <Button variant="ghost" onClick={() => navigate('/for-teachers')}>For Teachers</Button>
            <Button variant="outline" onClick={() => navigate('/login')}>Log In</Button>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-8">
        {step === "welcome" && (
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
                  Learn English
                </span> in a Fun & Creative Way!
              </h1>
              
              <p className="text-lg mb-6 text-muted-foreground">
                Engleuphoria is a vibrant and engaging online learning platform designed for children aged 5–12 to learn English through play and creative activities.
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <Card className="p-4 flex items-center gap-3 w-full sm:w-auto">
                  <div className="bg-purple/20 p-2 rounded-full">
                    <Video className="text-purple h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Interactive Classes</h3>
                    <p className="text-sm text-muted-foreground">Live video lessons with teachers</p>
                  </div>
                </Card>
                
                <Card className="p-4 flex items-center gap-3 w-full sm:w-auto">
                  <div className="bg-teal/20 p-2 rounded-full">
                    <BookOpen className="text-teal h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Fun Activities</h3>
                    <p className="text-sm text-muted-foreground">Games, quizzes, and stories</p>
                  </div>
                </Card>
                
                <Card className="p-4 flex items-center gap-3 w-full sm:w-auto">
                  <div className="bg-orange/20 p-2 rounded-full">
                    <Users className="text-orange h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold">Community</h3>
                    <p className="text-sm text-muted-foreground">Learn with friends</p>
                  </div>
                </Card>
              </div>
              
              <Button size="lg" onClick={handleStart} className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 relative">
              <div className="animate-float bg-gradient-to-br from-purple-light to-teal-light p-6 rounded-2xl shadow-lg">
                <img 
                  src="/lovable-uploads/af8673d3-cab8-4146-877f-42241ec01b4b.png"
                  alt="3D learning illustration with books, headphones, and education elements"
                  className="rounded-lg w-full max-w-none mx-auto object-contain h-[500px]"
                />
              </div>
              <div className="absolute -top-4 -right-4 bg-yellow/90 text-yellow-dark font-bold px-4 py-2 rounded-full animate-pulse-subtle">
                Join now!
              </div>
            </div>
          </div>
        )}
        
        {step === "login" && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Welcome to Engleuphoria!</h2>
              <p className="text-muted-foreground">Let's start with your name</p>
            </div>
            
            <Card className="p-6">
              <form onSubmit={handleNameSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      What's your name?
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="text-lg"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Continue
                  </Button>
                </div>
              </form>
            </Card>
            
            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={() => setStep("welcome")}>
                Go Back
              </Button>
            </div>
          </div>
        )}
        
        {step === "avatar" && (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold mb-2">Choose Your Avatar</h2>
              <p className="text-muted-foreground">Pick a character to represent you</p>
            </div>
            
            <Card className="p-6">
              <AvatarSelection
                onSelect={handleAvatarSelect}
                selectedAvatarId={selectedAvatar}
              />
              
              <div className="mt-6">
                <Button
                  className="w-full"
                  onClick={handleComplete}
                  disabled={selectedAvatar === undefined}
                >
                  Start Learning
                </Button>
              </div>
            </Card>
            
            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={() => setStep("login")}>
                Go Back
              </Button>
            </div>
          </div>
        )}
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
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/for-parents');
                }}
              >
                For Parents
              </a>
              <a 
                href="#" 
                className="text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/for-teachers');
                }}
              >
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

export default Index;
