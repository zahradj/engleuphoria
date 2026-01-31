import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, BookOpen, Loader2 } from "lucide-react";
import { ProgressIndicator } from "@/components/navigation/ProgressIndicator";
import { AuthPageLayout } from "@/components/auth/AuthPageLayout";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  age: z.number().min(5).max(18, { message: "Age must be between 5 and 18" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const StudentSignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signUp, isConfigured, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [hasInitiatedSignOut, setHasInitiatedSignOut] = useState(false);

  // Sign out existing user when accessing signup page
  // Use hasInitiatedSignOut flag to prevent infinite loops
  useEffect(() => {
    if (!loading && user && !hasInitiatedSignOut) {
      setHasInitiatedSignOut(true);
      setIsSigningOut(true);
      console.log('Existing user detected on student signup page, signing out...');
      supabase.auth.signOut().finally(() => {
        console.log('Previous session cleared for new student signup');
        setIsSigningOut(false);
      });
    }
  }, [user, loading, hasInitiatedSignOut]);

  const stepLabels = ['Create Account', 'Learning Profile'];

  // Show loading while auth context is initializing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-violet-600" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show loading while signing out existing user
  if (isSigningOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-pink-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-violet-600" />
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
      age: 10,
      password: "",
      confirmPassword: "",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    if (!isConfigured) {
      // Demo mode fallback
      localStorage.setItem('studentName', values.fullName);
      localStorage.setItem('userType', 'student');
      localStorage.setItem('studentEmail', values.email);
      localStorage.setItem('studentAge', values.age.toString());
      localStorage.setItem('points', '50');
      
      toast({
        title: "🎓 Student Account Created!",
        description: "Welcome! Let's set up your learning journey.",
      });
      
      setIsLoading(false);
      navigate("/student-application");
      return;
    }

    try {
      const { data, error } = await signUp(values.email, values.password, {
        role: 'student'
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
          console.log('Trigger failed to create student profile, creating manually...');
          
          // Determine system tag based on age
          const systemTag = values.age >= 4 && values.age <= 10 ? 'KIDS' 
                          : values.age >= 11 && values.age <= 17 ? 'TEENS' 
                          : 'ADULTS';
          
          await supabase.from('users').insert({
            id: data.user.id,
            email: values.email,
            full_name: values.fullName,
            role: 'student',
            current_system: systemTag
          });
          
          await supabase.from('user_roles').insert({
            user_id: data.user.id,
            role: 'student'
          });
          
          console.log('Manually created student profile for:', values.email);
        }

        toast({
          title: "🎓 Student Account Created!",
          description: "Welcome! Let's set up your personalized learning journey.",
          duration: 5000,
        });
        
        // Store additional student data in localStorage temporarily
        localStorage.setItem('studentAge', values.age.toString());
        localStorage.setItem('studentName', values.fullName);

        // Send welcome email (non-blocking)
        supabase.functions.invoke('send-user-emails', {
          body: {
            to: values.email,
            type: 'student-welcome',
            data: {
              userName: values.fullName,
              baseUrl: window.location.origin
            }
          }
        }).then(({ error }) => {
          if (error) console.error('Failed to send welcome email:', error);
        });

        // Send admin notification email (non-blocking)
        supabase.functions.invoke('notify-admin-new-student', {
          body: {
            record: {
              id: data.user.id,
              email: values.email,
              full_name: values.fullName,
              role: 'student'
            }
          }
        }).then(({ error }) => {
          if (error) console.error('Failed to send admin notification:', error);
        });
        
        // Redirect to student application
        navigate("/student-application");
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

  const progressIndicator = (
    <ProgressIndicator 
      currentStep={1} 
      totalSteps={2} 
      stepLabels={stepLabels}
    />
  );

  return (
    <AuthPageLayout
      title="Start Learning English"
      subtitle="Create your student account and begin your learning journey"
      icon={BookOpen}
      variant="student"
      backLink={{ to: '/signup', label: 'Back to Sign Up Options' }}
      showProgress={progressIndicator}
    >
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
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Age</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="5" 
                          max="18" 
                          placeholder="Your age" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                          className="h-11" 
                        />
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
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white transition-all duration-200"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : 'Create Student Account'}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300" 
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </p>
      </div>
    </AuthPageLayout>
  );
};

export default StudentSignUp;
