
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AvatarSelection } from "@/components/AvatarSelection";
import { Card } from "@/components/ui/card";
import { ArrowRight, BookOpen, Users, Video, Award, MessageCircle, Globe, CheckCircle } from "lucide-react";

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
          <>
            <div className="flex flex-col-reverse md:flex-row gap-8 items-center">
              <div className="flex-1 md:max-w-[40%]">
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
              
              <div className="flex-1 md:flex-grow md:max-w-[60%] relative">
                {/* Background gradient effect with blur animation */}
                <div className="absolute -z-10 -inset-1 bg-gradient-to-r from-purple/20 to-teal/20 blur-xl rounded-3xl animate-blur-fade"></div>
                {/* Background shadow effect with fade animation */}
                <div className="absolute inset-0 -translate-x-6 -translate-y-6 bg-purple/20 rounded-3xl transform -rotate-3 animate-pulse-subtle transition-opacity duration-700"></div>
                <div className="absolute inset-0 translate-x-6 translate-y-6 bg-teal/20 rounded-3xl transform rotate-3 animate-pulse-subtle transition-opacity duration-700 delay-300"></div>
                
                <div className="relative z-10">
                  <img 
                    src="/lovable-uploads/94b3a265-e3c7-4819-9be4-de2aa5cdc590.png"
                    alt="3D learning illustration with educational elements"
                    className="w-full h-auto object-contain mx-auto max-h-[800px]"
                  />
                </div>
                <div className="absolute -top-4 -right-4 bg-yellow/90 text-yellow-dark font-bold px-4 py-2 rounded-full animate-pulse-subtle z-20">
                  Join now!
                </div>
              </div>
            </div>
            
            {/* Features Section */}
            <section className="py-16 border-t border-border mt-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">Why Choose Engleuphoria?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our playful approach to language learning creates an immersive environment where children naturally absorb English vocabulary, grammar, and pronunciation.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                  <div className="bg-purple/20 p-4 rounded-full mb-4">
                    <Video className="h-8 w-8 text-purple" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Interactive Classes</h3>
                  <p className="text-muted-foreground">Engage in live, interactive sessions led by certified teachers who make learning fun.</p>
                </Card>
                
                <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                  <div className="bg-teal/20 p-4 rounded-full mb-4">
                    <Award className="h-8 w-8 text-teal" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Reward System</h3>
                  <p className="text-muted-foreground">Earn points and unlock achievements to stay motivated throughout your learning journey.</p>
                </Card>
                
                <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                  <div className="bg-orange/20 p-4 rounded-full mb-4">
                    <MessageCircle className="h-8 w-8 text-orange" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Practice Speaking</h3>
                  <p className="text-muted-foreground">Develop confidence through conversation practice in a supportive environment.</p>
                </Card>
                
                <Card className="p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                  <div className="bg-yellow/20 p-4 rounded-full mb-4">
                    <Globe className="h-8 w-8 text-yellow-dark" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Cultural Learning</h3>
                  <p className="text-muted-foreground">Discover cultures from around the world while improving your language skills.</p>
                </Card>
              </div>
            </section>
            
            {/* How It Works Section */}
            <section className="py-16 border-t border-border">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">How It Works</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Getting started with Engleuphoria is easy and fun!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
                  <p className="text-muted-foreground">Sign up and choose your favorite avatar to start your adventure.</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-teal w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-bold mb-2">Join Classes & Activities</h3>
                  <p className="text-muted-foreground">Participate in live classes and complete fun learning activities.</p>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className="bg-orange w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-bold mb-2">Track Progress</h3>
                  <p className="text-muted-foreground">Watch your English skills improve as you earn points and badges.</p>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <Button size="lg" onClick={handleStart} className="gap-2">
                  Start Learning Today <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </section>
            
            {/* Testimonials Section */}
            <section className="py-16 border-t border-border">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">What Parents Say</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Don't just take our word for it - hear from our happy families!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple/20 w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="font-bold text-purple">SM</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Sarah M.</h4>
                      <p className="text-sm text-muted-foreground">Parent of 8-year-old</p>
                    </div>
                  </div>
                  <p className="italic">"My daughter used to be shy about speaking English. After three months with Engleuphoria, she's constantly practicing and even teaching her younger brother!"</p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-teal/20 w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="font-bold text-teal">JT</span>
                    </div>
                    <div>
                      <h4 className="font-bold">James T.</h4>
                      <p className="text-sm text-muted-foreground">Parent of 6-year-old twins</p>
                    </div>
                  </div>
                  <p className="italic">"The gamification is brilliant! My boys are so competitive with the points system that they're learning without even realizing it."</p>
                </Card>
                
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-orange/20 w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="font-bold text-orange">LR</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Lisa R.</h4>
                      <p className="text-sm text-muted-foreground">Parent of 10-year-old</p>
                    </div>
                  </div>
                  <p className="italic">"The teachers are exceptional - so patient and encouraging. My son's confidence in English has improved dramatically in just a few weeks."</p>
                </Card>
              </div>
            </section>
            
            {/* CTA Section */}
            <section className="py-12 my-8 bg-gradient-to-r from-purple/20 to-teal/20 rounded-2xl">
              <div className="text-center px-4">
                <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Child's English Adventure?</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto">
                  Join thousands of families who've discovered the joy of learning English with Engleuphoria.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg" onClick={handleStart} className="gap-2 bg-purple hover:bg-purple/90">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => navigate('/for-parents')}>
                    Learn More
                  </Button>
                </div>
              </div>
            </section>
          </>
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
