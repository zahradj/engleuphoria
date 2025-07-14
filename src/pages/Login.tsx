
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"student" | "teacher" | "admin">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();
  const { signIn, isConfigured } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!email || !password) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (!isConfigured) {
      // Fallback to localStorage simulation for demo mode
      setTimeout(() => {
        // Store user data in localStorage with email
        localStorage.setItem("mockUserEmail", email);
        
        if (userType === "student") {
          localStorage.setItem("studentName", email.split("@")[0]);
          localStorage.setItem("points", "50");
          localStorage.setItem("userType", "student");
          
          toast({
            title: "Welcome back!",
            description: "Successfully logged into your student dashboard",
          });
          
          navigate("/dashboard");
        } else if (userType === "teacher") {
          localStorage.setItem("teacherName", email.split("@")[0]);
          localStorage.setItem("teacherId", "teacher-" + Date.now());
          localStorage.setItem("userType", "teacher");
          
          toast({
            title: "Welcome back!",
            description: "Successfully logged into your teacher dashboard",
          });
          
          navigate("/teacher-dashboard");
        } else if (userType === "admin") {
          // Special handling for your admin email
          if (email === "f.zahra.djaanine@engleuphoria.com") {
            localStorage.setItem("adminName", "Fatima Zahra Djaanine");
            toast({
              title: "Admin access granted",
              description: "Welcome Fatima! Successfully logged into the admin dashboard",
            });
          } else {
            localStorage.setItem("adminName", email.split("@")[0]);
            toast({
              title: "Admin access granted",
              description: "Successfully logged into the admin dashboard",
            });
          }
          localStorage.setItem("userType", "admin");
          navigate("/admin-dashboard");
        }
        setIsLoading(false);
      }, 1500);
      return;
    }

    try {
      const { data, error } = await signIn(email, password);

      if (error) {
        if (error.message?.includes('Email not confirmed')) {
          toast({
            title: "Email not confirmed",
            description: "Please check your email and click the confirmation link before signing in.",
            variant: "destructive",
          });
        } else if (error.message?.includes('Invalid login credentials')) {
          toast({
            title: "Invalid credentials",
            description: "Please check your email and password and try again.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Sign in failed",
            description: error.message || "Please try again",
            variant: "destructive",
          });
        }
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account",
        });
        
        // Wait a bit for user profile to be fetched, then redirect
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <AnimatedBackground />
      
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-purple-600"
        >
          ← Back to Home
        </Button>
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm border-0 animate-fade-in">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {languageText.welcomeBack || 'Welcome Back'}
            </CardTitle>
            <p className="text-gray-600 mt-2">{languageText.signInToContinue || 'Sign in to continue your learning journey'}</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">{languageText.email || 'Email'}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={languageText.enterYourEmail || 'Enter your email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">{languageText.password || 'Password'}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={languageText.enterYourPassword || 'Enter your password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">{languageText.iAmA || 'I am a'}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={userType === "student" ? "default" : "outline"}
                    onClick={() => setUserType("student")}
                    className="h-12 text-sm"
                  >
                    {languageText.student || 'Student'}
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "teacher" ? "default" : "outline"}
                    onClick={() => setUserType("teacher")}
                    className="h-12 text-sm"
                  >
                    {languageText.teacher || 'Teacher'}
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "admin" ? "default" : "outline"}
                    onClick={() => setUserType("admin")}
                    className="h-12 text-sm"
                  >
                    Admin
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : (languageText.signIn || 'Sign In')}
              </Button>
            </form>

            <div className="text-center space-y-2">
              <Button variant="link" className="text-sm text-purple-600 hover:text-purple-700">
                {languageText.forgotPassword || 'Forgot password?'}
              </Button>
              <p className="text-gray-600 text-sm">
                {languageText.dontHaveAccount || "Don't have an account?"}{" "}
                <Button 
                  variant="link" 
                  onClick={() => navigate("/signup")} 
                  className="p-0 h-auto text-purple-600 hover:text-purple-700 font-semibold"
                >
                  {languageText.signUp || 'Sign Up'}
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
