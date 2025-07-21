import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, Eye, EyeOff, GraduationCap, Lock, Mail, User, X, Home } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { ModernLanguageSwitcher } from '@/components/common/ModernLanguageSwitcher';

interface SimpleAuthFormProps {
  mode?: 'login' | 'signup';
}

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password" }).optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const SimpleAuthForm = ({ mode = 'login' }: SimpleAuthFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"student" | "teacher" | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await signIn(values.email, values.password);
        toast({
          title: "Login Successful",
          description: "You have successfully logged in.",
        });
        navigate('/dashboard');
      } else {
        if (!selectedRole) {
          toast({
            title: "Error",
            description: "Please select a role (student or teacher).",
            variant: "destructive",
          });
          return;
        }

        await signUp(values.email, values.password, { role: selectedRole });
        toast({
          title: "Signup Successful",
          description: "Your account has been created.",
        });
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: error.message || "Failed to authenticate. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    if (mode === 'login') {
      navigate('/signup');
    } else {
      navigate('/login');
    }
  };

  const handleRoleSelect = (role: 'student' | 'teacher') => {
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4" style={{ background: 'var(--gradient-bg)' }}>
      {/* Playful Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-24 h-24 rounded-full bg-gradient-to-r from-accent/30 to-orange/30 animate-bounce" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 rounded-full bg-gradient-to-r from-success/20 to-primary/20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/4 right-1/3 w-16 h-16 rounded-full bg-gradient-to-r from-orange/25 to-accent/25 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Floating Shapes */}
        <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-primary/30 rotate-45 animate-spin" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-secondary/40 rounded-full animate-ping" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="absolute top-4 left-4 z-10">
        <Link to="/">
          <Button 
            variant="outline" 
            size="sm"
            className="bg-white/90 backdrop-blur-sm border-2 border-primary/20 hover:border-primary/40 hover:bg-white transition-all duration-300 shadow-lg"
          >
            <Home className="h-4 w-4 mr-2 text-primary" />
            <span className="font-medium text-primary">Home</span>
          </Button>
        </Link>
      </div>

      <div className="absolute top-4 right-4 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border-2 border-primary/20">
          <ModernLanguageSwitcher size="sm" />
        </div>
      </div>
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        <Card className="border-0 overflow-hidden" style={{ 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9))', 
          backdropFilter: 'blur(25px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px hsl(var(--primary) / 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}>
          <CardHeader className="space-y-6 pb-8 relative">
            {/* Enhanced Header Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-secondary/6 to-accent/8 rounded-t-lg border-b border-white/20"></div>
            
            <div className="flex flex-col items-center space-y-4 relative z-10">
              <div className="flex justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                  <div className="relative bg-white p-4 rounded-full shadow-lg border-2 border-primary/20">
                    <img 
                      src="/lovable-uploads/f12c3468-7973-4cd5-a380-b4c18be3e69b.png" 
                      alt="Engleuphoria Logo" 
                      className="h-12 w-auto object-contain"
                    />
                  </div>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold animate-fade-in" style={{ 
                  background: 'var(--gradient-primary)', 
                  WebkitBackgroundClip: 'text', 
                  WebkitTextFillColor: 'transparent' 
                }}>
                  {mode === 'login' ? t('welcomeBack') : t('createAccount')}
                </h1>
                <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  {mode === 'login' 
                    ? t('loginSubtitle', 'Welcome back to your learning journey') 
                    : t('signupSubtitle', 'Start your English learning adventure')
                  }
                </p>
              </div>

              {mode !== 'login' && !selectedRole && (
                <div className="w-full space-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                  <p className="text-center text-sm font-medium text-muted-foreground">{t('iAmA')}</p>
                  <div className="grid gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto p-4 justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-primary/30"
                      style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))' }}
                      onClick={() => handleRoleSelect('student')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden group"
                             style={{ background: 'linear-gradient(135deg, hsl(220 100% 65%), hsl(280 100% 65%))' }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent group-hover:from-white/40 transition-all"></div>
                          <img 
                            src="/lovable-uploads/f12c3468-7973-4cd5-a380-b4c18be3e69b.png" 
                            alt="Logo" 
                            className="h-8 w-8 object-contain relative z-10 group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-primary">{t('student')}</div>
                          <div className="text-sm text-muted-foreground">{t('studentDescription', 'Learn English with fun activities')}</div>
                        </div>
                      </div>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="h-auto p-4 justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-secondary/30"
                      style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))' }}
                      onClick={() => handleRoleSelect('teacher')}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden group"
                             style={{ background: 'linear-gradient(135deg, hsl(140 100% 60%), hsl(195 100% 65%))' }}>
                          <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent group-hover:from-white/40 transition-all"></div>
                          <GraduationCap className="h-8 w-8 text-white relative z-10 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-secondary">{t('teacher')}</div>
                          <div className="text-sm text-muted-foreground">{t('teacherDescription', 'Create engaging lessons for students')}</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          {(mode === 'login' || selectedRole) && (
            <CardContent className="space-y-6 animate-fade-in relative" style={{ animationDelay: '0.6s' }}>
              {/* Enhanced Content Background */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-white/60 rounded-lg -mx-6 -my-6"></div>
              <div className="relative z-10">
              {mode !== 'login' && selectedRole && (
                <div className="flex items-center justify-center space-x-3 p-4 rounded-lg border-2" 
                     style={{ 
                       background: selectedRole === 'student' 
                         ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))'
                         : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.1))',
                       borderColor: selectedRole === 'student' ? 'hsl(var(--primary) / 0.3)' : 'hsl(var(--secondary) / 0.3)'
                     }}>
                  <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${selectedRole === 'student' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-emerald-500 to-blue-500'}`}>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent"></div>
                    {selectedRole === 'student' ? (
                      <img 
                        src="/lovable-uploads/f12c3468-7973-4cd5-a380-b4c18be3e69b.png" 
                        alt="Logo" 
                        className="h-6 w-6 object-contain relative z-10"
                      />
                    ) : (
                      <GraduationCap className="h-6 w-6 text-white relative z-10" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{selectedRole === 'student' ? t('student') : t('teacher')}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedRole === 'student' ? t('studentDescription', 'Learn English with fun activities') : t('teacherDescription', 'Create engaging lessons for students')}
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                    className="ml-auto hover:bg-destructive/20 hover:text-destructive transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                  {mode !== 'login' && (
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">{t('fullName')}</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary transition-colors group-focus-within:text-primary" />
                              <Input 
                                placeholder={t('enterFullName', 'Enter your full name')} 
                                className="pl-10 border-2 border-muted focus:border-primary transition-all duration-300 bg-background/50" 
                                {...field} 
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">{t('email')}</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary transition-colors group-focus-within:text-secondary" />
                            <Input 
                              placeholder={t('enterEmail', 'Enter your email')} 
                              className="pl-10 border-2 border-muted focus:border-secondary transition-all duration-300 bg-background/50" 
                              type="email" 
                              {...field} 
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
                        <FormLabel className="text-foreground font-medium">{t('password')}</FormLabel>
                        <FormControl>
                          <div className="relative group">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent transition-colors group-focus-within:text-accent" />
                            <Input
                              placeholder={t('enterPassword', 'Enter your password')}
                              className="pl-10 pr-10 border-2 border-muted focus:border-accent transition-all duration-300 bg-background/50"
                              type={showPassword ? "text" : "password"}
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-muted-foreground hover:text-accent transition-colors" />
                              ) : (
                                <Eye className="h-4 w-4 text-muted-foreground hover:text-accent transition-colors" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {mode !== 'login' && (
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground font-medium">{t('confirmPassword', 'Confirm Password')}</FormLabel>
                          <FormControl>
                            <div className="relative group">
                              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange transition-colors group-focus-within:text-orange" />
                              <Input
                                placeholder={t('confirmPasswordPlaceholder', 'Confirm your password')}
                                className="pl-10 pr-10 border-2 border-muted focus:border-orange transition-all duration-300 bg-background/50"
                                type={showConfirmPassword ? "text" : "password"}
                                {...field}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-muted-foreground hover:text-orange transition-colors" />
                                ) : (
                                  <Eye className="h-4 w-4 text-muted-foreground hover:text-orange transition-colors" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {mode === 'login' && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="remember" className="border-primary data-[state=checked]:bg-primary" />
                        <label
                          htmlFor="remember"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t('rememberMe')}
                        </label>
                      </div>
                      <Button variant="link" className="px-0 font-normal text-secondary hover:text-secondary/80" type="button">
                        {t('forgotPassword')}
                      </Button>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full text-lg font-bold py-6 transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 text-white relative overflow-hidden group" 
                    style={{ 
                      background: mode === 'login' 
                        ? 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))' 
                        : 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--orange)))',
                      boxShadow: mode === 'login'
                        ? '0 8px 25px hsl(var(--primary) / 0.4), 0 0 0 1px hsl(var(--primary) / 0.2)'
                        : '0 8px 25px hsl(var(--accent) / 0.4), 0 0 0 1px hsl(var(--accent) / 0.2)'
                    }}
                    disabled={isLoading}
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        <span>{mode === 'login' ? t('signingIn', 'Signing in...') : t('creatingAccount', 'Creating account...')}</span>
                      </div>
                    ) : (
                      <span className="flex items-center justify-center space-x-2">
                        <span>{mode === 'login' ? t('signIn', 'Sign In') : t('createAccount')}</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                    </div>
                  </Button>
                </form>
              </Form>
              </div>
            </CardContent>
          )}

          <CardFooter className="justify-center pb-8 relative">
            {/* Footer background for better separation */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent rounded-b-lg"></div>
            <p className="text-sm text-muted-foreground relative z-10">
              {mode === 'login' ? t('dontHaveAccount') : t('alreadyHaveAccount')}{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-bold text-lg hover:scale-110 transition-all duration-200 underline-offset-4" 
                style={{ 
                  background: mode === 'login' 
                    ? 'linear-gradient(135deg, hsl(var(--accent)), hsl(var(--orange)))' 
                    : 'linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
                onClick={toggleMode}
              >
                {mode === 'login' ? t('signUp') : t('logIn')}
              </Button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
