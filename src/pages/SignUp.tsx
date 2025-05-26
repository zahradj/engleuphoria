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

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageText } = useLanguage();
  
  const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    userType: z.enum(["parent", "teacher", "student"], { 
      required_error: "Please select a user type" 
    }),
  });
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      userType: "parent",
    },
  });
  
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Store user data in localStorage for payment page
    localStorage.setItem('pendingUser', JSON.stringify({
      name: values.name,
      email: values.email,
      userType: values.userType
    }));
    
    console.log(values);
    toast({
      title: "Account created!",
      description: "Welcome to Engleuphoria! Please complete your payment to activate your account.",
    });
    
    // Redirect based on user type
    if (values.userType === "student") {
      setTimeout(() => navigate("/payment"), 1500);
    } else {
      setTimeout(() => navigate("/dashboard"), 1500);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Background circular effects */}
      <div className="absolute -z-10 top-1/4 left-1/4 w-[110%] h-[110%] bg-purple/20 rounded-full blur-3xl animate-pulse-subtle opacity-70"></div>
      <div className="absolute -z-10 bottom-1/3 right-1/4 w-[90%] h-[90%] bg-teal/15 rounded-full blur-3xl animate-pulse-subtle opacity-65 animation-delay-300"></div>
      <div className="absolute -z-10 top-1/2 left-1/2 w-[80%] h-[80%] bg-orange/10 rounded-full blur-3xl animate-pulse-subtle opacity-60 animation-delay-700"></div>
      
      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm shadow-sm py-3 px-4 relative z-10">
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="bg-purple/20 rounded-full p-2">
              <span className="text-xl font-bold text-purple">E!</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple to-teal bg-clip-text text-transparent">
              Engleuphoria
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/for-parents')}>{languageText.forParents}</Button>
            <Button variant="ghost" onClick={() => navigate('/for-teachers')}>{languageText.forTeachers}</Button>
            <Button variant="outline" onClick={() => navigate('/login')}>{languageText.logIn}</Button>
            <Button className="font-semibold" onClick={() => navigate('/signup')}>{languageText.signUp}</Button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
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
                      <Input placeholder="Your name" {...field} />
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
                  <FormItem>
                    <FormLabel>{languageText.password}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
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
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full">
                {languageText.signUp}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {languageText.alreadyHaveAccount}{" "}
              <Button variant="link" className="p-0 h-auto font-normal" onClick={() => navigate('/login')}>
                {languageText.logIn}
              </Button>
            </p>
          </div>
        </Card>
      </main>
      
      {/* Footer */}
      <footer className="w-full bg-muted/50 py-4 px-4 text-center relative z-10">
        <div className="container max-w-7xl mx-auto">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Engleuphoria. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
