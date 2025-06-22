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
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from "lucide-react";

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
  const { toast } = useToast();
  const { languageText } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "student",
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    // Simulate account creation process
    setTimeout(() => {
      // Store user data based on type
      if (values.userType === "teacher") {
        localStorage.setItem('teacherName', values.name);
        localStorage.setItem('userType', 'teacher');
        localStorage.removeItem('studentName');
        localStorage.removeItem('adminName');
      } else if (values.userType === "student") {
        localStorage.setItem('studentName', values.name);
        localStorage.setItem('userType', 'student');
        localStorage.setItem('points', '50');
        localStorage.removeItem('teacherName');
        localStorage.removeItem('adminName');
      } else if (values.userType === "admin") {
        localStorage.setItem('adminName', values.name);
        localStorage.setItem('userType', 'admin');
        localStorage.removeItem('teacherName');
        localStorage.removeItem('studentName');
      }
      
      toast({
        title: "🎉 Account created successfully!",
        description: "Welcome to Engleuphoria! Please select your learning plan...",
      });
      
      // Redirect based on user type
      setTimeout(() => {
        if (values.userType === "teacher") {
          navigate("/teacher-dashboard");
        } else if (values.userType === "admin") {
          navigate("/admin-dashboard");
        } else {
          // For students, redirect to pricing selection
          navigate("/pricing-selection");
        }
      }, 1500);
      
      setIsLoading(false);
    }, 2000);
  };

  const passwordRequirements = [
    { met: form.watch("password")?.length >= 6, text: "At least 6 characters" },
    { met: /[A-Z]/.test(form.watch("password") || ""), text: "One uppercase letter" },
    { met: /[0-9]/.test(form.watch("password") || ""), text: "One number" },
  ];

  return (
    <Card className="w-full max-w-md p-6 shadow-2xl relative overflow-hidden bg-white/95 backdrop-blur-sm animate-fade-in">
      {/* Card inner glow effects */}
      <div className="absolute -z-10 top-0 left-0 w-[80%] h-[80%] bg-purple/10 rounded-full blur-2xl"></div>
      <div className="absolute -z-10 bottom-0 right-0 w-[60%] h-[60%] bg-teal/5 rounded-full blur-2xl"></div>
      
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          {languageText.createAccount || 'Create Account'}
        </h2>
        <p className="text-muted-foreground">Join our English learning community</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">{languageText.fullName || 'Full Name'}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="Your full name" {...field} className="pl-10 h-11" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">{languageText.email || 'Email'}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input placeholder="your.email@example.com" {...field} className="pl-10 h-11" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">{languageText.password || 'Password'}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••" 
                      {...field} 
                      className="pl-10 pr-10 h-11" 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
                
                {form.watch("password") && (
                  <div className="mt-2 space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <CheckCircle className={`h-3 w-3 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                        <span className={req.met ? 'text-green-600' : 'text-gray-400'}>{req.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="••••••" 
                      {...field} 
                      className="pl-10 pr-10 h-11" 
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-sm font-medium">{languageText.iAmA || 'I am a'}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-3"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="teacher" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">{languageText.teacher || 'Teacher'}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <RadioGroupItem value="student" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">{languageText.student || 'Student'}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border rounded-lg p-3 hover:bg-gray-50 transition-colors col-span-2">
                      <FormControl>
                        <RadioGroupItem value="admin" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">Admin</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : (languageText.signUp || 'Create Account')}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {languageText.alreadyHaveAccount || 'Already have an account?'}{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto font-semibold text-purple-600 hover:text-purple-700" 
            onClick={() => navigate('/login')}
          >
            {languageText.logIn || 'Log In'}
          </Button>
        </p>
      </div>
    </Card>
  );
};
