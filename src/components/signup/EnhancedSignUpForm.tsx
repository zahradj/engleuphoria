
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useClassroomAuth } from "@/hooks/useClassroomAuth";
import { useState } from "react";
import { Chrome, Mail, User, Lock, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  userType: z.enum(["parent", "teacher", "student", "admin"], { 
    required_error: "Please select a user type" 
  }),
});

export const EnhancedSignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();
  const { signUp } = useClassroomAuth();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      userType: "student",
    },
  });
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    
    try {
      // Map user types to supported roles
      let mappedRole: 'teacher' | 'student';
      if (values.userType === 'teacher' || values.userType === 'admin') {
        mappedRole = 'teacher';
      } else {
        // parent and student both map to student
        mappedRole = 'student';
      }

      console.log('SignUpForm: Attempting signup with:', { 
        email: values.email, 
        name: values.name, 
        originalType: values.userType, 
        mappedRole 
      });

      const result = await signUp(values.email, values.password, values.name, mappedRole);
      
      if (result.success) {
        toast({
          title: "Account created!",
          description: `Welcome to Engleuphoria, ${values.name}! Please check your email to verify your account.`,
        });
        
        // Redirect to login for verification
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        console.error('SignUpForm: Signup failed:', result.error);
        toast({
          title: "Signup Failed",
          description: result.error || "Failed to create account. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('SignUpForm: Unexpected error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        toast({
          title: "Google Sign Up Failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign up with Google. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-8 shadow-2xl bg-white/95 backdrop-blur-sm border-0 relative overflow-hidden">
      {/* Card decorative elements */}
      <div className="absolute -z-10 top-0 left-0 w-full h-2 bg-gradient-to-r from-purple to-teal"></div>
      <div className="absolute -z-10 top-0 left-0 w-[60%] h-[60%] bg-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute -z-10 bottom-0 right-0 w-[50%] h-[50%] bg-teal/5 rounded-full blur-3xl"></div>
      
      <div className="text-center mb-8">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple to-teal rounded-full flex items-center justify-center mb-4 shadow-lg">
          <User className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
          {languageText.createAccount}
        </h2>
        <p className="text-muted-foreground mt-2 text-lg">Join our English learning community</p>
      </div>

      {/* Google Sign Up Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full mb-6 h-12 text-lg font-medium border-2 hover:bg-gray-50 transition-all duration-200"
        onClick={handleGoogleSignUp}
        disabled={googleLoading || loading}
      >
        <Chrome className="w-5 h-5 mr-3 text-blue-500" />
        {googleLoading ? "Signing up with Google..." : "Sign up with Google"}
      </Button>

      <div className="relative mb-6">
        <Separator />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-4 text-muted-foreground text-sm">or continue with email</span>
        </div>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-medium">{languageText.fullName}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input 
                      placeholder="Your full name" 
                      className="pl-12 h-12 text-lg border-2 focus:border-purple transition-colors" 
                      {...field} 
                      disabled={loading || googleLoading} 
                    />
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
                <FormLabel className="text-lg font-medium">{languageText.email}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input 
                      placeholder="your.email@example.com" 
                      className="pl-12 h-12 text-lg border-2 focus:border-purple transition-colors" 
                      {...field} 
                      disabled={loading || googleLoading} 
                    />
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
                <FormLabel className="text-lg font-medium">{languageText.password}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input 
                      type="password" 
                      placeholder="Create a strong password" 
                      className="pl-12 h-12 text-lg border-2 focus:border-purple transition-colors" 
                      {...field} 
                      disabled={loading || googleLoading} 
                    />
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
              <FormItem className="space-y-4">
                <FormLabel className="text-lg font-medium flex items-center">
                  <UserCheck className="w-5 h-5 mr-2" />
                  {languageText.iAmA}
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4"
                    disabled={loading || googleLoading}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0 border-2 border-gray-200 rounded-lg p-4 hover:border-purple transition-colors cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="parent" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">{languageText.parent}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border-2 border-gray-200 rounded-lg p-4 hover:border-purple transition-colors cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="teacher" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">{languageText.teacher}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border-2 border-gray-200 rounded-lg p-4 hover:border-purple transition-colors cursor-pointer">
                      <FormControl>
                        <RadioGroupItem value="student" />
                      </FormControl>
                      <FormLabel className="font-normal cursor-pointer">{languageText.student}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0 border-2 border-gray-200 rounded-lg p-4 hover:border-purple transition-colors cursor-pointer">
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
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple to-teal hover:from-purple-600 hover:to-teal-600 transition-all duration-200 shadow-lg" 
            disabled={loading || googleLoading}
          >
            {loading ? "Creating account..." : languageText.signUp}
          </Button>
        </form>
      </Form>
      
      <div className="mt-8 text-center">
        <p className="text-muted-foreground">
          {languageText.alreadyHaveAccount}{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto font-semibold text-purple hover:text-purple-600 transition-colors" 
            onClick={() => navigate('/login')}
            disabled={loading || googleLoading}
          >
            {languageText.logIn}
          </Button>
        </p>
      </div>
    </Card>
  );
};
