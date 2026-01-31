import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, GraduationCap, Loader2 } from "lucide-react";
import { ProgressIndicator } from "@/components/navigation/ProgressIndicator";
import { BackNavigation } from "@/components/navigation/BackNavigation";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const TeacherSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUp, isConfigured, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Sign out existing user when accessing signup page
  useEffect(() => {
    if (!loading && user) {
      setIsSigningOut(true);
      console.log('Existing user detected on teacher signup page, signing out...');
      supabase.auth.signOut().then(() => {
        console.log('Previous session cleared for new teacher signup');
        setIsSigningOut(false);
      });
    }
  }, [user, loading]);

  const stepLabels = ['Create Account', 'Complete Application'];

  // Show loading while signing out existing user
  if (isSigningOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-emerald-600" />
          <p className="text-gray-600 text-lg">Preparing signup...</p>
        </div>
      </div>
    );
  }
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    if (!isConfigured) {
      // Demo mode fallback
      localStorage.setItem('teacherName', values.fullName);
      localStorage.setItem('userType', 'teacher');
      localStorage.setItem('teacherEmail', values.email);
      
      toast({
        title: "🎓 Teacher Account Created!",
        description: "Welcome! Please complete your application to start teaching.",
      });
      
      setIsLoading(false);
      navigate("/teacher-application");
      return;
    }

    try {
      const { data, error } = await signUp(values.email, values.password, {
        role: 'teacher'
      } as any);

      if (error) {
        toast({
          title: "Sign up failed",
          description: error.message || "Please try again",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      if (data?.user) {
        // Verify profile was created, if not create it manually (fallback for trigger failures)
        const { data: existingProfile } = await supabase
          .from('users')
          .select('id')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (!existingProfile) {
          console.log('Trigger failed to create teacher profile, creating manually...');
          
          await supabase.from('users').insert({
            id: data.user.id,
            email: values.email,
            full_name: values.fullName,
            role: 'teacher'
          });
          
          await supabase.from('user_roles').insert({
            user_id: data.user.id,
            role: 'teacher'
          });
          
          console.log('Manually created teacher profile for:', values.email);
        }

        toast({
          title: "🎓 Teacher Account Created!",
          description: "Welcome! Please complete your application to start teaching.",
          duration: 5000,
        });
        
        // Send welcome email (non-blocking)
        supabase.functions.invoke('send-user-emails', {
          body: {
            to: values.email,
            type: 'teacher-welcome',
            data: {
              userName: values.fullName,
              baseUrl: window.location.origin
            }
          }
        }).then(({ error }) => {
          if (error) console.error('Failed to send welcome email:', error);
        });
        
        // Redirect to teacher application
        navigate("/teacher-application");
      }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordRequirements = [
    { met: form.watch("password")?.length >= 6, text: "At least 6 characters" },
    { met: /[A-Z]/.test(form.watch("password") || ""), text: "One uppercase letter" },
    { met: /[0-9]/.test(form.watch("password") || ""), text: "One number" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          <BackNavigation to="/signup" label="Back to Sign Up Options" className="mb-4" />
          
          <ProgressIndicator 
            currentStep={1} 
            totalSteps={2} 
            stepLabels={stepLabels}
          />
          
          <Card className="w-full p-6 shadow-2xl relative overflow-hidden bg-white/95 backdrop-blur-sm animate-fade-in">
            {/* Card inner glow effects */}
            <div className="absolute -z-10 top-0 left-0 w-[80%] h-[80%] bg-emerald/10 rounded-full blur-2xl"></div>
            <div className="absolute -z-10 bottom-0 right-0 w-[60%] h-[60%] bg-blue/5 rounded-full blur-2xl"></div>
          
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-full flex items-center justify-center">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Join Our Teaching Team
              </h2>
              <p className="text-muted-foreground">Create your teacher account and start making a difference</p>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Full Name</FormLabel>
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
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
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
                      <FormLabel className="text-sm font-medium">Password</FormLabel>
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
                
                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : 'Create Teacher Account'}
                </Button>
              </form>
            </Form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-semibold text-emerald-600 hover:text-emerald-700" 
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignUp;