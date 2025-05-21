
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false),
});

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // This would connect to authentication service in a real app
    console.log(values);
    toast({
      title: "Login Successful",
      description: "Redirecting to your dashboard...",
    });
    setTimeout(() => navigate("/dashboard"), 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background circular effects with animations */}
      <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/20 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
      <div className="absolute -z-10 bottom-1/3 right-1/4 w-[90%] h-[90%] bg-teal/15 rounded-full blur-3xl animate-pulse-subtle opacity-65 animation-delay-300"></div>
      <div className="absolute -z-10 top-1/2 left-1/2 w-[80%] h-[80%] bg-orange/10 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-700"></div>
      
      {/* Header with animation */}
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-3 px-4 relative z-10 animate-fade-in">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer animate-fade-in"
          >
            <div className="bg-purple/20 rounded-full p-2">
              <span className="text-xl font-bold text-purple">E!</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
              Engleuphoria
            </h1>
          </div>
          
          <div className="flex items-center gap-4 animate-fade-in animation-delay-300">
            <Button variant="ghost" onClick={() => navigate('/for-parents')}>For Parents</Button>
            <Button variant="ghost" onClick={() => navigate('/for-teachers')}>For Teachers</Button>
            <Button variant="outline" className="font-semibold" onClick={() => navigate('/login')}>Log In</Button>
            <Button onClick={() => navigate('/signup')}>Sign Up</Button>
          </div>
        </div>
      </header>
      
      {/* Main Content with animation */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10 animate-fade-in animation-delay-500">
        <Card className="w-full max-w-md p-6 shadow-lg relative overflow-hidden animate-scale-in animation-delay-700">
          {/* Card inner glow effects */}
          <div className="absolute -z-10 top-0 left-0 w-[80%] h-[80%] bg-purple/10 rounded-full blur-2xl animate-blur-fade"></div>
          <div className="absolute -z-10 bottom-0 right-0 w-[60%] h-[60%] bg-teal/5 rounded-full blur-2xl animate-blur-fade animation-delay-300"></div>
          
          <div className="text-center mb-6 animate-fade-in">
            <h2 className="text-2xl font-bold">Welcome Back!</h2>
            <p className="text-muted-foreground">Log in to continue your English journey</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="animate-fade-in animation-delay-300">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="animate-fade-in animation-delay-500">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex items-center justify-between animate-fade-in animation-delay-700">
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium cursor-pointer">
                        Remember me
                      </FormLabel>
                    </FormItem>
                  )}
                />
                
                <Button variant="link" className="p-0 h-auto font-normal" type="button">
                  Forgot password?
                </Button>
              </div>
              
              <Button type="submit" className="w-full animate-bounce-light">
                Log In
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center animate-fade-in animation-delay-700">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Button variant="link" className="p-0 h-auto font-normal" onClick={() => navigate('/signup')}>
                Sign up
              </Button>
            </p>
          </div>
        </Card>
      </main>
      
      {/* Footer with animation */}
      <footer className="w-full bg-muted/50 py-4 px-4 text-center relative z-10 animate-fade-in animation-delay-700">
        <div className="container max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Engleuphoria. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
