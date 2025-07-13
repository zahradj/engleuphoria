import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, BookOpen } from "lucide-react";
import { ProgressIndicator } from "@/components/navigation/ProgressIndicator";
import { BackNavigation } from "@/components/navigation/BackNavigation";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
  userType: z.enum(["teacher", "student", "admin"], { 
    required_error: "Please select a user type" 
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const SignUpForm = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'teacher' | 'student') => {
    if (role === 'teacher') {
      navigate('/teacher-signup');
    } else if (role === 'student') {
      navigate('/student-signup');
    }
  };
  

  return (
    <div className="w-full max-w-md mx-auto">
      <BackNavigation to="/" label="Back to Home" className="mb-4" />
      
      <Card className="w-full p-6 shadow-2xl relative overflow-hidden bg-white/95 backdrop-blur-sm animate-fade-in">
        {/* Card inner glow effects */}
        <div className="absolute -z-10 top-0 left-0 w-[80%] h-[80%] bg-purple/10 rounded-full blur-2xl"></div>
        <div className="absolute -z-10 bottom-0 right-0 w-[60%] h-[60%] bg-teal/5 rounded-full blur-2xl"></div>
      
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Join Engleuphoria
          </h2>
          <p className="text-muted-foreground">Choose how you'd like to get started</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={() => handleRoleSelection('student')}
            className="w-full h-16 text-left bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 border border-blue-200 text-gray-800"
            variant="outline"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">I'm a Student</div>
                <div className="text-sm text-muted-foreground">Start your English learning journey</div>
              </div>
            </div>
          </Button>
          
          <Button 
            onClick={() => handleRoleSelection('teacher')}
            className="w-full h-16 text-left bg-gradient-to-r from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 border border-emerald-200 text-gray-800"
            variant="outline"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold text-lg">I'm a Teacher</div>
                <div className="text-sm text-muted-foreground">Join our teaching community</div>
              </div>
            </div>
          </Button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto font-semibold text-purple-600 hover:text-purple-700" 
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
};
