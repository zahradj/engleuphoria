
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
import { useClassroomAuth } from "@/hooks/useClassroomAuth";
import { useState } from "react";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  userType: z.enum(["parent", "teacher", "student", "admin"], { 
    required_error: "Please select a user type" 
  }),
});

export const SignUpForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();
  const { signUp } = useClassroomAuth();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      userType: "parent",
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

  return (
    <Card className="w-full max-w-md p-6 shadow-lg relative overflow-hidden">
      {/* Card inner glow effects */}
      <div className="absolute -z-10 top-0 left-0 w-[80%] h-[80%] bg-purple/10 rounded-full blur-2xl"></div>
      <div className="absolute -z-10 bottom-0 right-0 w-[60%] h-[60%] bg-teal/5 rounded-full blur-2xl"></div>
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">{languageText.createAccount}</h2>
        <p className="text-muted-foreground">Join our English learning community</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{languageText.fullName}</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} disabled={loading} />
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
                <FormLabel>{languageText.email}</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} disabled={loading} />
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
                <FormLabel>{languageText.password}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••" {...field} disabled={loading} />
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
                <FormLabel>{languageText.iAmA}</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                    disabled={loading}
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="parent" />
                      </FormControl>
                      <FormLabel className="font-normal">{languageText.parent}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="teacher" />
                      </FormControl>
                      <FormLabel className="font-normal">{languageText.teacher}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="student" />
                      </FormControl>
                      <FormLabel className="font-normal">{languageText.student}</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="admin" />
                      </FormControl>
                      <FormLabel className="font-normal">Admin</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : languageText.signUp}
          </Button>
        </form>
      </Form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {languageText.alreadyHaveAccount}{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto font-normal" 
            onClick={() => navigate('/login')}
            disabled={loading}
          >
            {languageText.logIn}
          </Button>
        </p>
      </div>
    </Card>
  );
};
