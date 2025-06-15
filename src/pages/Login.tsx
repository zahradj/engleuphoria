
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { AnimatedBackground } from "@/components/AnimatedBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"student" | "teacher" | "admin">("student");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && password) {
      // Store user data in localStorage
      if (userType === "student") {
        localStorage.setItem("studentName", email.split("@")[0]);
        localStorage.setItem("points", "50");
        localStorage.setItem("userType", "student");
        
        toast({
          title: "Login successful!",
          description: "Welcome to your student dashboard",
        });
        
        navigate("/student-dashboard");
      } else if (userType === "teacher") {
        localStorage.setItem("teacherName", email.split("@")[0]);
        localStorage.setItem("userType", "teacher");
        
        toast({
          title: "Login successful!",
          description: "Welcome to your teacher dashboard",
        });
        
        navigate("/teacher-dashboard");
      } else if (userType === "admin") {
        localStorage.setItem("adminName", email.split("@")[0]);
        localStorage.setItem("userType", "admin");
        
        toast({
          title: "Admin login successful!",
          description: "Welcome to the admin dashboard",
        });
        
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    } else {
      toast({
        title: "Please fill in all fields",
        description: "Email and password are required",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <AnimatedBackground />
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {languageText.welcomeBack}
            </CardTitle>
            <p className="text-gray-600 mt-2">{languageText.signInToContinue}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{languageText.email}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={languageText.enterYourEmail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{languageText.password}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder={languageText.enterYourPassword}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label>{languageText.iAmA}</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    type="button"
                    variant={userType === "student" ? "default" : "outline"}
                    onClick={() => setUserType("student")}
                    className="h-12 text-sm"
                  >
                    {languageText.student}
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "teacher" ? "default" : "outline"}
                    onClick={() => setUserType("teacher")}
                    className="h-12 text-sm"
                  >
                    {languageText.teacher}
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

              <Button type="submit" className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                {languageText.signIn}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-gray-600">
                {languageText.dontHaveAccount}{" "}
                <Button variant="link" onClick={() => navigate("/signup")} className="p-0 h-auto text-purple-600 hover:text-purple-700">
                  {languageText.signUp}
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
