
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
  const [userType, setUserType] = useState<"student" | "teacher">("student");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: languageText.error,
        description: languageText.pleaseEnterEmailAndPassword,
        variant: "destructive",
      });
      return;
    }

    if (userType === "teacher") {
      const teacherName = email.split("@")[0];
      localStorage.setItem("teacherName", teacherName);
      localStorage.setItem("userType", "teacher");
      toast({
        title: languageText.loginSuccessful,
        description: `${languageText.welcomeBack} ${teacherName}!`,
      });
      navigate("/");
    } else {
      const studentName = email.split("@")[0];
      localStorage.setItem("studentName", studentName);
      localStorage.setItem("userType", "student");
      localStorage.setItem("points", "50");
      toast({
        title: languageText.loginSuccessful,
        description: `${languageText.welcomeBack} ${studentName}!`,
      });
      navigate("/student-dashboard");
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
            <form onSubmit={handleLogin} className="space-y-4">
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
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={userType === "student" ? "default" : "outline"}
                    onClick={() => setUserType("student")}
                    className="h-12"
                  >
                    {languageText.student}
                  </Button>
                  <Button
                    type="button"
                    variant={userType === "teacher" ? "default" : "outline"}
                    onClick={() => setUserType("teacher")}
                    className="h-12"
                  >
                    {languageText.teacher}
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
